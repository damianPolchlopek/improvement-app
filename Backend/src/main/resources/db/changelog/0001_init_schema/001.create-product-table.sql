CREATE TABLE product
(
    id               INT,
    name             TEXT             NOT NULL,
    kcal             DOUBLE PRECISION NOT NULL,
    protein          DOUBLE PRECISION NOT NULL,
    carbohydrates    DOUBLE PRECISION NOT NULL,
    fat              DOUBLE PRECISION NOT NULL,
    amount           DOUBLE PRECISION NOT NULL,
    unit             TEXT,
    product_category TEXT
);