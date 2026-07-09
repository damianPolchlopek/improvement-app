# Automatyczne odnawianie certyfikatów TLS dla Spring Boot 3 *(środowisko współdzielone, brak `sudo`)*

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
                                              │ acme-challenge/ token       │
                                              └──────────┬──────────────────┘
                                                         │  (3) cert + key
┌──────────────────────┐   (A) push na main  ┌──────────▼──────────────────┐
│   GitHub Actions      │────────────────────▶│ convert_and_restart.sh      │
│   (.github/workflows/ │  scp skryptu +       │ – source keystore.env      │
│    main.yml)          │  odświeżenie hasła   │ – PEM → PKCS#12 (OpenSSL)  │
│                       │  w keystore.env      │ – pkill + nohup java …     │
└──────────────────────┘   (B) restart appki   └──────────┬──────────────────┘
                                                         │  (4) keystore.p12
                                              ┌──────────▼───────────────┐
                                              │     Spring Boot 3        │
                                              │ (embedded Tomcat HTTPS)  │
                                              └──────────────────────────┘
```

**Opis kroków**

1. **Cron** uruchamia `~/.acme.sh/acme.sh --cron` raz dziennie.
2. `acme.sh` sprawdza datę ważności; jeśli do końca ≤ 30 dni, wykonuje walidację **HTTP‑01** (token trafia do `public_html/.well-known/acme-challenge/`).
3. Po pomyślnej walidacji klient pobiera **certyfikat** oraz **klucz prywatny** i wywołuje hook `convert_and_restart.sh`.
4. **Niezależnie od crona**, każdy `push` na `main` uruchamia GitHub Actions (`.github/workflows/main.yml`), który:
   * (A) wgrywa aktualną wersję `convert_and_restart.sh` z repo na serwer (`scp` + `chmod +x`),
   * (B) zapisuje bieżącą wartość GitHub Secret `SSL_KEYSTORE_PASSWORD` do pliku `keystore.env` na serwerze i restartuje aplikację z tym samym hasłem w zmiennej środowiskowej.
5. Hook `convert_and_restart.sh` (odpalany przez acme.sh przy odnowie *lub* ręcznie):
   * źródłuje `keystore.env`, żeby znać hasło do keystore'a,
   * konwertuje pliki **PEM → PKCS#12** (`openssl pkcs12 -export …`),
   * zabija starą instancję JVM (`pkill -f …`) i uruchamia nową (`nohup java -jar … &`).
6. Spring Boot ładuje świeży `keystore.p12` i wystawia HTTPS na porcie `37786`.

Kluczowe: **hasło do keystore'a ma jedno źródło prawdy — GitHub Secret `SSL_KEYSTORE_PASSWORD`**. Zarówno rotacja certu (cron), jak i start aplikacji (deploy) czerpią je z tego samego pliku `keystore.env`, więc nie mogą się rozjechać.

---

## Własność komponentów — co gdzie żyje

| Komponent | Gdzie żyje | Kto/co go aktualizuje |
| --- | --- | --- |
| `convert_and_restart.sh` (logika hooka) | Repo: [`Backend/Cert/scripts/convert_and_restart.sh`](scripts/convert_and_restart.sh) → serwer: `/home/mutarexx/scripts/convert_and_restart.sh` | Git (edycja + push); wgrywany automatycznie przy każdym deployu |
| Hasło do keystore'a (`SSL_KEYSTORE_PASSWORD`) | GitHub Secrets (repo settings) | Ręcznie, przez GitHub UI — **to jest jedyne miejsce, w którym się je zmienia** |
| `keystore.env` (kopia hasła w runtime) | Serwer: `/home/mutarexx/domains/mutarexx.smallhost.pl/certs/keystore.env`, poza gitem, `chmod 600` | Automatycznie odświeżany przy każdym deployu z GitHub Secret — nigdy nie edytuj go ręcznie na stałe, bo kolejny deploy i tak nadpisze |
| Certyfikat + klucz prywatny (PEM) | Serwer: `~/.acme.sh/mutarexx.smallhost.pl_ecc/` | `acme.sh` (cron, Let's Encrypt) |
| `keystore.p12` | Serwer: `/home/mutarexx/domains/mutarexx.smallhost.pl/certs/keystore.p12` | Generowany przez `convert_and_restart.sh` przy każdej odnowie certu |
| Reszta sekretów aplikacji (DB, JWT, mail, itd.) | GitHub Secrets | Ręcznie, przez GitHub UI |

Jeśli coś nie działa po zmianie hasła — sprawdzaj w tej kolejności: GitHub Secret → czy był deploy po zmianie → `keystore.env` na serwerze → `keystore.p12` (czy powstał po ostatniej odnowie z tym hasłem).

---

## Użyte narzędzia

| Narzędzie         | Rola w procesie                                                                | Dlaczego właśnie to                                                     |
| ----------------- | ------------------------------------------------------------------------------ | ----------------------------------------------------------------------- |
| **acme.sh**       | Klient ACME – rejestracja konta, walidacja, pobieranie i rotacja certyfikatów. | Napisany w POSIX shell, brak wymagań `sudo`, wbudowane hooki i cron.    |
| **Let's Encrypt** | Wystawca bezpłatnych certyfikatów DV.                                          | Globalnie zaufany; 90‑dniowe certyfikaty wymuszają pełną automatyzację. |
| **OpenSSL 3**     | Konwersja PEM → PKCS#12 dla Spring Boota.                                      | Standardowy pakiet kryptograficzny, preinstalowany.                     |
| **Cron**          | Harmonogram wywołań `acme.sh --cron`.                                          | Dostępny bez uprawnień root.                                            |
| **pkill / pgrep** | Zabicie starej instancji JVM.                                                  | Jedna linijka, brak PID‑file.                                           |
| **nohup … &**     | Uruchomienie Spring Boot w tle.                                                | Nie wymaga `systemd`, działa w każdym shellsessie.                      |
| **GitHub Actions**| Deploy skryptu hooka + odświeżanie hasła w `keystore.env` przy każdym pushu.   | Ten sam pipeline i tak już SSH'uje na serwer przy każdym deployu.       |
| **Spring Boot 3** | Aplikacja docelowa; terminacja TLS.                                            | Embedded Tomcat upraszcza konfigurację (bez nginx).                     |

---

## Dlaczego takie rozwiązanie?

* **Brak `sudo` / `systemd`** – całość działa na prawach zwykłego użytkownika.
* **Minimalne wymagania** – shell + curl/wget + OpenSSL (wszystko dostępne na hostingu).
* **Prywatność** – certyfikaty i klucze znajdują się w katalogu użytkownika; publicznie widoczne są wyłącznie krótkotrwałe tokeny walidacyjne.
* **Pełna automatyzacja** – od sprawdzenia daty po restart JVM.
* **Elastyczność** – zmiana CA lub typu klucza nie wymaga modyfikacji hooka (używamy zmiennych `$Le_Certpath`, `$Le_Keypath`).
* **Jedno źródło prawdy dla hasła** – `SSL_KEYSTORE_PASSWORD` w GitHub Secrets napędza zarówno start aplikacji, jak i rotację certu; eliminuje to klasę błędów, w której hasło rozjeżdża się między dwoma niezależnie edytowanymi miejscami (zobacz sekcję "Historia incydentów" niżej).
* **Łatwe debugowanie** – log odnowy w `~/renew.log`; aplikację można uruchomić w foreground i natychmiast zobaczyć stack‑trace.

---

## Konfiguracja od zera

Kolejność jest istotna — `convert_and_restart.sh` zależy od pliku `keystore.env`, który powstaje dopiero przy deployu, a Spring Boot w ogóle nie wystartuje bez istniejącego `keystore.p12`. Dlatego **pierwszy deploy musi nastąpić przed pierwszym wydaniem certyfikatu**.

### 1. Sekrety w GitHub Actions (Settings → Secrets and variables → Actions)

Ustaw wszystkie sekrety używane w `.github/workflows/main.yml`, w tym:
* `DEPLOY_KEY` — prywatny klucz SSH do serwera,
* `SSL_KEYSTORE_PASSWORD` — dowolne, nowe hasło do keystore'a (to jedyne miejsce, gdzie je wymyślasz i wpisujesz),
* pozostałe sekrety aplikacji (`DB_USERNAME`, `DB_PASSWORD`, `JWT_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `MAIL_USERNAME`, `MAIL_PASSWORD`, `COINMARKETCAP_API_KEY`, `MONGODB_URI`).

