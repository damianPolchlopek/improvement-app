# Opis testów w projekcie

Ten plik opisuje wszystkie testy automatyczne w repozytorium: co sprawdzają, jakie są warunki wejściowe i jaki jest oczekiwany rezultat. Testy pogrupowane są wg modułów backendu (`Backend/src/test/java/...`). Na końcu opisany jest też jedyny test we frontendzie.

Legenda typów testów:
- **Unit** — czysty test jednostkowy (Mockito, bez Springa, bez bazy danych).
- **E2E / Integracyjny** — pełny kontekst Springa, realna baza (Testcontainers), żądania HTTP (RestAssured / MockMvc).

---

## 1. Moduł `common` (konfiguracja)

### 1.1 `CommonErrorResponsesCustomizerTest` (Unit)

Sprawdza logikę `CommonErrorResponsesCustomizer`, który dopisuje domyślne odpowiedzi błędów (400/401) do dokumentacji OpenAPI/Swagger dla operacji, które ich jeszcze nie mają.

| Test | Warunki | Oczekiwany rezultat |
|---|---|---|
| `shouldAddMissingCommonResponses` | Operacja ma zdefiniowaną tylko odpowiedź `200` | Po `customize()` operacja zawiera klucze `200`, `400` i `401` |
| `shouldNotOverrideExistingResponse` | Operacja już ma własny opis dla `400` | `400` zachowuje oryginalny opis ("Własny opis błędu"), a `401` zostaje dopisane |

### 1.2 `RateLimitFilterTest` (Unit)

Testuje `common/ratelimit/RateLimitFilter` na `MockHttpServletRequest`, bez Springa. Limity w testach: default 3/min, auth 2/min, heavy (Drive) 1/min, globalny 100/s (w części testów niższy).

| Test | Warunki | Oczekiwany rezultat |
|---|---|---|
| `shouldPassRequestsUnderLimit` | 2 żądania z jednego IP | `200`; `X-RateLimit-Remaining` maleje 2 → 1 |
| `shouldRejectWith429WhenLimitExceeded` | 4. żądanie przy limicie 3 | `429`, JSON `ErrorResponse` (`code=RATE_LIMIT_EXCEEDED`), UTF-8, `Retry-After` 1–60 s, dalszy łańcuch nie wywołany |
| `shouldLimitEachIpSeparately` | IP 1 wyczerpało limit | IP 1 dostaje `429`, IP 2 dostaje `200` |
| `shouldLimitAuthenticatedUsersSeparately` | Dwóch zalogowanych userów za jednym IP | Limit liczony per user — drugi user przechodzi |
| `shouldApplyStricterSeparateLimitForAuthEndpoints` | 3× `/auth/signin` | 3. żądanie `429`; limit zwykłego API nietknięty |
| `shouldKeyAuthEndpointsByIpEvenWhenAuthenticated` | Logowanie z jednego IP jako różni userzy | Limit logowania liczony per IP, nie per user |
| `shouldApplyHeavyLimitForDriveEndpoints` | 2× `/drive/**` | 2. żądanie `429`, zwykłe API dalej `200` |
| `shouldNotDrainGlobalBucketWithRejectedRequests` | Globalny limit 5/s, jedno IP wysyła 20 żądań | Inne IP dalej przechodzą — odrzucone żądania nie zużywają limitu globalnego |
| `shouldRejectWhenGlobalLimitExceeded` | Globalny limit 2/s, 3 żądania z różnych IP | 3. żądanie `429` z komunikatem o obciążeniu serwera |
| `shouldSkipExcludedRequests` | `OPTIONS`, `/actuator/**`, `/ws/**` | Zawsze `200`, bez nagłówka limitu; nie zużywają limitu API |
| `shouldPassEverythingWhenDisabled` | `enabled=false` | Wszystkie żądania przechodzą |
| `shouldMatchPathsWithContextPath` | Aplikacja pod context path `/app` | `/app/api/v1/auth/signin` trafia do limitu AUTH |

### 1.3 `RateLimitFilterIntegrationTest` (E2E)

Pełny kontekst Springa (Testcontainers) — sprawdza, że filtr jest podpięty w łańcuchu Security. Limity nadpisane: auth 2/min, default 5/min.

