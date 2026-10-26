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

# acme.sh przekazuje do --reloadcmd ścieżki w CERT_KEY_PATH / CERT_FULLCHAIN_PATH
# (Le_Keypath/Le_Certpath są puste, jeśli nie użyto --install-cert). Fallback na
# katalog acme.sh pozwala też odpalić hook ręcznie.
ACME_DIR="$HOME/.acme.sh/grindtrack.pl_ecc"
KEY="${CERT_KEY_PATH:-$ACME_DIR/grindtrack.pl.key}"
# fullchain = cert + certyfikat pośredni; sam .cer nie wystarcza części klientów
CHAIN="${CERT_FULLCHAIN_PATH:-$ACME_DIR/fullchain.cer}"

openssl pkcs12 -export \
  -inkey  "$KEY" \
  -in     "$CHAIN" \
  -out    "$TMP" \
  -name   "$ALIAS" \
  -passout pass:"$SSL_KEYSTORE_PASSWORD"

# Atomowa podmiana - Spring nie może wczytać w połowie zapisanego pliku.
mv -f "$TMP" "$DEST"

echo "[$(date)] Cert renewed, keystore.p12 replaced (app reloads it without restart)" >> "$HOME/logs/renew.log"
