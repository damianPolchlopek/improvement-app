CREATE TABLE meal_ingredient
(
    id         SERIAL PRIMARY KEY,
    meal_id    INT                  NOT NULL,
    product_id INT                  NOT NULL,
    name       TEXT                 NOT NULL,
    amount     DOUBLE PRECISION     NOT NULL,
    unit       TEXT
);