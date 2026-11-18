# Kopie zapasowe bazy

Workflow [`.github/workflows/backup.yml`](../../.github/workflows/backup.yml) codziennie o 2:00 UTC:

1. przez SSH uruchamia na serwerze [`dump.sh`](dump.sh) (`pg_dump`) — kopia płynie od razu na maszynę GitHuba, nie zostaje na dysku serwera,
2. szyfruje ją narzędziem [`age`](https://github.com/FiloSottile/age) kluczem publicznym,
3. wysyła na prywatny Google Drive (`rclone`) do `improvement-app-backup/daily/`, a w niedzielę także do `weekly/`,
4. zostawia 7 najnowszych kopii dziennych i 4 tygodniowe (starsze trafiają do kosza na Drive).

1. dnia miesiąca (albo ręcznie: **Actions → Database backup → Run workflow** z zaznaczonym testem) dodatkowo
**test odtwarzania**: pobiera kopię z Drive, odszyfrowuje, odtwarza w pustym Postgresie w kontenerze
i sprawdza [`restore-check.sql`](restore-check.sql) — kluczowe tabele nie mogą być puste. Liczba wierszy
wszystkich tabel trafia do podsumowania uruchomienia.

Gdy cokolwiek się nie uda, workflow jest czerwony, a GitHub wysyła maila.

## Jednorazowa konfiguracja

### 1. Sprawdź `pg_dump` na serwerze

```sh
ssh mutarexx@s2.small.pl 'pg_dump --version'
```

Wpisz główną wersję (np. `16`) jako `PG_VERSION` w `backup.yml` — test odtwarzania musi używać Postgresa
co najmniej w tej wersji, inaczej `pg_restore` nie odczyta kopii.

### 2. Klucz szyfrujący (`age`)

Lokalnie (`age` jest w winget/brew/apt):

```sh
age-keygen -o backup-key.txt
```

- Linia `# public key: age1...` → **Settings → Secrets and variables → Actions → Variables**:
  `BACKUP_AGE_PUBLIC_KEY` (klucz publiczny nie jest tajny).
- Cała zawartość `backup-key.txt` → **Secrets**: `BACKUP_AGE_PRIVATE_KEY` (do testu odtwarzania).
- `backup-key.txt` zapisz w menedżerze haseł i usuń z dysku. **Bez tego klucza kopii nie da się odczytać.**

### 3. Dostęp do Google Drive (`rclone`)

Lokalnie: `rclone config` → `n` (new remote) → nazwa **`gdrive`** → typ `drive` → `client_id` i
`client_secret` puste → scope **`drive.file`** (rclone widzi tylko pliki, które sam utworzył) →
reszta domyślnie, logowanie w przeglądarce swoim kontem Google.

Potem `rclone config file` pokaże ścieżkę do `rclone.conf` — skopiuj z niego sekcję `[gdrive]` do
**Secrets**: `RCLONE_CONFIG`.

Uwaga: przy pustym `client_id` rclone używa własnej, opublikowanej aplikacji Google, więc token nie
wygasa. Jeśli kiedyś podasz własny `client_id` z aplikacji w trybie „Testing”, token wygaśnie po 7 dniach.

### 4. Pierwsze uruchomienie

**Actions → Database backup → Run workflow** z zaznaczonym testem odtwarzania. Powinny pojawić się
plik w `improvement-app-backup/daily/` na Drive i tabela z liczbą wierszy w podsumowaniu.

## Odtwarzanie na produkcję (ręcznie)

Robisz to na serwerze po `ssh mutarexx@s2.small.pl`. Wcześniej, na laptopie, pobierz i odszyfruj kopię (patrz niżej, „Ręczne odtworzenie") i wyślij ją na serwer:

```sh
scp backup.dump mutarexx@s2.small.pl:/home/mutarexx/backup.dump
```

Na small.pl nie ma `DROP DATABASE` (brak uprawnień do tworzenia baz), więc zamiast tego usuwa się wszystkie obiekty użytkownika w bazie `p2222_food`.

```sh
# 1. dane do bazy (w każdej nowej sesji SSH) i sprawdzenie pliku
. ~/backend/app.env
export PGPASSWORD="$DB_PASSWORD"
head -c 5 ~/backup.dump                     # ma wypisać PGDMP
pg_restore --list ~/backup.dump | head      # podgląd; błąd = uszkodzona kopia

# 2. kopia obecnego stanu (do cofnięcia)
pg_dump --format=custom --host=pgsql2.small.pl --username="$DB_USERNAME" --dbname=p2222_food > ~/before-restore.dump
ls -l ~/before-restore.dump                 # rozmiar > 0

# 3. zatrzymanie aplikacji (deploy.lock blokuje watchdoga)
touch ~/backend/deploy.lock
pkill -f /home/mutarexx/backend/app.jar; sleep 10; pkill -9 -f /home/mutarexx/backend/app.jar

# 4. usunięcie starej bazy (schematy, tabele, sekwencje użytkownika)
psql --host=pgsql2.small.pl --username="$DB_USERNAME" --dbname=p2222_food --set=ON_ERROR_STOP=1 \
  -c 'DROP OWNED BY CURRENT_USER CASCADE;' -c 'CREATE SCHEMA IF NOT EXISTS public;'

# 5. wgranie kopii
pg_restore --no-owner --no-privileges --exit-on-error \
  --host=pgsql2.small.pl --username="$DB_USERNAME" --dbname=p2222_food ~/backup.dump

# 6. uruchomienie aplikacji i sprawdzenie
rm -f ~/backend/deploy.lock
~/backend/scripts/watchdog.sh
curl -sk https://localhost:37786/actuator/health   # po 1-3 min ma zwrócić UP

# 7. sprzątanie (pliki .dump są nieszyfrowane)
rm ~/backup.dump ~/before-restore.dump
```

Czego być świadomym:

- Wszystko, co zapisano w bazie **po** zrobieniu kopii, przepada.
- Kroki 4 i 5 nie są atomowe — między nimi baza jest pusta, dlatego krok 2 jest obowiązkowy. Gdy krok 5 się nie uda: powtórz krok 4 i wgraj `~/before-restore.dump` tym samym poleceniem co w kroku 5.
- Po odtworzeniu starszej kopii Liquibase przy starcie aplikacji sam doda brakujące zmiany.
- Na serwerze muszą być `pg_dump`, `pg_restore` i `psql`: `which pg_dump pg_restore psql`.

## Ręczne odtworzenie

```sh
rclone copy gdrive:improvement-app-backup/daily/improvement-app-2026-11-15.dump.age .
age --decrypt --identity backup-key.txt --output backup.dump improvement-app-2026-11-15.dump.age

# Podgląd zawartości kopii
pg_restore --list backup.dump

# Odtworzenie do nowej, pustej bazy (np. lokalnej)
createdb improvement_restore
pg_restore --no-owner --no-privileges --dbname=improvement_restore backup.dump
```

To służy do podglądu kopii albo odtwarzania do lokalnej bazy. Produkcję odtwarzaj procedurą opisaną wyżej
(zatrzymanie aplikacji, kopia bezpieczeństwa, czyszczenie bazy, wgranie kopii).

## Do pamiętania

- GitHub wyłącza zaplanowane workflow po 60 dniach bez aktywności w repozytorium (wysyła wtedy maila) —
  po dłuższej przerwie trzeba je włączyć ponownie w zakładce Actions.
- Kopia obejmuje tylko bazę. Pliki na serwerze (`serviceAccount.json`, certyfikaty) odtwarza się z
  GitHub Secrets i instrukcji w [`Backend/Cert/Readme.md`](../Cert/Readme.md).