| Test | Warunki | Oczekiwany rezultat |
|---|---|---|
| `signinShouldBeRateLimited` | 3× `POST /api/v1/auth/signin` | Pierwsze dwa nie są `429`; trzecie `429` z JSON-em i `Retry-After` |
| `anonymousRequestsToProtectedApiShouldBeRateLimited` | Anonimowe `GET /api/v1/trainings` | `401` z `X-RateLimit-Remaining: 4` (filtr działa przed autoryzacją); 6. żądanie `429` |

---

## 2. Moduł `food` (dieta/produkty/posiłki)

Baza: `AbstractE2ETest` — pełny kontekst Springa (`RANDOM_PORT`), realna baza PostgreSQL w Testcontainerze, bezpieczeństwo wyłączone (`addFilters = false`), żądania przez RestAssured. Przed każdym testem resetowany jest Faker (generator danych testowych).

### 2.1 `MealControllerTest` (E2E)

| Test | Warunki | Oczekiwany rezultat |
|---|---|---|
| `shouldReturnMealCategories` | Brak przygotowanych danych | `GET /api/v1/food/meal/categories` → `200 OK`, JSON identyczny (strict) z `expected/food/meal_categories.json` |
| `shouldReturnMealTypes` | Brak przygotowanych danych | `GET /api/v1/food/meal/types` → `200 OK`, JSON identyczny (strict) z `expected/food/meal_types.json` |
| `shouldReturnSortedMealIngredients` | Wygenerowano usera, 20 produktów, 10 przepisów (po 5 składników) | `GET /api/v1/food/meal/34/ingredients` → `200 OK`, treść zgodna (strict) z `expected/food/meal_ingredients.json` (składniki posortowane) |
| `shouldReturnMeals` | Wygenerowano usera, 20 produktów, 10 przepisów; filtr: pusta nazwa, kategoria/typ/popularność = `ALL`, sort po nazwie | `GET /api/v1/food/meal` z parametrami → `200 OK`, treść zgodna (lenient — dodatkowe pola jak `productId`/`mealRecipeId` są dozwolone) z `expected/food/meal_search.json` |

### 2.2 `ProductControllerTest` (E2E)

| Test | Warunki | Oczekiwany rezultat |
|---|---|---|
| `shouldReturnProductCategories` | Brak przygotowanych danych | `GET /api/v1/food/product/categories` → `200 OK`, JSON identyczny (strict) z `expected/food/product_categories.json` |
| `shouldReturnProducts` | Wygenerowano 50 produktów; filtr: pusta nazwa, kategoria = "Mięso" | `GET /api/v1/food/product` → `200 OK`, treść zgodna (strict) z `expected/food/product_search.json` |

### 2.3 `SearchMealTest`

Klasa pusta — jedyny test jest zakomentowany (wyłączony), więc obecnie nic nie sprawdza. Warto usunąć lub odblokować w przyszłości.

---

## 3. Moduł `security` (uwierzytelnianie, JWT, tokeny)

### 3.1 `AuthControllerIntegrationTest` (E2E)

Pełny kontekst Springa (`RANDOM_PORT`), realna baza w Testcontainerze, `EmailService` zamockowany (żeby nie wysyłać realnych maili). Testuje ścieżkę REST end-to-end kontrolera `AuthController`.

**POST /signup**

| Test | Warunki | Oczekiwany rezultat |
|---|---|---|
| `signupShouldCreateInactiveUserAndSendVerificationEmail` | Poprawne dane rejestracji, nowy username/email | `200 OK`, komunikat zawiera "registered successfully"; user w bazie ma `emailVerified=false`, `isActive=false`, hasło zahashowane (nie plain-text); wywołane `emailService.sendVerificationEmail(...)` |
| `signupShouldFailWhenUsernameTaken` | Username już istnieje w bazie | `400 Bad Request`, kod błędu `USER_ALREADY_EXISTS`; `emailService` w ogóle nie wywołany |
| `signupShouldFailWhenEmailTaken` | Email już istnieje w bazie | `400 Bad Request`, kod błędu `USER_ALREADY_EXISTS` |

**POST /signin**

