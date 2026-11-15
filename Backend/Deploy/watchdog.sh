#!/bin/sh
# Odpalany z crona co 5 minut. Jeśli aplikacja nie działa - uruchamia ją ponownie.
# Wpis w crontab (crontab -e na serwerze):
#   */5 * * * * /home/mutarexx/backend/scripts/watchdog.sh

# Cron ma bardzo krótki PATH
export PATH=/usr/local/bin:/usr/bin:/bin

cd /home/mutarexx/backend

# Trwa deploy? Nic nie rób.
if [ -f deploy.lock ]; then
  exit 0
fi

# Aplikacja działa? Nic nie rób.
if pgrep -f /home/mutarexx/backend/app.jar > /dev/null; then
  exit 0
fi

# Nie działa - zapisz to w logu i uruchom ponownie
echo "$(date) Aplikacja nie działała - uruchamiam" >> /home/mutarexx/logs/watchdog.log
./scripts/start.sh
