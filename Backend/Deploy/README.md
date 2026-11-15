# Deploy backendu na small.pl

Skrypty uruchamiane na serwerze produkcyjnym. GitHub Actions ([`.github/workflows/main.yml`](../../.github/workflows/main.yml))
wgrywa je przy każdym deployu do `/home/mutarexx/backend/scripts/`.

| Skrypt | Kto go uruchamia | Co robi |
|---|---|---|
| [`start.sh`](start.sh) | `deploy.sh`, `watchdog.sh` | Wczytuje sekrety z `app.env` i uruchamia `app.jar` w tle. Jedyne miejsce z flagami JVM. |
| [`deploy.sh`](deploy.sh) | GitHub Actions (po wgraniu `app.new.jar`) | Zachowuje obecną wersję jako `app.previous.jar`, uruchamia nową i przez 3 minuty sprawdza `/actuator/health`. Gdy nie ma `UP` — wraca do poprzedniej wersji i kończy się błędem (workflow czerwony, frontend nie jest wdrażany). |
| [`watchdog.sh`](watchdog.sh) | cron co 5 minut | Jeśli proces nie działa (np. po braku pamięci), uruchamia go ponownie. W trakcie deployu nic nie robi. |

## Pliki na serwerze

```
/home/mutarexx/backend/
├── app.jar            ← bieżąca wersja
├── app.previous.jar   ← poprzednia, do rollbacku
├── app.failed.jar     ← wersja, która nie wstała (zostaje do analizy)
├── app.new.jar        ← wgrana przez CI, czeka na deploy.sh
├── app.env            ← sekrety (chmod 600), zapisywane przy każdym deployu
├── deploy.lock        ← istnieje tylko w trakcie deployu
└── scripts/           ← te skrypty + convert_and_restart.sh (hook odnowy certu)
```

Logi w `/home/mutarexx/logs/`: `backend.log` (aplikacja), `stdout.log` (wypisy JVM sprzed startu logowania),
`watchdog.log` (restarty z watchdoga).

## Dlaczego sekrety są w pliku

Spring czyta sekrety ze zmiennych środowiskowych tylko przy starcie. Watchdog uruchamia aplikację z crona,
gdy sesji z GitHub Actions już nie ma, więc musi je wziąć z pliku. Źródłem prawdy pozostają GitHub Secrets —
`app.env` jest nadpisywany przy każdym deployu, nie edytuj go ręcznie.

## Jednorazowa konfiguracja

1. Po pierwszym deployu z tymi skryptami dodaj watchdoga do crona (`crontab -e` na serwerze):
   ```
   */5 * * * * /home/mutarexx/backend/scripts/watchdog.sh
   ```
2. Pierwszy deploy zatrzymuje też proces o starej nazwie (`improvement-app-backend-0.0.1-SNAPSHOT.jar`)
   i zachowuje go jako `app.previous.jar`. Po nim te dwa fragmenty w `deploy.sh` (oznaczone „Jednorazowo”)
   można usunąć, a stary plik jara skasować.

## Ręczny rollback

```sh
cd /home/mutarexx/backend
touch deploy.lock                  # watchdog nie przeszkadza
pkill -f /home/mutarexx/backend/app.jar
cp app.previous.jar app.jar
./scripts/start.sh
rm deploy.lock
```
