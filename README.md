# Dokumentacja modułów aplikacji Improvement App

## Spis treści
- [Backend](#backend)
  - [Technologie](#technologie)
  - [Budowanie i uruchamianie](#budowanie-i-uruchamianie)
  - [Docker](#docker)
  - [CI/CD](#cicd)
  - [Konfiguracja](#konfiguracja)
- [Frontend](#frontend)
  - [Technologie](#technologie-1)
  - [Dostępne skrypty](#dostępne-skrypty)
  - [Konfiguracja środowiska](#konfiguracja-środowiska)
  - [Budowanie i uruchamianie](#budowanie-i-uruchamianie-1)

---

## Backend

### Technologie
- Java 17 (OpenJDK)
- Spring Boot 3.3.4 (Security, Web, Data JPA, Data MongoDB, Jersey, WebSocket)
- Maven
- Docker
- Log4j (logowanie)
- Prometheus, actuator (monitorowanie)
- JWT (autoryzacja)
- MongoDB i/lub relacyjna baza danych (przez JPA)

### Budowanie i uruchamianie

**Lokalnie**  
W katalogu `Backend/`:
```bash
nohup java -jar improvement-app-backend-0.0.1-SNAPSHOT.jar --server.port=24568 -Xmx256m -Xms256m -XX:MaxMetaspaceSize=100m -Xss256k &
```

**Za pomocą Mavena:**
```bash
./mvnw package
```
Wygenerowany plik JAR znajdziesz w katalogu `target/`.

### Docker

Budowanie obrazu:
```bash
docker build -t improvement-app-backend .
```
Uruchamianie kontenera:
```bash
docker run -p 8080:8080 improvement-app-backend
```
Uruchomienie lokalnie docker copmpose:
```
docker-compose up
docker-compose -f docker-compose.yml build
```


Healthcheck: `/actuator/health`

### CI/CD

W repozytorium znajduje się plik `.gitlab-ci.yml` z przykładowym pipeline:
- Budowanie JAR przez Maven
- Budowanie i push obrazu Docker do rejestru
- Deployment na serwis (np. Koyeb)

### Konfiguracja

Plik `pom.xml` zawiera wszystkie zależności. Domyślnie aplikacja korzysta z portu 8080 (można zmienić przez parametr `--server.port`).

Więcej informacji i kod: [Przeglądaj katalog Backend w GitHub](https://github.com/damianPolchlopek/improvement-app/tree/main/Backend)

---

## Frontend

### Technologie

- React 19 (bootstrapped with Create React App)
- Material UI (MUI, ikony, lab, data-grid, date-pickers)
- React Query
- WebSocket (SockJS, STOMP)
- Axios
- i18next (wielojęzyczność)
- Recharts (wykresy)
- Universal-cookie, jwt-decode, dayjs, moment

Plik `package.json` zawiera pełną listę zależności.

### Dostępne skrypty

W katalogu `frontend5/` możesz uruchomić:

- `npm start` — uruchamia aplikację w trybie deweloperskim ([localhost:3000](http://localhost:3000))
- `npm test` — uruchamia testy
- `npm run build` — buduje aplikację do katalogu `build/`
- `npm run eject` — wyodrębnia konfigurację (operacja nieodwracalna)

Więcej szczegółów znajdziesz w [dokumentacji Create React App](https://facebook.github.io/create-react-app/docs/getting-started).

### Konfiguracja środowiska

Pliki środowiskowe:
- `.env.development`
  ```
  REACT_APP_API_URL=http://localhost:8080/
  ```
- `.env.production`
  ```
  REACT_APP_API_URL=https://mutarexx.smallhost.pl:37786/
  ```

### Budowanie i uruchamianie

**Instalacja zależności:**
```bash
npm install
```
**Uruchamianie (dev):**
```bash
npm start
```
**Budowanie (prod):**
```bash
npm run build
```

Kod źródłowy frontendu znajdziesz tutaj: [Przeglądaj katalog frontend5 w GitHub](https://github.com/damianPolchlopek/improvement-app/tree/main/frontend5)

---
