# Frontend5 – Improvement App

Moduł **frontend5** to nowoczesny frontend aplikacji Improvement App, zbudowany w oparciu o React 19 oraz Material-UI. Projekt korzysta z [Vite](https://vitejs.dev/) jako buildera i dev servera oraz [Vitest](https://vitest.dev/) do testów.

---

## Spis treści

- [Wymagania](#wymagania)
- [Instalacja i uruchomienie](#instalacja-i-uruchomienie)
- [Dostępne skrypty](#dostępne-skrypty)
- [Struktura katalogów](#struktura-katalogów)
- [Najważniejsze biblioteki](#najważniejsze-biblioteki)
- [Konfiguracja ESLint, Prettier i Husky](#konfiguracja-eslint-prettier-i-husky)
- [Testowanie](#testowanie)
- [Budowanie produkcyjne](#budowanie-produkcyjne)
- [Międzynarodowość (i18n)](#miedzynarodowosc-i18n)
- [WebSockety](#websockety)
- [Przydatne linki](#przydatne-linki)

---

## Wymagania

- Node.js (zalecana najnowsza LTS)
- NPM (w zestawie z Node.js)
- Przeglądarka wspierająca ES6+

---

## Instalacja i uruchomienie

> Frontend komunikuje się z backendem przez REST API i WebSocket — do pełnego działania aplikacji uruchom też backend (zob. [Backend/README.md](../Backend/README.md) lub `docker-compose up` w katalogu głównym).

1. Przejdź do katalogu `frontend5`:
    ```bash
    cd frontend5
    ```
2. Zainstaluj zależności:
    ```bash
    npm install
    ```
3. Uruchom serwer deweloperski:
    ```bash
    npm start
    ```
    Aplikacja będzie dostępna pod [http://localhost:3000](http://localhost:3000).

Adres backendu, z którym łączy się frontend, konfigurowany jest zmienną `VITE_API_URL` w plikach `.env.development` / `.env.production` (domyślnie `http://localhost:8080/` w trybie deweloperskim).

---

## Dostępne skrypty

- `npm start` – Uruchamia serwer deweloperski Vite ([http://localhost:3000](http://localhost:3000))
- `npm test` – Interaktywny tryb testowania (Vitest, watch mode)
- `npm run test:run` – Jednorazowe uruchomienie testów (np. w CI)
- `npm run build` – Tworzy zoptymalizowaną wersję produkcyjną w katalogu `dist`
- `npm run preview` – Podgląd zbudowanej wersji produkcyjnej lokalnie
- `npm run lint` – Sprawdza kod w `src/` za pomocą ESLint
- `npm run format` – Formatuje kod w `src/` przy użyciu Prettiera
- `npm run format:check` – Sprawdza formatowanie bez wprowadzania zmian

---

## Struktura katalogów

- `index.html` – Punkt wejścia Vite (ładuje `src/index.jsx`); zastąpił `public/index.html` z czasów Create React App
- `src/` – Główny kod źródłowy aplikacji
  - `index.jsx` – Renderowanie komponentu `<App />`
  - `App.jsx` – Główny komponent aplikacji (routing, layout)
  - `theme.js` – Konfiguracja motywu Material UI; wpina tokeny z `tokens.js` do palety, więc w `sx`
    można pisać np. `bgcolor: 'surface.field'`, `color: 'status.up'`, `bgcolor: 'primaryTint.strong'`.
    Jeden kolor przewodni (`PRIMARY` = jasna zieleń `ACCENTS.teal.light`) dla przycisków, zaznaczeń,
    linków i wskaźnika toolbara; `success` / `warning` / `error` też pochodzą z tokenów (`STATUS`).
    Tło: płaski granat `SURFACE.page` (#1a2d3d, odcień z dawnego gradientu), karty i Paper
    w pełnym kolorze `SURFACE.card` (#213748), kafle `SURFACE.tile` – bez gradientów
    i przezroczystości.
    Czcionka: Arial (`FONT_FAMILY` w `tokens.js`, ta sama wartość w `index.css`) – bez ładowania
    zewnętrznych fontów. Tabele mają wspólny wygląd z motywu (`MuiTableCell` / `MuiTableBody` /
    `MuiTableRow`: cienkie linie, nagłówek 12px, cyfry o stałej szerokości, podświetlenie wiersza),
    więc zwykłe `<Table>` nie potrzebuje `sx` – tylko tabela z innymi odstępami nadpisuje
    `'& .MuiTableCell-root'`. `MuiCard` to płaska karta z cienką ramką; `Grid`, `Alert` i `Chip`
    mają domyślne zachowanie MUI (bez globalnego wyśrodkowania i pogrubienia). Tekst nie jest też
    wyśrodkowany globalnie (`.App` w `App.css`) – widok, który chce go wyśrodkować, ustawia to sam
  - `tokens.js` – Jedno źródło wyglądu: paleta akcentów (`ACCENTS`: coral, purple, blue, teal, amber,
    gray – każdy z `dot` / `bg` / `text` / `light`), kolory znaczeniowe (`STATUS`), powierzchnie
    (`SURFACE`), linie (`HAIRLINE`, `ROW_LINE`) oraz wspólne style (`surfaceSx`, `fieldSx`,
    `dialogPaperSx`). Nowe kolory dodajemy tutaj, nie na sztywno w komponentach.
    Wykresy: `CHART_SERIES` – 8 kolorów serii w stałej, zwalidowanej kolejności (kontrast
    i rozróżnialność przy daltonizmie na ciemnym tle karty), bez zapętlania – wykres ćwiczeń
    pokazuje najwyżej 8 serii, a kolor zostaje przy ćwiczeniu (`trainingStatistic/seriesColors.js`);
    `CHART_LINES` – ciche linie siatki i osi
  - `component/` – Współdzielone komponenty (`error`, `loader`, `snackbar`, `table/DataTable`)
  - `context/` – Konteksty React (m.in. stan globalny)
  - `layout/` – Elementy układu strony (nawigacja, szkielet widoku)
  - `language/` – Konfiguracja tłumaczeń (`i18n.js`) i przełącznik języka
  - `utils/` – Funkcje pomocnicze i komunikacja z API (axios)
  - `assets/` – Zasoby statyczne
  - **Moduły funkcjonalne:** `food/`, `training/`, `finance/`, `shopping/`, `other/`,
    `audit/`, `home/`, `login/`
  - `audit/` – historia zmian podsumowań diety: lista podsumowań, oś czasu rewizji (rozwijane
    wiersze, szczegóły pobierane przy rozwinięciu), filtry w nagłówku i porównanie dwóch wersji.
    Typy zmian mają stałe kolory z palety akcentów (`REVISION_TYPES` w
    `audit/utils/auditFormatters.js`: dodano = teal, zmieniono = blue, usunięto = coral), a
    makroskładniki te same kolory co w module food (`MACRO_COLORS`)
  - `finance/live/` – widok „Na żywo”: pasek notowań na żywo z widgetu TradingView „Tickers”
    (BTC, ETH, dominacja USDT, złoto, srebro, S&P 500, Nasdaq 100, ropa WTI) oraz
    zwijane sekcje z wykresami z widgetu TradingView. „Kryptowaluty”: BTC i ETH (Binance);
    „Indeksy giełdowe”: S&P 500 i Nasdaq 100 (`FOREXCOM:SPXUSD`, `FOREXCOM:NSXUSD`);
    „Metale”: złoto i srebro (`OANDA:XAUUSD`, `OANDA:XAGUSD`); „Analiza makro”: dominacja USDT
    (`CRYPTOCAP:USDT.D`) z paskiem stref obok wykresu (zakresy w `UsdtZoneBar.jsx`, bieżąca
    wartość z CoinMarketCap), dominacja BTC (`CRYPTOCAP:BTC.D`) i Others
    (`CRYPTOCAP:OTHERS.D`); „Derywatywy”: open interest
    (`*.P_OI` × cena kontraktu, czyli wartość w USDT)
    i funding rate (`*.P_FR`) z Binance i Coinbase. Domyślnie świece dzienne (1D); historia, zoom i wybór
    okresu są wbudowane w widget; bez kluczy API.
- `public/` – Statyczne zasoby serwowane bez przetwarzania (favicon, manifest)

---

## Najważniejsze biblioteki

- **Vite** – builder i dev server
- **React** (v19)
- **Material UI** (`@mui/material`, `@mui/icons-material`, `@mui/x-data-grid`, `@mui/x-date-pickers`)
- **React Router** (`react-router-dom`) – routing aplikacji
- **React Query** (`@tanstack/react-query`) – obsługa zapytań i cache
- **i18next** + **react-i18next** – internacjonalizacja i tłumaczenia
- **Day.js** – operacje na datach
- **Axios** – komunikacja HTTP z backendem
- **WebSockety** (`@stomp/stompjs`, `sockjs-client`) – komunikacja w czasie rzeczywistym
- **Recharts** – wykresy i wizualizacja danych

---

## Konfiguracja ESLint, Prettier i Husky

- ESLint skonfigurowany jako flat config w [`eslint.config.js`](eslint.config.js) (`@eslint/js`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`). Uruchom `npm run lint`.
- Formatowanie kodu zapewnia **Prettier** (konfiguracja w `.prettierrc`, wykluczenia w `.prettierignore`). Uruchom `npm run format`.
- **Husky** + **lint-staged**: hook `pre-commit` (`.husky/pre-commit`) automatycznie formatuje Prettierem zmienione pliki `.js`/`.jsx` przed każdym commitem.
- Podczas `npm start` działa dodatkowo `vite-plugin-checker`, który na bieżąco pokazuje błędy ESLint w konsoli/przeglądarce.

---

## Testowanie

Projekt korzysta z **Vitest** (środowisko `jsdom`) oraz **React Testing Library** (`@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`). Konfiguracja testów znajduje się w [`vite.config.js`](vite.config.js), plik startowy to `src/setupTests.js`. Testy znajdują się w plikach z rozszerzeniem `.test.js` / `.test.jsx`.

Uruchom testy:
```bash
npm test        # tryb watch
npm run test:run  # jednorazowe uruchomienie (np. CI)
```

---

## Budowanie produkcyjne

Aby zbudować aplikację do wdrożenia:
```bash
npm run build
```
Wynik znajdziesz w katalogu `dist` (zgodnie z konwencją Vite). Podgląd builda lokalnie: `npm run preview`.

---

## Międzynarodowość (i18n)

Aplikacja posiada wsparcie dla wielu języków dzięki **i18next** i **react-i18next**. Konfiguracja oraz przełącznik języka znajdują się w katalogu `src/language` (`i18n.js`, `LanguageSwitcher.jsx`).

---

## WebSockety

Do komunikacji w czasie rzeczywistym wykorzystywane są biblioteki:
- **@stomp/stompjs**
- **sockjs-client**

Połączenie (`LogComponent`, kolejka `/user/queue/messages` — każdy użytkownik dostaje tylko własne komunikaty) działa tylko dla zalogowanego użytkownika — SockJS wysyła cookie z JWT przy handshake'u. Kanał jest tylko do odbioru: backend odrzuca wiadomości wysyłane przez klienta.

---

## Przydatne linki

- [Vite – dokumentacja](https://vitejs.dev/)
- [Vitest – dokumentacja](https://vitest.dev/)
- [React – dokumentacja](https://react.dev/)
- [Material UI – dokumentacja](https://mui.com/)
- [React Query](https://tanstack.com/query/latest)
- [i18next](https://www.i18next.com/)
- [Recharts](https://recharts.org/)

---

## Autor

Damian Polchłopek — [github.com/damianPolchlopek](https://github.com/damianPolchlopek)

---

## Licencja

Projekt prywatny (`"private": true` w `package.json`) — bez licencji open source.
