# WebSockety w aplikacji

Notatka o tym, jak działa kanał WebSocket, jak się go konfiguruje w Springu
i co zmieniliśmy, żeby każdy użytkownik widział tylko swoje komunikaty.

## Do czego służy WebSocket w aplikacji

Jedynym zastosowaniem jest **log postępu importu z Google Drive** (jedzenie i treningi).
Serwer wysyła komunikaty typu „Loading products...”, „Meals processed: 120/300”,
a frontend pokazuje je na stronie głównej w `LogComponent`.

Kanał działa tylko w jedną stronę: **serwer → przeglądarka**. Klient niczego nie wysyła.

## Jak to wyglądało wcześniej (problemy)

Przed zmianami (commity `ab462c1 Secure websocket channel`, `fa05ae1 Add handling different users in web socket`):

1. **Endpoint `/ws/**` był publiczny** (`permitAll()` w `WebSecurityConfig`) — połączyć mógł się każdy, bez logowania.
2. **Komunikaty szły na wspólny temat `/topic/messages`** (`convertAndSend("/topic/messages", ...)`).
   Broker rozsyłał je do *wszystkich* podłączonych klientów — użytkownik A widział postęp importu użytkownika B.
3. **Klient mógł wysyłać wiadomości** (był `MessageController` z `@MessageMapping`), więc dało się
   rozsyłać własne komunikaty innym.
4. Były testowe endpointy (`TestController`), niepotrzebne na produkcji.

## Jak to działa teraz — przepływ

```
Przeglądarka                                 Backend (Spring)
------------                                 ----------------
1. SockJS GET /ws/info  (cookie z JWT)  ──▶  AuthTokenFilter czyta JWT z cookie,
                                             ustawia użytkownika w SecurityContext.
                                             /ws/** wymaga zalogowania → bez JWT 401.
2. Handshake WebSocket                  ──▶  Spring zapamiętuje Principal z żądania HTTP
                                             jako użytkownika tej sesji WebSocket.
3. STOMP CONNECT                        ──▶  WebSocketAuthChannelInterceptor: jest użytkownik? OK.
4. STOMP SUBSCRIBE /user/queue/messages ──▶  Interceptor: tylko /user/queue/** dozwolone.
                                             Spring zamienia to na kolejkę tej konkretnej sesji
                                             (np. /queue/messages-user<sessionId>).
5. Import z Google Drive                     Kontroler bierze username z @AuthenticationPrincipal,
                                             serwis woła userLogNotifier.send(username, "...").
6. MESSAGE                              ◀──  convertAndSendToUser(username, ...) trafia tylko
                                             do sesji tego użytkownika.
```

## Konfiguracja w Springu — krok po kroku

### 1. Zależność

`spring-boot-starter-websocket` w `pom.xml` (zawiera też STOMP i prosty broker w pamięci).

### 2. `WebSocketConfig` — broker i endpoint

`Backend/src/main/java/com/improvement_app/security/config/WebSocketConfig.java`

```java
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/queue");               // tylko kolejki, bez /topic
        config.setApplicationDestinationPrefixes("/app");
        config.setUserDestinationPrefix("/user");          // /user/... = adresy per użytkownik
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns(...)             // te same originy co CORS
                .withSockJS();
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(new WebSocketAuthChannelInterceptor());
    }
}
```

Najważniejsze pojęcia:

| Element | Znaczenie |
|---|---|
| `enableSimpleBroker("/queue")` | Broker w pamięci obsługuje tylko adresy `/queue/**`. Celowo **nie ma `/topic`** — nie istnieje żaden kanał „dla wszystkich”. |
| `setUserDestinationPrefix("/user")` | Adresy zaczynające się od `/user/` Spring traktuje jako prywatne — tłumaczy je na kolejkę konkretnej sesji danego użytkownika. |
| `setApplicationDestinationPrefixes("/app")` | Prefiks dla wiadomości od klienta do `@MessageMapping`. U nas nieużywany (SEND jest zablokowany). |
| `addEndpoint("/ws").withSockJS()` | Adres, pod którym przeglądarka otwiera połączenie. SockJS daje fallback, gdy czysty WebSocket nie działa. |
| `setAllowedOriginPatterns(...)` | Z jakich domen wolno się łączyć — te same co CORS (`app.security.cors.allowed-origins`). |

### 3. Zabezpieczenie handshake'u — `WebSecurityConfig`

Usunęliśmy `permitAll()` dla `/ws/**`. Teraz `/ws/**` podpada pod `anyRequest().authenticated()`.
Handshake SockJS to zwykłe żądanie HTTP, więc przeglądarka dokleja cookie z JWT
(`axios.defaults.withCredentials = true`, cookie ustawia `AuthCookieManager`),
a `AuthTokenFilter` uwierzytelnia je tak samo jak każde inne żądanie REST.

Efekt: bez zalogowania `GET /ws/info` zwraca **401** i połączenie w ogóle nie powstaje.

Uwaga: w CSP jest `connect-src 'self' ws: wss:` — bez tego przeglądarka zablokowałaby połączenie WebSocket.

### 4. Zabezpieczenie ramek STOMP — `WebSocketAuthChannelInterceptor`

`Backend/src/main/java/com/improvement_app/security/config/WebSocketAuthChannelInterceptor.java`

