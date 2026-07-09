#!/bin/sh
set -e

# Hasło do keystore.p12 NIE jest tu hardkodowane - żyje tylko na serwerze,
# w pliku odświeżanym przy każdym deployu z GitHub Secret SSL_KEYSTORE_PASSWORD
# (patrz .github/workflows/main.yml, krok "Restart backend on server and wait for start").
. "/home/mutarexx/domains/mutarexx.smallhost.pl/certs/keystore.env"

DOMAIN="$Le_Domain"
ALIAS="alias_name"
DEST="/home/mutarexx/domains/$DOMAIN/certs/keystore.p12"
JAR="/home/mutarexx/domains/$DOMAIN/improvement-app-backend-0.0.1-SNAPSHOT.jar"

openssl pkcs12 -export \
  -inkey  "$Le_Keypath" \
  -in     "$Le_Certpath" \
  -out    "$DEST" \
  -name   "$ALIAS" \
  -passout pass:"$SSL_KEYSTORE_PASSWORD"

pkill -f improvement-app-backend || true
sleep 2
nohup java -Xms32m -Xmx192m -XX:MaxMetaspaceSize=160m -XX:CompressedClassSpaceSize=48m -XX:ReservedCodeCacheSize=32m -XX:+UseSerialGC \
  -jar "$JAR" --spring.profiles.active=smallhost --server.port=37786 > "$HOME/backend.log" 2>&1 &

echo "[$(date)] Cert renewed and app restarted" >> "$HOME/renew.log"