| Test | Warunki | Oczekiwany rezultat |
|---|---|---|
| `signinShouldReturnTokensInCookiesForValidUser` | Zweryfikowany, aktywny user, poprawne hasło | `200 OK`, cookies `access_token`/`refresh_token` niepuste, w body username/email/role |
| `signinShouldReturn401ForBadPassword` | Istniejący user, złe hasło | `401 Unauthorized`, kod `INVALID_CREDENTIALS` |
| `signinShouldReturn401ForUnknownUser` | User nie istnieje w bazie | `401 Unauthorized`, kod `INVALID_CREDENTIALS` (nie ujawnia, że usera nie ma) |
| `signinShouldReturn403WhenEmailNotVerified` | User istnieje, ale email niezweryfikowany | `403 Forbidden`, kod `EMAIL_NOT_VERIFIED` |

**GET /verify-email**

| Test | Warunki | Oczekiwany rezultat |
|---|---|---|
| `verifyEmailShouldActivateUser` | Niezweryfikowany user + ważny token weryfikacyjny w bazie | `200 OK`, komunikat "Email verified"; user w bazie ma `emailVerified=true` i `isActive=true` |
| `verifyEmailShouldReturn400ForInvalidToken` | Token nie istnieje w bazie | `400 Bad Request`, kod `INVALID_TOKEN` |
| `verifyEmailShouldRejectExpiredToken` | Token istnieje, ale wygasł (`expiresAt` w przeszłości) | Status ≥ 400; user w bazie pozostaje `emailVerified=false`, `isActive=false` |

**POST /resend-verification**

| Test | Warunki | Oczekiwany rezultat |
|---|---|---|
| `resendVerificationShouldSendEmailForExistingUser` | Niezweryfikowany user istnieje | `200 OK`, ponowna wysyłka maila weryfikacyjnego |
| `resendVerificationShouldFailForUnknownUser` | Username nie istnieje | `400 Bad Request`, `emailService` nie wywołany |

**POST /logout**

| Test | Warunki | Oczekiwany rezultat |
|---|---|---|
| `logoutShouldClearAuthCookies` | Brak wymaganych warunków wstępnych | `204 No Content`; cookies `access_token` i `refresh_token` ustawione na puste (czyszczenie sesji) |

**POST /refresh-token**

| Test | Warunki | Oczekiwany rezultat |
|---|---|---|
| `refreshTokenShouldReturn401WithoutCookie` | Brak cookie `refresh_token` w żądaniu | `401 Unauthorized`, kod `UNAUTHORIZED` |
| `refreshTokenShouldReturn401ForInvalidToken` | Cookie `refresh_token` zawiera losowy, niepoprawny string | `401 Unauthorized`, kod `UNAUTHORIZED` |
| `refreshTokenShouldReturnNewAccessTokenForValidRefreshCookie` | Najpierw wykonano `/signin` i pobrano prawidłowy `refresh_token` z cookies | `200 OK`, nowy `access_token` w cookie, `accessTokenExpiresAt` w przyszłości |

### 3.2 `JwtUtilsTest` (Unit)

Czyste testy jednostkowe `JwtUtils` (bez Springa) — generowanie i walidacja tokenów JWT (HMAC-SHA256).

**generateJwtToken()**

| Test | Warunki | Oczekiwany rezultat |
|---|---|---|
| `shouldReturnThreePartJwtWithUsername` | Wygenerowano token dla "alice" z rolą `ROLE_USER` | Token niepusty, ma 3 części (header.payload.signature), subject = "alice" |
| `shouldEmbedRolesClaim` | Wygenerowano token z listą ról `["ROLE_USER","ROLE_ADMIN"]` | Roszczenie `roles` w tokenie zawiera dokładnie te role |
| `shouldSetIssuedAtAndExpiration` | Token wygenerowany z limitem 15 min | `issuedAt` ustawione na "teraz", `expiration` mieści się w oknie ok. 15 minut od wygenerowania |

**generateRefreshToken()**

| Test | Warunki | Oczekiwany rezultat |
|---|---|---|
| `shouldGenerateRefreshFromAuthentication` | `Authentication` z principalem `UserDetailsImpl` (alice) | Refresh token niepusty, subject = "alice" |
| `shouldGenerateRefreshFromUsernameString` | Wywołanie z samym stringiem "bob" | Refresh token niepusty, subject = "bob" |
| `refreshShouldOutliveAccessToken` | Wygenerowano access i refresh token dla tego samego usera | Data wygaśnięcia refresh tokena jest późniejsza niż access tokena |

**validateJwtToken() (boolean)**

