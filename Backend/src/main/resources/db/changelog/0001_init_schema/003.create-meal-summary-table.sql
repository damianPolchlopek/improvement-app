CREATE TABLE diet_summary
(
    id            SERIAL PRIMARY KEY,
    kcal          DOUBLE PRECISION,
    protein       DOUBLE PRECISION,
    carbohydrates DOUBLE PRECISION,
    fat           DOUBLE PRECISION,
    date          DATE
);
