--liquibase formatted sql

--changeset damian:create_technologies_schema
CREATE SCHEMA IF NOT EXISTS technologies;

--changeset damian:create_technology_list_table
CREATE TABLE IF NOT EXISTS technologies.technology_list (
    id BIGSERIAL PRIMARY KEY,
    date DATE NOT NULL,
    technology_list JSONB NOT NULL
);
