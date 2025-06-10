# Dokumentacja modułów aplikacji Improvement App

Improvement App to aplikacja webowa do zarządzania dietą, produktami spożywczymi oraz treningami. Składa się z backendu (Spring Boot + Java) oraz frontendu (React + Material UI). 

## Spis treści
- [Backend](#backend)
  - [Opis funkcjonalny](#opis-funkcjonalny)
  - [Architektura i technologie](#architektura-i-technologie)
  - [Budowanie i uruchamianie](#budowanie-i-uruchamianie)
- [Frontend](#frontend)
  - [Opis funkcjonalny](#opis-funkcjonalny-1)
  - [Architektura i technologie](#architektura-i-technologie-1)
  - [Konfiguracja i uruchomienie](#konfiguracja-i-uruchomienie)

---

## Backend

### Opis funkcjonalny

Backend obsługuje całą logikę biznesową, autoryzację, połączenia z bazą danych (MongoDB/JPA), zarządza REST API oraz komunikacją WebSocket.  
Kluczowe funkcjonalności:
- Zarządzanie produktami spożywczymi (dodawanie, pobieranie, filtrowanie)
- Zarządzanie posiłkami (generowanie, pobieranie, podsumowania, kategorie, typy)
- Zarządzanie dietą użytkownika (podsumowania dzienne, wyliczanie makroskładników)
- Obsługa treningów (dodawanie, pobieranie, szablony treningowe)
- Bezpieczeństwo: JWT, BCrypt, role użytkowników
- Monitoring i zdrowie aplikacji: endpoint `/actuator/health`
- Obsługa WebSocket do komunikacji w czasie rzeczywistym

### Architektura i technologie

- Java 17 + Spring Boot 3.3.4 (Security, Web, Data JPA, Data MongoDB, Jersey, WebSocket)
- Maven do buildowania i zarządzania zależnościami
- Log4j, Prometheus (monitoring), actuator
- JWT do autoryzacji, BCrypt do hashowania haseł
- Docker (obrazy, docker-compose)
- CI/CD: pipeline GitLab (budowanie, testy, deploy)

### Budowanie i uruchamianie

**Lokalnie**
```bash
./mvnw package
java -jar target/improvement-app-backend-0.0.1-SNAPSHOT.jar --server.port=8080
```

**Docker**
```bash
docker build -t improvement-app-backend .
docker run -p 8080:8080 improvement-app-backend
```
Możesz użyć również `docker-compose up` jeśli masz plik compose.

**Healthcheck**:  
Aplikacja udostępnia endpoint zdrowia pod `/actuator/health`.

**Konfiguracja**:  
Zależności w `pom.xml`, port domyślny: 8080, konfigurowalny przez parametr startowy.

---

## Frontend

### Opis funkcjonalny

Frontend to nowoczesna aplikacja React. Pozwala użytkownikowi:
- Przeglądać, dodawać i filtrować produkty spożywcze oraz posiłki
- Generować i analizować dzienne podsumowania diety
- Przeglądać i dodawać treningi (w tym korzystać z szablonów treningowych)
- Otrzymywać powiadomienia w czasie rzeczywistym (WebSocket)
- Zarządzać własnym profilem (autoryzacja JWT)
- Sięgać do API backendowego zgodnie z rolą użytkownika

### Architektura i technologie

- React 19 + Create React App
- Material UI (MUI), ikony, data-grid, date-pickers
- React Query (asynchroniczne pobieranie danych, cache)
- WebSocket (SockJS, STOMP) do live logów i powiadomień
- Axios (REST), universal-cookie, i18next (wielojęzyczność)
- Recharts (wykresy i statystyki)
- JWT-decode, dayjs, moment (czas, sesje)

**Pełna konfiguracja zależności w `frontend5/package.json`.**

### Konfiguracja i uruchomienie

**Zmienne środowiskowe:**
- `.env.development`
  ```
  REACT_APP_API_URL=http://localhost:8080/
  ```
- `.env.production`
  ```
  REACT_APP_API_URL=https://mutarexx.smallhost.pl:37786/
  ```

**Instalacja i uruchomienie:**
```bash
npm install
npm start     # tryb developerski (localhost:3000)
npm run build # build produkcyjny (do katalogu build/)
```

Aktualne API backendu i frontend są zintegrowane – całość działa zarówno lokalnie, jak i w środowisku produkcyjnym.

---

**Więcej szczegółów i kod źródłowy:**  
- [Backend w GitHub](https://github.com/damianPolchlopek/improvement-app/tree/main/Backend)
- [Frontend w GitHub](https://github.com/damianPolchlopek/improvement-app/tree/main/frontend5)
