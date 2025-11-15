ALTER TABLE users.users ALTER COLUMN password TYPE VARCHAR(255);
ALTER TABLE users.users ALTER COLUMN id TYPE BIGINT;
ALTER TABLE users.users DROP COLUMN IF EXISTS email_verification_token;
ALTER TABLE users.users DROP COLUMN IF EXISTS email_verification_expires;

ALTER SEQUENCE users.users_id_seq AS BIGINT;

CREATE UNIQUE INDEX idx_users_email ON users.users(email);
CREATE INDEX idx_users_username ON users.users(username);
CREATE INDEX idx_user_roles_user_id ON users.user_roles(user_id);