| Test | Warunki | Oczekiwany rezultat |
|---|---|---|
| `shouldReturnTrueForOwnFreshToken` | Świeżo wygenerowany, własny token | Zwraca `true` |
| `shouldReturnFalseForTokenSignedWithDifferentKey` | Token podpisany innym sekretem (inna instancja `JwtUtils`) | Zwraca `false` |
| `shouldReturnFalseForMalformedToken` | String niebędący poprawnym JWT | Zwraca `false` |
| `shouldReturnFalseForEmptyString` | Pusty string jako token | Zwraca `false` |
| `shouldReturnFalseForExpiredToken` | Token z TTL=1ms, odczekano 50ms | Zwraca `false` |

**validateToken() (rzuca wyjątek)**

| Test | Warunki | Oczekiwany rezultat |
|---|---|---|
| `shouldReturnClaimsForValidToken` | Poprawny token | Zwraca `Claims` z poprawnym subject, `expiration` w przyszłości, `issuedAt` ustawione |
| `shouldThrowJwtExceptionForTamperedSignature` | Podpis tokena zniszczony (podmieniony ostatni fragment) | Rzuca `JwtException` |
| `shouldThrowExpiredJwtExceptionWhenTokenExpired` | Token z TTL=1ms, odczekano 50ms | Rzuca `ExpiredJwtException` |

**getUserNameFromJwtToken()**

| Test | Warunki | Oczekiwany rezultat |
|---|---|---|
| `shouldExtractUsernameFromSubject` | Poprawny token | Zwraca username zgodny z subject |
| `shouldThrowOnInvalidToken` | String niebędący JWT | Rzuca `JwtException` |

### 3.3 `AuthServiceTest` (Unit, Mockito)

Testuje logikę biznesową `AuthService` z zamockowanymi zależnościami (repozytoria, JWT, email, rate limiting).

**authenticateUser()**

| Test | Warunki | Oczekiwany rezultat |
|---|---|---|
| `shouldReturnTokensResetCounterAndSaveLastLogin` | Aktywny, zweryfikowany user; poprawne dane logowania | Zwraca access + refresh token, dane usera; `failedLoginAttempts` wyzerowane, `lastLogin` ustawione, user zapisany |
| `shouldRecordFailedAttemptOnBadCredentials` | `AuthenticationManager` rzuca `BadCredentialsException` | Wyjątek propagowany dalej; wywołane `loginAttemptService.recordFailedAttempt(userId)` |
| `shouldThrowAccountLockedWithoutCallingAuthManager` | User ma `lockedUntil` w przyszłości (blokada 15 min) | Rzuca `AccountLockedException`; `authenticationManager` w ogóle nie wywołany |
| `shouldThrowEmailNotVerifiedAndNotIssueTokens` | User istnieje, ale `emailVerified=false` | Rzuca `EmailNotVerifiedException`; `jwtUtils` nie wywołany (brak wygenerowanych tokenów) |

**registerUser()**

| Test | Warunki | Oczekiwany rezultat |
|---|---|---|
| `shouldSaveInactiveUnverifiedUserAndSendVerificationEmail` | Unikalny username/email | Zapisany user ma `emailVerified=false`, `isActive=false`, hasło zahashowane (nie plain-text); wysłany email weryfikacyjny |
| `shouldThrowWhenUsernameAlreadyTaken` | `existsByUsername` zwraca `true` | Rzuca `UserAlreadyExistsException`; brak zapisu do bazy, brak wysyłki maila |
| `shouldThrowWhenEmailAlreadyInUse` | `existsByEmail` zwraca `true` | Rzuca `UserAlreadyExistsException`; brak zapisu do bazy, brak wysyłki maila |

**refreshToken()**

| Test | Warunki | Oczekiwany rezultat |
|---|---|---|
| `shouldReturnNewAccessTokenForValidRefreshToken` | Poprawny refresh token, user istnieje | Zwraca nowy access token z datą wygaśnięcia w przyszłości |
| `shouldReturn401ForExpiredOrTamperedRefreshToken` | `jwtUtils.validateToken` rzuca `JwtException` | Rzuca `ResponseStatusException` ze statusem `401 UNAUTHORIZED` |

### 3.4 `UserTokenServiceTest` (Unit, Mockito)

Testuje `UserTokenService` — generowanie tokenów (weryfikacja email, reset hasła), rate limiting i walidację/zużycie tokenów.

**createToken()**

