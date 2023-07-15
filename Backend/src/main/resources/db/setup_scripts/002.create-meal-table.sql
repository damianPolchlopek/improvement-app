CREATE TABLE meal (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    kcal DOUBLE PRECISION NOT NULL,
    protein DOUBLE PRECISION NOT NULL,
    carbohydrates DOUBLE PRECISION NOT NULL,
    fat DOUBLE PRECISION NOT NULL,
    portion_amount DOUBLE PRECISION NOT NULL,
    url TEXT,
    category TEXT,
    type TEXT,
	recipe jsonb
);