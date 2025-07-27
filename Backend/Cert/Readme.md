# Automatyczne odnawianie certyfikatów TLS dla Spring Boot 3 *(środowisko współdzielone, brak `sudo`)*

---

## Schemat działania

```
┌─────────────────┐                           ┌─────────────────────────────┐
│  Cron (~/.acme) │──(1) wywołuje────────────▶│         acme.sh             │
└─────────────────┘                           │  klient ACME (Let's Encrypt)│
                                              └──────────┬──────────────────┘
                                                         │  (2) HTTP‑01
                                              ┌──────────▼──────────────────┐
                                              │ public_html/.well-known/    │
                                              │ acme-challenge/ token       │
                                              └──────────┬──────────────────┘
                                                         │  (3) cert + key
                                              ┌──────────▼──────────────────┐
                                              │ convert_and_restart.sh      │
                                              │ – PEM → PKCS#12 (OpenSSL)   │
                                              │ – pkill + nohup java …      │
                                              └──────────┬──────────────────┘
                                                         │  (4) keystore.p12
                                              ┌──────────▼───────────────┐
                                              │     Spring Boot 3        │
                                              │ (embedded Tomcat HTTPS)  │
                                              └──────────────────────────┘
```

**Opis kroków**

1. **Cron** uruchamia `~/.acme.sh/acme.sh --cron` raz dziennie.
2. `acme.sh` sprawdza datę ważności; jeśli do końca ≤ 30 dni, wykonuje walidację **HTTP‑01** (token trafia do `public_html/.well-known/acme-challenge/`).
3. Po pomyślnej walidacji klient pobiera **certyfikat** oraz **klucz prywatny** i wywołuje hook `convert_and_restart.sh`.
4. Hook:

    * konwertuje pliki **PEM → PKCS#12** (`openssl pkcs12 -export …`),
    * zabija starą instancję JVM (`pkill -f …`) i uruchamia nową (`nohup java -jar … &`).
5. Spring Boot ładuje świeży `keystore.p12` i wystawia HTTPS na porcie `37786`.

---

## Użyte narzędzia

| Narzędzie         | Rola w procesie                                                                | Dlaczego właśnie to                                                     |
| ----------------- | ------------------------------------------------------------------------------ | ----------------------------------------------------------------------- |
| **acme.sh**       | Klient ACME – rejestracja konta, walidacja, pobieranie i rotacja certyfikatów. | Napisany w POSIX shell, brak wymagań `sudo`, wbudowane hooki i cron.    |
| **Let’s Encrypt** | Wystawca bezpłatnych certyfikatów DV.                                          | Globalnie zaufany; 90‑dniowe certyfikaty wymuszają pełną automatyzację. |
| **OpenSSL 3**     | Konwersja PEM → PKCS#12 dla Spring Boota.                                      | Standardowy pakiet kryptograficzny, preinstalowany.                     |
| **Cron**          | Harmonogram wywołań `acme.sh --cron`.                                          | Dostępny bez uprawnień root.                                            |
| **pkill / pgrep** | Zabicie starej instancji JVM.                                                  | Jedna linijka, brak PID‑file.                                           |
| **nohup … &**     | Uruchomienie Spring Boot w tle.                                                | Nie wymaga `systemd`, działa w każdym shellsessie.                      |
| **Spring Boot 3** | Aplikacja docelowa; terminacja TLS.                                            | Embedded Tomcat upraszcza konfigurację (bez nginx).                     |

---

## Dlaczego takie rozwiązanie?

* **Brak `sudo` / `systemd`** – całość działa na prawach zwykłego użytkownika.
* **Minimalne wymagania** – shell + curl/wget + OpenSSL (wszystko dostępne na hostingu).
* **Prywatność** – certyfikaty i klucze znajdują się w katalogu użytkownika; publicznie widoczne są wyłącznie krótkotrwałe tokeny walidacyjne.
* **Pełna automatyzacja** – od sprawdzenia daty po restart JVM.
* **Elastyczność** – zmiana CA lub typu klucza nie wymaga modyfikacji hooka (używamy zmiennych `$Le_Certpath`, `$Le_Keypath`).
* **Łatwe debugowanie** – log odnowy w `~/renew.log`; aplikację można uruchomić w foreground i natychmiast zobaczyć stack‑trace.

---

## Instrukcja wdrożenia

### 1. Instalacja `acme.sh`

```bash
curl https://get.acme.sh | sh -s email=certs@mutarexx.smallhost.pl
exec $SHELL  # przeładuj zmienne lub zaloguj się ponownie
```

Po instalacji klient dodaje do crona wpis:

```cron
0 0 * * * ~/.acme.sh/acme.sh --cron
```

### 2. Wydanie pierwszego certyfikatu

```bash
DOMAIN="mutarexx.smallhost.pl"
WEBROOT="/home/mutarexx/domains/$DOMAIN/public_html"

~/.acme.sh/acme.sh --issue -d "$DOMAIN" -w "$WEBROOT" \
  --keylength ec-256 \  # ECDSA 256 bit – szybszy i mniejszy
  --reloadcmd "/home/mutarexx/scripts/convert_and_restart.sh"
```

### 3. Hook `convert_and_restart.sh`

```bash
#!/bin/sh
set -e

DOMAIN="$Le_Domain"
ALIAS="alias_name"
PASSWORD="XXXXXXXX"            # ← to samo w application.yml
DEST="/home/mutarexx/domains/$DOMAIN/certs/keystore.p12"
JAR="/home/mutarexx/domains/$DOMAIN/improvement-app-backend-0.0.1-SNAPSHOT.jar"

openssl pkcs12 -export \
  -inkey  "$Le_Keypath" \
  -in     "$Le_Certpath" \
  -out    "$DEST" \
  -name   "$ALIAS" \
  -passout pass:"$PASSWORD"

pkill -f improvement-app-backend || true
nohup java -jar "$JAR" >/dev/null 2>&1 &

echo "[$(date)] Cert renewed and app restarted" >> "$HOME/renew.log"
```

> **Przyznaj uprawnienia**:
>
> ```bash
> chmod +x /home/mutarexx/scripts/convert_and_restart.sh
> ```

### 4. Konfiguracja Spring Boot (`application.yml`)

```yaml
server:
  port: 37786
  ssl:
    key-store: /home/mutarexx/domains/mutarexx.smallhost.pl/certs/keystore.p12
    key-store-password: XXXXXXXXX
    key-store-type: PKCS12
    key-alias: alias_name
```

### 5. Test ręczny

```bash
~/.acme.sh/acme.sh --renew -d mutarexx.smallhost.pl --force
curl -k https://mutarexx.smallhost.pl:37786/actuator/health  # 200 = OK
```

---

## Opcjonalne usprawnienia

* **Reverse‑proxy (nginx/Traefik)** – HTTP/2, gzip, cache, rate‑limit.
* **Vault / zmienne środowiskowe** – przechowywanie hasła poza plikiem YAML.
* **Fail2ban / Caddy WAF** – blokada brute‑force na endpointy.

---
