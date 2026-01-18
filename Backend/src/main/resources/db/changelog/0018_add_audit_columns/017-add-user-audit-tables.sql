-- ====================================================================
-- TABELE AUDYTOWE DLA ENVERS
-- Konwencja nazewnictwa: {table_name}_aud
-- REVTYPE: 0 = ADD, 1 = MOD, 2 = DEL
-- ====================================================================

-- === SCHEMA: users ===

-- Audit dla users
CREATE TABLE audit.users_aud (
    id BIGINT NOT NULL,
    rev INTEGER NOT NULL,
    revtype SMALLINT,

    username VARCHAR(20),
    email VARCHAR(50),
    password VARCHAR(255),
    name VARCHAR(50),
    surname VARCHAR(50),
    is_active BOOLEAN,
    email_verified BOOLEAN,
    last_login TIMESTAMP,

    PRIMARY KEY (id, rev),
    CONSTRAINT fk_users_aud_revinfo FOREIGN KEY (rev) REFERENCES audit.revinfo(rev)
);

-- Audit dla user_tokens
CREATE TABLE audit.user_tokens_aud (
    id BIGINT NOT NULL,
    rev INTEGER NOT NULL,
    revtype SMALLINT,

    user_id BIGINT,
    token VARCHAR(255),
    type VARCHAR(50),
    expires_at TIMESTAMP NOT NULL,
    used_at TIMESTAMP,
    created_at TIMESTAMP,

    PRIMARY KEY (id, rev),
    CONSTRAINT fk_user_tokens_aud_revinfo FOREIGN KEY (rev) REFERENCES audit.revinfo(rev)
);

-- Audit dla roles
CREATE TABLE audit.roles_aud (
    id BIGINT NOT NULL,
    rev INTEGER NOT NULL,
    revtype SMALLINT,

    name VARCHAR(20),

    PRIMARY KEY (id, rev),
    CONSTRAINT fk_roles_aud_revinfo FOREIGN KEY (rev) REFERENCES audit.revinfo(rev)
);

-- Audit dla tabeli łączącej user_roles (many-to-many)
CREATE TABLE audit.user_roles_aud (
    rev INTEGER NOT NULL,
    revtype SMALLINT,

    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,

    PRIMARY KEY (rev, user_id, role_id),
    CONSTRAINT fk_user_roles_aud_revinfo FOREIGN KEY (rev) REFERENCES audit.revinfo(rev)
);

-- Indeksy na REV dla szybszego joinowania z REVINFO
CREATE INDEX idx_users_aud_rev ON audit.users_aud(rev);
CREATE INDEX idx_user_tokens_aud_rev ON audit.user_tokens_aud(rev);
CREATE INDEX idx_roles_aud_rev ON audit.roles_aud(rev);
CREATE INDEX idx_user_roles_aud_rev ON audit.user_roles_aud(rev);