| Test | Warunki | Oczekiwany rezultat |
|---|---|---|
| `shouldCreateAndPersistTokenWithDefaultValidity` | Limit 3 tokenów/h nieprzekroczony (0 dotychczasowych) | Token zapisany z powiązanym userem, typem `EMAIL_VERIFICATION`, niepustą wartością, `usedAt=null`, `expiresAt` ok. 24h od teraz |
| `shouldGenerateUniqueTokenValues` | Wygenerowano dwa tokeny dla tego samego usera | Wartości tokenów różne (losowość kryptograficzna), długość ≥ 32 znaków |
| `shouldHonorCustomValidity` | Podano niestandardową ważność (30 minut) dla `PASSWORD_RESET` | `expiresAt` mieści się w oknie ok. 30 minut od teraz |
| `shouldThrowWhenRateLimitExceeded` | Liczba tokenów w ostatniej godzinie = limit (3) | Rzuca `RateLimitExceededException` z komunikatem o limicie; nic nie zapisane |
| `shouldThrowWhenCountAboveRateLimit` | Liczba tokenów w ostatniej godzinie > limit (4 > 3) | Rzuca `RateLimitExceededException`; nic nie zapisane |

**validateAndUseToken()**

| Test | Warunki | Oczekiwany rezultat |
|---|---|---|
| `shouldMarkTokenUsedAndReturnUser` | Token istnieje, nieużyty, nieprzeterminowany | Zwraca powiązanego usera; token oznaczony jako użyty (`usedAt` ustawione, `isUsed()==true`), zapisany |
| `shouldThrowWhenTokenNotFound` | Token o podanej wartości/typie nie istnieje | Rzuca `InvalidTokenException` ("Token not found"); brak zapisu |
| `shouldThrowWhenTokenExpired` | Token istnieje, ale `expiresAt` w przeszłości | Rzuca `TokenExpiredException`; brak zapisu |
| `shouldThrowWhenTokenAlreadyUsed` | Token istnieje, `usedAt` już ustawione | Rzuca `TokenAlreadyUsedException`; brak zapisu |
| `shouldRejectReuseOfSameToken` | Token użyty raz poprawnie, potem użyty ponownie | Pierwsze użycie się udaje; drugie rzuca `TokenAlreadyUsedException` |

---

## 4. Moduł `workouts` (treningi, ćwiczenia, statystyki)

Baza: `AbstractWorkoutE2ETest` — pełny kontekst Springa, MockMvc, realna baza w Testcontainerze, bezpieczeństwo zastąpione `PermitAllSecurityConfig`, autoryzacja symulowana przez `authOf(user)`. Google Drive (`GoogleDriveFileService`, `FilePathService`) zamockowane. Baza czyszczona przed każdym testem.

### 4.1 `ExerciseControllerE2ETest` (E2E)

| Test | Warunki | Oczekiwany rezultat |
|---|---|---|
| `shouldPersistTrainingAndUploadToDrive` | Zalogowany user, istnieje poprzedni trening (potrzebny do generowania nazwy pliku), poprawne dane treningu | `POST /api/v1/trainings` → `201 Created`, pole `date` obecne w odpowiedzi; wywołany upload na Google Drive; trening zapisany w bazie i przypisany do właściwego usera |
| `shouldNotPersistWhenDriveFails` | Google Drive rzuca wyjątek przy uploadzie | `POST /api/v1/trainings` → status 5xx; liczba treningów w bazie NIE wzrasta (Drive jako źródło prawdy — brak zapisu bez sukcesu uploadu) |
| `shouldReturnExercisesForDate` | Zapisany trening z ćwiczeniem POMPKI na datę 2024-01-15 | `GET /api/v1/exercises/search?date=2024-01-15` → `200 OK`, w odpowiedzi znajduje się ćwiczenie z tej daty |
| `shouldNotLeakTrainingsAcrossUsers` | User A ma 2 treningi (styczeń), user B ma 3 treningi (luty) | `GET /api/v1/trainings/names` dla usera A → `200 OK`, `totalElements=2`, brak wpisów z lutego; dla usera B → `totalElements=3` (pełna izolacja danych między użytkownikami) |
| `shouldReturnLatestExercisesPerTemplateEntry` | Istnieje szablon treningu "A" z ćwiczeniem POMPKI, zapisany trening z wykonaniem tego ćwiczenia | `GET /api/v1/exercises/trainingType/A` → `200 OK`, lista niepusta, pierwszy element to POMPKI |

