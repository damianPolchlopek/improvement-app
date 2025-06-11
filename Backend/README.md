# Dokumentacja architektury Improvement App – Backend

## Spis treści

1. [Wstęp](#wstęp)
2. [Struktura katalogów](#struktura-katalogów)
3. [Opis architektury i domen](#opis-architektury-i-domen)
4. [Przegląd warstw i domen](#przegląd-warstw-i-domen)
5. [Obsługa wyjątków](#obsługa-wyjątków)
6. [Konfiguracje i narzędzia](#konfiguracje-i-narzędzia)
7. [Podsumowanie](#podsumowanie)

---

## Wstęp

Projekt Improvement App to modularna aplikacja backendowa napisana w Javie z użyciem Spring Boot. Każda domena funkcjonalna posiada własny pakiet i podział na warstwy, co znacząco ułatwia rozwój, testowanie i utrzymanie kodu.

---

## Struktura katalogów

```
com/improvement_app/
├── ImprovementAppBackendApplication.java
├── exceptions/
│   ├── ErrorResponse.java
│   ├── FieldValidationError.java
│   ├── GlobalExceptionHandler.java
│   └── ValidationErrorResponse.java
├── finance/
│   ├── controller/
│   ├── entity/
│   ├── repository/
│   ├── service/
│   └── util/
├── food/
│   ├── FoodModuleVariables.java
│   ├── application/
│   ├── domain/
│   ├── infrastructure/
│   └── ui/
├── googledrive/
│   ├── config/
│   ├── entity/
│   ├── exceptions/
│   ├── service/
│   └── types/
├── mainappcontroller/
│   ├── JacksonConfiguration.java
│   └── RootController.java
├── other/
│   ├── daily/
│   └── weekly/
├── parser/
│   ├── controller/
│   ├── entity/
│   ├── examle.html
│   ├── repository/
│   └── service/
├── security/
│   ├── command/
│   ├── config/
│   ├── controllers/
│   ├── entity/
│   ├── exceptions/
│   ├── jwt/
│   ├── repository/
│   └── services/
├── shopping/
│   ├── controller/
│   ├── entity/
│   └── repository/
├── util/
│   ├── ListResponse.java
│   ├── Page.java
│   └── PaginationHelper.java
└── workouts/
    ├── TrainingModuleVariables.java
    ├── controllers/
    ├── entity/
    ├── exceptions/
    ├── helpers/
    ├── repository/
    └── services/
```

---

## Opis architektury i domen

Aplikacja oparta jest na modularnej architekturze, w której każda domena (np. finanse, jedzenie, treningi, zakupy, parser, bezpieczeństwo, Google Drive) wydzielona jest w osobny pakiet. Domeny stosują typowy podział na warstwy:

- **controller** – obsługa żądań HTTP (REST API)
- **entity** – definicje encji (mapowanie na bazę danych)
- **repository** – interfejsy repozytoriów (Spring Data)
- **service** – logika biznesowa
- **util/helpers** – klasy pomocnicze
- **config** – konfiguracje (np. serializacja, bezpieczeństwo, integracje)

W niektórych domenach zastosowano dodatkowy podział zgodny z architekturą hexagonalną (np. food: application, domain, infrastructure, ui).

---

## Przegląd warstw i domen

### 1. `exceptions/`
Globalna obsługa wyjątków oraz walidacji:

- **GlobalExceptionHandler.java** – centralny handler błędów dla aplikacji
- **ErrorResponse.java**, **ValidationErrorResponse.java**, **FieldValidationError.java** – formatowanie odpowiedzi na błędy i walidacje

### 2. `finance/`
Moduł do obsługi finansów:

- **controller/** – REST API finansowe
- **entity/** – encje związane z finansami
- **repository/** – repozytoria danych
- **service/** – logika biznesowa
- **util/** – klasy pomocnicze

### 3. `food/`
Obsługa funkcjonalności związanej z jedzeniem:

- **FoodModuleVariables.java** – zmienne/stałe modułu
- **application/**, **domain/**, **infrastructure/**, **ui/** – podział DDD/hexagonalny

### 4. `googledrive/`
Integracja z Google Drive:

- **config/** – konfiguracja dostępu do API
- **entity/** – modele danych
- **exceptions/** – obsługa błędów integracji
- **service/** – logika biznesowa
- **types/** – typy pomocnicze

### 5. `mainappcontroller/`
Konfiguracje globalne i bazowy kontroler:

- **JacksonConfiguration.java** – konfiguracja serializacji/deserializacji JSON
- **RootController.java** – główny kontroler aplikacji

### 6. `other/`
Dodatkowe funkcjonalności, np. zadania okresowe:

- **daily/**, **weekly/** – grupowanie zadań dziennych/tygodniowych

### 7. `parser/`
Moduł parsowania (np. HTML):

- **controller/**, **entity/**, **repository/**, **service/** – typowy podział warstwowy
- **examle.html** – plik testowy/parsingowy

### 8. `security/`
Bezpieczeństwo i autoryzacja:

- **command/**, **config/**, **controllers/**, **entity/**, **exceptions/**, **jwt/**, **repository/**, **services/** – pełna obsługa użytkowników, JWT, konfiguracja zabezpieczeń

### 9. `shopping/`
Moduł zakupów:

- **controller/**, **entity/**, **repository/** – podstawowe warstwy CRUD

### 10. `util/`
Klasy pomocnicze:

- **ListResponse.java**, **Page.java**, **PaginationHelper.java** – wsparcie paginacji i odpowiedzi REST

### 11. `workouts/`
Moduł treningowy:

- **TrainingModuleVariables.java** – zmienne modułu
- **controllers/**, **entity/**, **exceptions/**, **helpers/**, **repository/**, **services/** – pełna obsługa CRUD dla treningów

---

## Obsługa wyjątków

Obsługa błędów realizowana jest centralnie w pakiecie `exceptions/`. Dzięki temu wszystkie wyjątki, walidacje oraz niestandardowe błędy aplikacji są zwracane w sposób ustandaryzowany, zgodnie z dobrymi praktykami REST.

---

## Konfiguracje i narzędzia

- **util/** – klasy do paginacji, uniwersalne odpowiedzi listowe, helpery
- **mainappcontroller/** – konfiguracja serializacji JSON, główny kontroler
- **security/config/** – ustawienia zabezpieczeń, JWT itd.
- **googledrive/config/** – konfiguracja integracji z Google Drive

---

## Podsumowanie

Projekt cechuje modularność, czytelny podział na warstwy i domeny oraz centralna obsługa wyjątków i konfiguracji. Pozwala to na łatwą rozbudowę, testy i utrzymanie kodu. Dobrze oddzielone domeny i warstwy gwarantują zgodność z najlepszymi praktykami architektury aplikacji Spring Boot.

---
