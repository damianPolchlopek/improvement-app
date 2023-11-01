CREATE TABLE users.users
(
    id       SERIAL PRIMARY KEY,
    username VARCHAR(20)  NOT NULL,
    email    VARCHAR(50)  NOT NULL,
    password VARCHAR(120) NOT NULL
);

CREATE TABLE users.user_roles
(
    user_id BIGINT,
    role_id BIGINT,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users.users (id),
    FOREIGN KEY (role_id) REFERENCES users.roles (id)
);