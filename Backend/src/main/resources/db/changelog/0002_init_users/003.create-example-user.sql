-- Wstawienie ról do tabeli roles
INSERT INTO users.roles (name) VALUES
('ROLE_ADMIN'),
('ROLE_USER');

-- Wstawienie użytkownika do tabeli users
INSERT INTO users.users (username, email, password) VALUES
('test', 'test@example.com', 'test');

-- Pobranie ID użytkownika 'test'
DO $$
DECLARE
    user_id BIGINT;
    role_admin_id BIGINT;
    role_user_id BIGINT;
BEGIN
    -- Pobierz ID użytkownika
    SELECT id INTO user_id FROM users.users WHERE username = 'test';

    -- Pobierz ID ról
    SELECT id INTO role_admin_id FROM users.roles WHERE name = 'ROLE_ADMIN';
    SELECT id INTO role_user_id FROM users.roles WHERE name = 'ROLE_USER';

    -- Powiązanie użytkownika z rolami
    INSERT INTO users.user_roles (user_id, role_id) VALUES (user_id, role_admin_id);
    INSERT INTO users.user_roles (user_id, role_id) VALUES (user_id, role_user_id);
END $$;
