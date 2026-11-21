#!/bin/sh
# Uruchamia backend w tle. Używają go deploy.sh i watchdog.sh.
# Na serwerze: /home/mutarexx/backend/scripts/start.sh (wgrywany przy każdym deployu).

# Cron ma bardzo krótki PATH - bez tego nie znalazłby javy (/usr/local/bin na FreeBSD)
export PATH=/usr/local/bin:/usr/bin:/bin

# Wybór wersji Javy na small.pl
export JAVA_VERSION=25

# Wczytaj sekrety (hasło do bazy, JWT itd.) jako zmienne środowiskowe.
# Plik zapisuje GitHub Actions przy każdym deployu (chmod 600).
. /home/mutarexx/backend/app.env

# Polskie znaki w nazwach plików - bez UTF-8 JVM rzuca InvalidPathException
export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8

# Start Javy w tle (nohup + & na końcu), wypisy idą do stdout.log.
# ExitOnOutOfMemoryError: przy braku pamięci JVM się kończy (zamiast działać popsuta),
# a watchdog uruchamia ją od nowa.
nohup java \
  -Xms32m -Xmx192m \
  -XX:MaxMetaspaceSize=160m \
  -XX:CompressedClassSpaceSize=48m \
  -XX:ReservedCodeCacheSize=32m \
  -XX:+UseSerialGC \
  -XX:+ExitOnOutOfMemoryError \
  -jar /home/mutarexx/backend/app.jar \
  --spring.profiles.active=smallhost \
  --server.port=37786 \
  < /dev/null > /home/mutarexx/logs/stdout.log 2>&1 &
# "< /dev/null": proces w tle nie trzyma wejścia sesji SSH, więc deploy z GitHuba nie zawiśnie
