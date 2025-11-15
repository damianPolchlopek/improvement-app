CREATE TABLE users.user_tokens (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users.users(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL UNIQUE,
    type VARCHAR(50) NOT NULL, -- EMAIL_VERIFICATION, PASSWORD_RESET, REMEMBER_ME, etc.
    expires_at TIMESTAMPTZ NOT NULL,
    used_at TIMESTAMPTZ,       -- kiedy został użyty (NULL = nie użyty)
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_user_tokens_token ON users.user_tokens(token);
CREATE INDEX idx_user_tokens_user_id ON users.user_tokens(user_id);
CREATE INDEX idx_user_tokens_expires_at ON users.user_tokens(expires_at); -- dla cleanup