### 2. Katalogi na serwerze

```bash
mkdir -p /home/mutarexx/scripts
mkdir -p /home/mutarexx/domains/mutarexx.smallhost.pl/certs
```

### 3. Pierwszy deploy (przed wydaniem certyfikatu!)

Zrób `push` na `main`. Pipeline:
* wgra `convert_and_restart.sh` do `/home/mutarexx/scripts/` i nada mu uprawnienia wykonywalne,
* utworzy `keystore.env` z aktualnym `SSL_KEYSTORE_PASSWORD`,
* spróbuje wystartować aplikację — **to się nie uda**, bo `keystore.p12` jeszcze nie istnieje (błąd "Could not load store" / brak pliku). To oczekiwane na tym etapie, kontynuuj do kroku 4.

### 4. Instalacja `acme.sh`

```bash
curl https://get.acme.sh | sh -s email=certs@mutarexx.smallhost.pl
exec $SHELL  # przeładuj zmienne lub zaloguj się ponownie
```

Po instalacji klient dodaje do crona wpis:

```cron
0 0 * * * ~/.acme.sh/acme.sh --cron
```

### 5. Wydanie pierwszego certyfikatu

```bash
DOMAIN="mutarexx.smallhost.pl"
WEBROOT="/home/mutarexx/domains/$DOMAIN/public_html"

~/.acme.sh/acme.sh --issue -d "$DOMAIN" -w "$WEBROOT" \
  --keylength ec-256 \  # ECDSA 256 bit – szybszy i mniejszy
  --reloadcmd "/home/mutarexx/scripts/convert_and_restart.sh"
```

