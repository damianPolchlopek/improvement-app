CREATE SCHEMA IF NOT EXISTS other;

CREATE TABLE other.daily
(
    id         BIGSERIAL PRIMARY KEY,
    user_id    BIGINT                   NOT NULL REFERENCES users.users (id) ON DELETE CASCADE,
    date       DATE                     NOT NULL,
    health     BOOLEAN                  NOT NULL DEFAULT FALSE,
    exercise   BOOLEAN                  NOT NULL DEFAULT FALSE,
    book       BOOLEAN                  NOT NULL DEFAULT FALSE,
    software   BOOLEAN                  NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    created_by VARCHAR(255),
    updated_at TIMESTAMP WITH TIME ZONE,
    updated_by VARCHAR(255)
);

CREATE INDEX idx_daily_user_id_date ON other.daily (user_id, date DESC);
