CREATE SCHEMA IF NOT EXISTS shopping;

CREATE TABLE shopping.shopping_item
(
    id         BIGSERIAL PRIMARY KEY,
    user_id    BIGINT                   NOT NULL REFERENCES users.users (id) ON DELETE CASCADE,
    name       VARCHAR(255)             NOT NULL,
    category   VARCHAR(50)              NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    created_by VARCHAR(255),
    updated_at TIMESTAMP WITH TIME ZONE,
    updated_by VARCHAR(255)
);

CREATE INDEX idx_shopping_item_user_id_category ON shopping.shopping_item (user_id, category);