Po sukcesie `acme.sh` sam wywoła `convert_and_restart.sh` — skrypt zsource'uje już istniejący `keystore.env` (z kroku 3), wygeneruje `keystore.p12` i uruchomi aplikację. Od teraz aplikacja powinna wystartować poprawnie.

### 6. Konfiguracja Spring Boot (`application-smallhost.yaml`)

```yaml
server:
  port: 37786
  ssl:
    key-store: /home/mutarexx/domains/mutarexx.smallhost.pl/certs/keystore.p12
    key-store-password: ${SSL_KEYSTORE_PASSWORD}
    key-store-type: PKCS12
    key-alias: alias_name
```

### 7. Test ręczny

```bash
~/.acme.sh/acme.sh --renew -d mutarexx.smallhost.pl --force
curl -k https://mutarexx.smallhost.pl:37786/actuator/health  # 200 = OK
```

---

## Bieżące działanie (po skonfigurowaniu od zera)

* **Każdy `push` na `main`** → nowa wersja `convert_and_restart.sh` na serwerze + świeży `keystore.env` + restart aplikacji z aktualnym hasłem.
* **Codziennie o 00:00** → `acme.sh --cron` sprawdza ważność certu; jeśli zostało ≤ 30 dni, odnawia go i wywołuje `convert_and_restart.sh`, który używa hasła z `keystore.env` zapisanego przy ostatnim deployu.
* Żeby zmienić hasło do keystore'a: zmień `SSL_KEYSTORE_PASSWORD` w GitHub Secrets i zrób dowolny push na `main` — reszta zsynchronizuje się sama.

---

## Opcjonalne usprawnienia

* **Reverse‑proxy (nginx/Traefik)** – HTTP/2, gzip, cache, rate‑limit.
* **Watchdog procesu** – `nohup` nie restartuje aplikacji po crashu; prosty cron co kilka minut sprawdzający `pgrep` i uruchamiający ponownie zredukowałby ryzyko długich, niezauważonych przestojów (jak w incydencie z maja 2026).
* **Fail2ban / Caddy WAF** – blokada brute‑force na endpointy.

---
