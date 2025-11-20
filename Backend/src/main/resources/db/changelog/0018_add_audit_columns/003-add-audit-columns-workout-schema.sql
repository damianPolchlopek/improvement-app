ALTER TABLE workout.exercise ADD COLUMN created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW();
ALTER TABLE workout.exercise ADD COLUMN created_by VARCHAR(255) NOT NULL DEFAULT 'SYSTEM_INIT';
ALTER TABLE workout.exercise ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE workout.exercise ADD COLUMN updated_by VARCHAR(255);

ALTER TABLE workout.exercise_name ADD COLUMN created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW();
ALTER TABLE workout.exercise_name ADD COLUMN created_by VARCHAR(255) NOT NULL DEFAULT 'SYSTEM_INIT';
ALTER TABLE workout.exercise_name ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE workout.exercise_name ADD COLUMN updated_by VARCHAR(255);

ALTER TABLE workout.exercise_set ADD COLUMN created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW();
ALTER TABLE workout.exercise_set ADD COLUMN created_by VARCHAR(255) NOT NULL DEFAULT 'SYSTEM_INIT';
ALTER TABLE workout.exercise_set ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE workout.exercise_set ADD COLUMN updated_by VARCHAR(255);

ALTER TABLE workout.training ADD COLUMN created_by VARCHAR(255) NOT NULL DEFAULT 'SYSTEM_INIT';
ALTER TABLE workout.training ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE workout.training ADD COLUMN updated_by VARCHAR(255);

ALTER TABLE workout.training_template ADD COLUMN created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW();
ALTER TABLE workout.training_template ADD COLUMN created_by VARCHAR(255) NOT NULL DEFAULT 'SYSTEM_INIT';
ALTER TABLE workout.training_template ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE workout.training_template ADD COLUMN updated_by VARCHAR(255);

ALTER TABLE workout.training_template_exercise ADD COLUMN created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW();
ALTER TABLE workout.training_template_exercise ADD COLUMN created_by VARCHAR(255) NOT NULL DEFAULT 'SYSTEM_INIT';
ALTER TABLE workout.training_template_exercise ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE workout.training_template_exercise ADD COLUMN updated_by VARCHAR(255);