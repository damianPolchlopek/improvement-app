#!/bin/sh
set -e

# Hook acme.sh: konwertuje odnowiony cert PEM -> PKCS#12. Aplikacji NIE restartuje -
# Spring Boot (spring.ssl.bundle.jks.web.reload-on-update) sam przeładowuje keystore po
# podmianie pliku. Dzięki temu hook nie potrzebuje sekretów aplikacji (DB, JWT itd.),
# które trafiają na serwer tylko przy deployu z GitHub Actions.
# Nazwa pliku zostaje historyczna, bo acme.sh ma ją zapisaną jako --reloadcmd.

# Hasło do keystore.p12 NIE jest tu hardkodowane - żyje tylko na serwerze,
# w pliku odświeżanym przy każdym deployu z GitHub Secret SSL_KEYSTORE_PASSWORD
# (patrz .github/workflows/main.yml, krok "Restart backend on server and wait for start").
. "/home/mutarexx/backend/certs/keystore.env"

ALIAS="alias_name"
DEST="/home/mutarexx/backend/certs/keystore.p12"
TMP="$DEST.tmp"

openssl pkcs12 -export \
  -inkey  "$Le_Keypath" \
  -in     "$Le_Certpath" \
  -out    "$TMP" \
  -name   "$ALIAS" \
  -passout pass:"$SSL_KEYSTORE_PASSWORD"

# Atomowa podmiana - Spring nie może wczytać w połowie zapisanego pliku.
mv -f "$TMP" "$DEST"

echo "[$(date)] Cert renewed, keystore.p12 replaced (app reloads it without restart)" >> "$HOME/logs/renew.log"
