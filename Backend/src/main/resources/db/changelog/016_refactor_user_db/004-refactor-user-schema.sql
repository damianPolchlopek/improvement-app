-- FIX: last_login na timestamptz
ALTER TABLE users.users
ALTER COLUMN last_login TYPE timestamptz USING last_login AT TIME ZONE 'UTC';

-- ADD: UNIQUE constraint na username
ALTER TABLE users.users
ADD CONSTRAINT uk_users_username UNIQUE (username);

-- ADD: UNIQUE index na roles.name
CREATE UNIQUE INDEX idx_roles_name ON users.roles (name);

-- FIX: CASCADE na user_roles FK
ALTER TABLE users.user_roles DROP CONSTRAINT user_roles_user_id_fkey;
ALTER TABLE users.user_roles DROP CONSTRAINT user_roles_role_id_fkey;

ALTER TABLE users.user_roles
    ADD CONSTRAINT user_roles_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES users.users(id) ON DELETE CASCADE;

ALTER TABLE users.user_roles
    ADD CONSTRAINT user_roles_role_id_fkey
    FOREIGN KEY (role_id) REFERENCES users.roles(id) ON DELETE CASCADE;