### 4.2 `ExerciseServiceATHTest` (Unit, Mockito)

Testuje logikę wyboru rekordu życiowego (ATH — All Time High) w `ExerciseService.getATHExercise()`: wybiera wykonanie o największej sumarycznej "pojemności" (suma powtórzenia × ciężar po seriach).

| Test | Warunki | Oczekiwany rezultat |
|---|---|---|
| `shouldReturnExerciseWithMaxTotalCapacity` | 3 wykonania POMPKI z różnych dat: capacity 1080, 1440, 1100 | Zwraca dokładnie 1 element — wykonanie z capacity 1440 (największe) |
| `shouldSkipExercisesNeverPerformed` | Szablon zawiera POMPKI i DIPY, ale user wykonał tylko POMPKI | Zwraca tylko POMPKI; DIPY pominięte (brak historii wykonań) |

### 4.3 `StatisticServiceTest` (Unit, Mockito)

Testuje walidację zakresu dat w `StatisticService.generateStatisticChartData()`.

| Test | Warunki | Oczekiwany rezultat |
|---|---|---|
| `shouldThrowWhenBeginDateAfterEndDate` (#25) | `beginDate` (31-12-2024) późniejsza niż `endDate` (01-01-2024) | Rzuca `InvalidDateRangeException` ("Start date cannot be after end date"); `exerciseService` nie wywołany |
| `shouldThrowWhenEndDateInFuture` (#26) | `endDate` ustawiona rok naprzód | Rzuca `InvalidDateRangeException` ("End date cannot be in the future"); `exerciseService` nie wywołany |
| `shouldAllowTomorrowAsEndDate` (#26 boundary) | `endDate` = jutro (granica dozwolonego zakresu `plusDays(1)`) | Metoda nie rzuca wyjątku — jutro jest dopuszczalną datą końcową |

### 4.4 `StatisticControllerE2ETest` (E2E)

| Test | Warunki | Oczekiwany rezultat |
|---|---|---|
| `shouldReturnChartPoints` | Dwa treningi z POMPKI: 10.01 (serie 5×60 i 5×70 → suma wag 65 przy uśrednieniu) i 20.01 (10×80) | `GET /api/v1/exercises/statistic/Pompki/Weight/01-01-2024/31-01-2024` → `200 OK`, 2 punkty wykresu, wartości odpowiednio `65.0` i `80.0` |

### 4.5 `SearchMealTest` / `WorkoutsAppApplicationTests`

`WorkoutsAppApplicationTests` — cała klasa zakomentowana (test `contextLoads()` wyłączony). Obecnie nie sprawdza niczego; można odblokować, by mieć podstawowy test ładowania kontekstu Springa.

---

## 5. Frontend (`frontend5/src/App.test.js`)

| Test | Warunki | Oczekiwany rezultat |
|---|---|---|
| `sanity > runs the test runner` | Brak (test podstawowy) | Sprawdza, że `1 + 1 === 2` — weryfikuje jedynie, że test runner (Vitest) działa poprawnie. Nie testuje żadnej logiki aplikacji. |

---

## Podsumowanie liczby testów

| Plik | Liczba testów | Typ |
|---|---|---|
| CommonErrorResponsesCustomizerTest | 2 | Unit |
| RateLimitFilterTest | 12 | Unit |
| RateLimitFilterIntegrationTest | 2 | E2E |
| MealControllerTest | 4 | E2E |
| ProductControllerTest | 2 | E2E |
| SearchMealTest | 0 (wyłączony) | — |
| AuthControllerIntegrationTest | 16 | E2E |
| JwtUtilsTest | 16 | Unit |
| AuthServiceTest | 9 | Unit |
| UserTokenServiceTest | 10 | Unit |
| ExerciseControllerE2ETest | 5 | E2E |
| ExerciseServiceATHTest | 2 | Unit |
| StatisticServiceTest | 3 | Unit |
| StatisticControllerE2ETest | 1 | E2E |
| WorkoutsAppApplicationTests | 0 (wyłączony) | — |
| App.test.js (frontend) | 1 | Unit (sanity) |
| **Razem** | **85 aktywnych testów** | |

## Uwagi

- `SearchMealTest` i `WorkoutsAppApplicationTests` zawierają wyłącznie zakomentowany kod — nie wnoszą obecnie żadnego pokrycia testami.
