CREATE TABLE meal_ingredient (
    id SERIAL PRIMARY KEY,
    product_id INT NOT NULL,
    name TEXT NOT NULL,
    amount DOUBLE PRECISION NOT NULL,
    unit TEXT,
    meal_id BIGINT,
    FOREIGN KEY (meal_id) REFERENCES meal(id)
);