Interceptor sprawdza każdą ramkę od klienta (`preSend` na `clientInboundChannel`):

| Komenda | Reguła |
|---|---|
| `CONNECT`, `STOMP` | Musi być użytkownik przeniesiony z handshake'u. |
| `SUBSCRIBE` | Musi być użytkownik **i** adres musi zaczynać się od `/user/queue/`. Wszystko inne (np. `/topic/...`, `/queue/...` bez `/user`) jest odrzucane. |
| `SEND` | Zawsze odrzucany — klient nie może wysyłać wiadomości (ani do `/app`, ani bezpośrednio do brokera). |
| `DISCONNECT`, `UNSUBSCRIBE`, heartbeat itd. | Bez ograniczeń. |

Odrzucenie = `AccessDeniedException` + własny log `WARN` z przyczyną, komendą, adresem i użytkownikiem
(Spring sam loguje tylko ogólne „Failed to send message to clientInboundChannel”, bez powodu).

Dlaczego dwie warstwy (handshake + interceptor)? Handshake pilnuje, *kto* się łączy;
interceptor pilnuje, *co* ten ktoś robi w ramach połączenia.

### 5. Wysyłanie do konkretnego użytkownika — `UserLogNotifier`

`Backend/src/main/java/com/improvement_app/common/websocket/UserLogNotifier.java`

```java
public static final String USER_LOG_DESTINATION = "/queue/messages";

public void send(String username, String message) {
    messagingTemplate.convertAndSendToUser(username, USER_LOG_DESTINATION, message);
}
```

- `convertAndSendToUser(username, "/queue/messages", msg)` zamiast `convertAndSend("/topic/messages", msg)`.
- Spring szuka sesji WebSocket, których `Principal.getName()` == `username`, i wysyła tylko do nich
  (jeśli użytkownik ma kilka kart — dostanie w każdej).
- Wszystkie miejsca importu (`FoodDataInitializationService`, `MealInitializer`, `ProductInitializer`,
  `SweetsInitializer`, `workouts/InitializationService`) używają `UserLogNotifier`, a nie bezpośrednio
  `SimpMessagingTemplate`.
- `username` przechodzi z kontrolera: `@AuthenticationPrincipal(expression = "username") String username`
  → `initializationUseCase.initializeData(username)` → initializery.

Ważne: nazwa przekazana do `convertAndSendToUser` musi być **tą samą** wartością, co `Principal.getName()`
sesji WebSocket — u nas to `username` z JWT, w obu miejscach.

### 6. Frontend — `LogComponent.jsx`

`frontend5/src/home/LogComponent.jsx`

```js
const client = new Client({
  webSocketFactory: () => new SockJS(`${host_url}ws`),
  reconnectDelay: 5000,
  onConnect: () => {
    client.subscribe('/user/queue/messages', (message) => { ... });
  },
});
```

- Subskrypcja na `/user/queue/messages` (wcześniej `/topic/messages`).
- Klient **nie podaje** swojej nazwy użytkownika w adresie — Spring sam wie, kim jest sesja.
- Próba podsłuchu przez subskrypcję `/user/<inny-user>/queue/messages` jest odrzucana przez interceptor,
  bo adres nie zaczyna się od `/user/queue/`. Serwer odpowiada ramką `ERROR` i zamyka sesję.
  Potwierdza to test `cannotEavesdropOnOtherUsersQueue`.

## Testy

| Test | Co sprawdza |
|---|---|
| `WebSocketSecurityIntegrationTest` | `GET /ws/info` bez logowania → 401, zalogowany → 200. |
| `WebSocketAuthChannelInterceptorTest` | Reguły interceptora: CONNECT/SUBSCRIBE z użytkownikiem OK, bez użytkownika odrzucone, SUBSCRIBE poza `/user/queue/**` odrzucony, SEND zawsze odrzucony, DISCONNECT przechodzi. |
| `UserLogNotifierWebSocketIntegrationTest` | Prawdziwe połączenia STOMP dwóch użytkowników: komunikat dla A dociera tylko do A, nie do B; próba podsłuchania cudzej kolejki nic nie daje. |

## Zasady na przyszłość

- **Nowy typ powiadomienia dla użytkownika** → nowa kolejka pod `/queue/...`, wysyłka przez
  `convertAndSendToUser`, subskrypcja na froncie `/user/queue/...`. Nic więcej nie trzeba odblokowywać.
- **Nie dodawać `/topic` do brokera**, chyba że naprawdę potrzebny jest komunikat dla wszystkich —
  wtedy trzeba też świadomie rozszerzyć interceptor o ten konkretny adres.
- **Nie przywracać `permitAll()` dla `/ws/**`.**
- **Jeśli klient ma kiedyś wysyłać wiadomości** (`SEND` do `@MessageMapping`) — odblokować w interceptorze
  tylko konkretne adresy `/app/...`, nigdy bezpośrednio adresów brokera.
- **Simple broker działa w pamięci jednej instancji.** Przy kilku instancjach backendu komunikat z jednej
  nie dotrze do użytkownika podłączonego do drugiej — wtedy potrzebny byłby zewnętrzny broker
  (np. RabbitMQ przez `enableStompBrokerRelay`). Przy jednym serwerze nie ma to znaczenia.
