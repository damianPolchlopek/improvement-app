# Frontend5 – Improvement App

Moduł **frontend5** to nowoczesny frontend aplikacji Improvement App, zbudowany w oparciu o React 19 oraz Material-UI. Projekt został wygenerowany narzędziem [Create React App](https://github.com/facebook/create-react-app), co zapewnia strukturę przyjazną do dalszego rozwoju i prostą konfigurację.

---

## Spis treści

- [Wymagania](#wymagania)
- [Instalacja](#instalacja)
- [Dostępne skrypty](#dostępne-skrypty)
- [Struktura katalogów](#struktura-katalogów)
- [Najważniejsze biblioteki](#najważniejsze-biblioteki)
- [Konfiguracja ESLint, Prettier i przeglądarki](#konfiguracja-eslint-prettier-i-przeglądarki)
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

## Instalacja

1. Przejdź do katalogu `frontend5`:
    ```bash
    cd frontend5
    ```
2. Zainstaluj zależności:
    ```bash
    npm install
    ```

---

## Dostępne skrypty

- `npm start` – Uruchamia aplikację w trybie deweloperskim ([http://localhost:3000](http://localhost:3000))
- `npm test` – Interaktywny tryb testowania z użyciem React Testing Library
- `npm run build` – Tworzy zoptymalizowaną wersję produkcyjną w katalogu `build`
- `npm run eject` – Wyodrębnia konfigurację narzędzi do projektu (operacja nieodwracalna)
- `npm run format` – Formatuje kod w `src/` przy użyciu Prettiera
- `npm run format:check` – Sprawdza formatowanie bez wprowadzania zmian

---

## Struktura katalogów

- `src/` – Główny kod źródłowy aplikacji
  - `index.js` – Punkt wejścia (renderowanie komponentu `<App />`)
  - `App.js` – Główny komponent aplikacji (routing, layout)
  - `theme.js` – Konfiguracja motywu Material UI
  - `component/` – Współdzielone komponenty (`error`, `loader`, `snackbar`, `table`)
  - `context/` – Konteksty React (m.in. stan globalny)
  - `layout/` – Elementy układu strony (nawigacja, szkielet widoku)
  - `language/` – Konfiguracja tłumaczeń (`i18n.js`) i przełącznik języka
  - `utils/` – Funkcje pomocnicze i komunikacja z API (axios)
  - `assets/` – Zasoby statyczne
  - **Moduły funkcjonalne:** `food/`, `training/`, `finance/`, `shopping/`, `other/`,
    `audit/`, `home/`, `login/`, `projects/`
- `public/` – Statyczne pliki serwowane przez aplikację

---

## Najważniejsze biblioteki

- **React** (v19)
- **Material UI** (`@mui/material`, `@mui/icons-material`, `@mui/lab`, `@mui/x-data-grid`, `@mui/x-date-pickers`)
- **React Router** (`react-router-dom`) – routing aplikacji
- **React Query** (`@tanstack/react-query`) – obsługa zapytań i cache
- **i18next** + **react-i18next** – internacjonalizacja i tłumaczenia
- **Day.js** i **Moment.js** – operacje na datach
- **Axios** – komunikacja HTTP z backendem
- **WebSockety** (`@stomp/stompjs`, `sockjs-client`, `stompjs`) – komunikacja w czasie rzeczywistym
- **Recharts** – wykresy i wizualizacja danych
- **Universal-cookie** – obsługa cookies
- **jwt-decode** – dekodowanie tokenów JWT po stronie klienta

---

## Konfiguracja ESLint, Prettier i przeglądarki

- Konfiguracja ESLint oparta na domyślnych ustawieniach Create React App (`react-app`, `react-app/jest`).
- Formatowanie kodu zapewnia **Prettier** (konfiguracja w `.prettierrc`, wykluczenia w `.prettierignore`). Uruchom `npm run format`.
- Obsługiwane przeglądarki:
  - produkcja: >0.2%, nie martwe, nie Opera Mini
  - deweloperski: ostatnia wersja Chrome, Firefox, Safari

---

## Testowanie

Projekt korzysta z **React Testing Library** oraz **Jest**. Testy znajdują się w plikach z rozszerzeniem `.test.js`.

Uruchom testy:
```bash
npm test
```

---

## Budowanie produkcyjne

Aby zbudować aplikację do wdrożenia:
```bash
npm run build
```
Wynik znajdziesz w katalogu `build`.

---

## Międzynarodowość (i18n)

Aplikacja posiada wsparcie dla wielu języków dzięki **i18next** i **react-i18next**. Konfiguracja oraz przełącznik języka znajdują się w katalogu `src/language` (`i18n.js`, `LanguageSwitcher.jsx`).

---

## WebSockety

Do komunikacji w czasie rzeczywistym wykorzystywane są biblioteki:
- **@stomp/stompjs**
- **sockjs-client**
- **stompjs**

---

## Przydatne linki

- [Create React App – dokumentacja](https://facebook.github.io/create-react-app/docs/getting-started)
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
