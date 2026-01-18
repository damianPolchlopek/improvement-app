-- ====================================================================
-- UTWORZENIE SCHEMATU AUDIT I TABELI REVINFO
-- ====================================================================

-- Schemat dla tabel audytowych
CREATE SCHEMA IF NOT EXISTS audit;

-- Tabela z informacjami o rewizjach (rozszerzona)
CREATE TABLE audit.revinfo (
    rev SERIAL PRIMARY KEY,
    revtstmp BIGINT NOT NULL,
    username VARCHAR(100),
    ip_address VARCHAR(50)
);

-- Indeks na timestamp dla szybszego wyszukiwania po dacie
CREATE INDEX idx_revinfo_revtstmp ON audit.revinfo(revtstmp);

-- Indeks na username dla szybszego wyszukiwania zmian użytkownika
CREATE INDEX idx_revinfo_username ON audit.revinfo(username);

COMMENT ON TABLE audit.revinfo IS 'Tabela z metadanymi rewizji dla Hibernate Envers';
COMMENT ON COLUMN audit.revinfo.rev IS 'Unikalny numer rewizji';
COMMENT ON COLUMN audit.revinfo.revtstmp IS 'Timestamp rewizji w milisekundach (epoch)';
COMMENT ON COLUMN audit.revinfo.username IS 'Username użytkownika, który dokonał zmiany';
COMMENT ON COLUMN audit.revinfo.ip_address IS 'Adres IP użytkownika';