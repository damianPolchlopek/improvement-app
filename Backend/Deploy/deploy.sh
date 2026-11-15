#!/bin/sh
# Wywoływany przez GitHub Actions po wgraniu nowego jara jako app.new.jar.
# Podmienia wersję, sprawdza /actuator/health, a gdy nowa wersja nie wstanie - wraca do poprzedniej.

cd /home/mutarexx/backend

# 1. Znacznik "trwa deploy" - watchdog widzi go i nic nie robi
touch deploy.lock

# 2. Zachowaj obecną wersję na wypadek rollbacku
if [ -f app.jar ]; then
  cp app.jar app.previous.jar
elif [ -f improvement-app-backend-0.0.1-SNAPSHOT.jar ]; then
  # Jednorazowo: przy pierwszym deployu poprzednia wersja ma jeszcze starą nazwę
  cp improvement-app-backend-0.0.1-SNAPSHOT.jar app.previous.jar
fi

# 3. Nowa wersja na miejsce obecnej
mv app.new.jar app.jar

# 4. Zatrzymaj starą aplikację i poczekaj, aż się zamknie
pkill -f /home/mutarexx/backend/app.jar
# Jednorazowo: proces sprzed wprowadzenia tych skryptów miał inną nazwę jara.
# Po pierwszym deployu z tym skryptem tę linię można usunąć.
pkill -f improvement-app-backend-0.0.1-SNAPSHOT.jar
sleep 10
# Jeśli dalej działa - zatrzymaj na twardo, inaczej nowa wersja nie dostanie portu
pkill -9 -f /home/mutarexx/backend/app.jar

# 5. Uruchom nową
./scripts/start.sh

# 6. Sprawdzaj co 5 sekund, czy aplikacja odpowiada "UP" (maks. 36 razy = 3 minuty)
proba=1
while [ $proba -le 36 ]; do
  sleep 5
  if curl -sk https://localhost:37786/actuator/health | grep -q UP; then
    echo "Deploy OK"
    rm deploy.lock
    exit 0          # koniec, sukces
  fi
  proba=$((proba + 1))
done

# 7. Tu jesteśmy tylko wtedy, gdy przez 3 minuty nie było "UP" - rollback
echo "Nowa wersja nie wstała - wracam do poprzedniej. Ostatnie linie logu:"
tail -n 50 /home/mutarexx/logs/backend.log
pkill -f /home/mutarexx/backend/app.jar
sleep 10
pkill -9 -f /home/mutarexx/backend/app.jar
cp app.jar app.failed.jar          # zostaw zepsutą wersję do analizy
cp app.previous.jar app.jar
./scripts/start.sh

rm deploy.lock
exit 1              # błąd - workflow w GitHubie będzie czerwony
