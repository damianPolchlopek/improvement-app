#!/bin/sh
# Robi kopię bazy produkcyjnej i wypisuje ją na standardowe wyjście.
# Uruchamia go GitHub Actions (.github/workflows/backup.yml) przez SSH:
#   ssh mutarexx@s2.small.pl sh -s < Backend/Backup/dump.sh > backup.dump
# Kopia płynie od razu przez SSH na maszynę GitHuba - nic nie zostaje na dysku serwera.

# Krótki PATH w sesji bez terminala - pg_dump jest w /usr/local/bin na FreeBSD
export PATH=/usr/local/bin:/usr/bin:/bin

# Login i hasło do bazy (ten sam plik, którego używa aplikacja)
. /home/mutarexx/backend/app.env
export PGPASSWORD="$DB_PASSWORD"

# Wersja trafia do logu workflow (stderr), nie do pliku kopii
pg_dump --version >&2

# --format=custom: skompresowany format, który odtwarza pg_restore
pg_dump --format=custom \
  --host=pgsql2.small.pl \
  --username="$DB_USERNAME" \
  --dbname=p2222_food
