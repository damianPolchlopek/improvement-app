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

Odtwarzanie na produkcję: najpierw zatrzymaj aplikację (`touch ~/backend/deploy.lock`, żeby watchdog jej
nie podniósł, i `pkill -f /home/mutarexx/backend/app.jar`), potem odtwórz do bazy, a na koniec
uruchom `~/backend/scripts/start.sh` i usuń `deploy.lock`.

## Do pamiętania

- GitHub wyłącza zaplanowane workflow po 60 dniach bez aktywności w repozytorium (wysyła wtedy maila) —
  po dłuższej przerwie trzeba je włączyć ponownie w zakładce Actions.
- Kopia obejmuje tylko bazę. Pliki na serwerze (`serviceAccount.json`, certyfikaty) odtwarza się z
  GitHub Secrets i instrukcji w [`Backend/Cert/Readme.md`](../Cert/Readme.md).
