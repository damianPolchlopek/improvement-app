-- Audit dla product
CREATE TABLE audit.product_aud (
    id BIGINT NOT NULL,
    rev INTEGER NOT NULL,
    revtype SMALLINT,

    name VARCHAR(255),
    kcal DOUBLE PRECISION,
    protein DOUBLE PRECISION,
    carbohydrates DOUBLE PRECISION,
    fat DOUBLE PRECISION,
    amount DOUBLE PRECISION,
    unit VARCHAR(50),
    product_category VARCHAR(50),

    PRIMARY KEY (id, rev),
    CONSTRAINT fk_product_aud_revinfo FOREIGN KEY (rev) REFERENCES audit.revinfo(rev)
);

-- Audit dla meal_recipe
CREATE TABLE audit.meal_recipe_aud (
    id BIGINT NOT NULL,
    rev INTEGER NOT NULL,
    revtype SMALLINT,

    name VARCHAR(255),
    kcal DOUBLE PRECISION,
    protein DOUBLE PRECISION,
    carbohydrates DOUBLE PRECISION,
    fat DOUBLE PRECISION,
    portion_amount DOUBLE PRECISION,
    url VARCHAR(500),
    category VARCHAR(50),
    type VARCHAR(50),
    recipe JSONB,
    popularity VARCHAR(50),

    PRIMARY KEY (id, rev),
    CONSTRAINT fk_meal_recipe_aud_revinfo FOREIGN KEY (rev) REFERENCES audit.revinfo(rev)
);

-- Audit dla meal_ingredient
CREATE TABLE audit.meal_ingredient_aud (
    id BIGINT NOT NULL,
    rev INTEGER NOT NULL,
    revtype SMALLINT,

    meal_id BIGINT,
    product_id BIGINT,
    name VARCHAR(255),
    amount DOUBLE PRECISION,
    unit VARCHAR(50),

    PRIMARY KEY (id, rev),
    CONSTRAINT fk_meal_ingredient_aud_revinfo FOREIGN KEY (rev) REFERENCES audit.revinfo(rev)
);

-- Audit dla diet_summary
CREATE TABLE audit.diet_summary_aud (
    id BIGINT NOT NULL,
    rev INTEGER NOT NULL,
    revtype SMALLINT,

    kcal DOUBLE PRECISION,
    protein DOUBLE PRECISION,
    carbohydrates DOUBLE PRECISION,
    fat DOUBLE PRECISION,
    date DATE,
    user_id BIGINT,

    PRIMARY KEY (id, rev),
    CONSTRAINT fk_diet_summary_aud_revinfo FOREIGN KEY (rev) REFERENCES audit.revinfo(rev)
);

-- Audit dla daily_meal
CREATE TABLE audit.daily_meal_aud (
    id BIGINT NOT NULL,
    rev INTEGER NOT NULL,
    revtype SMALLINT,

    name VARCHAR(255),
    cached_kcal DOUBLE PRECISION,
    cached_protein DOUBLE PRECISION,
    cached_carbohydrates DOUBLE PRECISION,
    cached_fat DOUBLE PRECISION,
    portion_multiplier DOUBLE PRECISION,
    meal_recipe_id BIGINT,
    diet_summary_id BIGINT,

    PRIMARY KEY (id, rev),
    CONSTRAINT fk_daily_meal_aud_revinfo FOREIGN KEY (rev) REFERENCES audit.revinfo(rev)
);

-- Audit dla daily_meal_ingredient
CREATE TABLE audit.daily_meal_ingredient_aud (
    id BIGINT NOT NULL,
    rev INTEGER NOT NULL,
    revtype SMALLINT,

    product_id BIGINT,
    daily_meal_id BIGINT,
    name VARCHAR(255),
    amount DOUBLE PRECISION,
    unit VARCHAR(50),

    PRIMARY KEY (id, rev),
    CONSTRAINT fk_daily_meal_ingredient_aud_revinfo FOREIGN KEY (rev) REFERENCES audit.revinfo(rev)
);





-- ====================================================================
-- INDEKSY DLA WYDAJNOŚCI
-- ====================================================================

CREATE INDEX idx_product_aud_rev ON audit.product_aud(rev);
CREATE INDEX idx_meal_recipe_aud_rev ON audit.meal_recipe_aud(rev);
CREATE INDEX idx_meal_ingredient_aud_rev ON audit.meal_ingredient_aud(rev);
CREATE INDEX idx_diet_summary_aud_rev ON audit.diet_summary_aud(rev);
CREATE INDEX idx_daily_meal_aud_rev ON audit.daily_meal_aud(rev);
CREATE INDEX idx_daily_meal_ingredient_aud_rev ON audit.daily_meal_ingredient_aud(rev);