CREATE SCHEMA IF NOT EXISTS other;

CREATE TABLE other.weekly_record
(
    id         BIGSERIAL PRIMARY KEY,
    user_id    BIGINT                   NOT NULL REFERENCES users.users (id) ON DELETE CASCADE,
    name       VARCHAR(255)             NOT NULL,
    category   VARCHAR(50)              NOT NULL,
    date       DATE                     NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    created_by VARCHAR(255),
    updated_at TIMESTAMP WITH TIME ZONE,
    updated_by VARCHAR(255)
);

CREATE INDEX idx_weekly_record_user_id_category_date ON other.weekly_record (user_id, category, date DESC);
