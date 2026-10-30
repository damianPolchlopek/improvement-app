-- Ujednolicenie nazw z other.weekly_record (0021 jest już na produkcji, więc zmiana nowym changesetem)
ALTER TABLE other.daily RENAME TO daily_record;
ALTER TABLE other.daily_record RENAME CONSTRAINT daily_pkey TO daily_record_pkey;
ALTER TABLE other.daily_record RENAME CONSTRAINT daily_user_id_fkey TO daily_record_user_id_fkey;
ALTER SEQUENCE other.daily_id_seq RENAME TO daily_record_id_seq;
ALTER INDEX other.idx_daily_user_id_date RENAME TO idx_daily_record_user_id_date;
