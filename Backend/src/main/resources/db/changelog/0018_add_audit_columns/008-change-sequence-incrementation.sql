-- Dla exercise_set (ma już allocationSize=50 w kodzie)
ALTER SEQUENCE workout.exercise_set_id_seq INCREMENT BY 50;

-- Dla training (będzie miało allocationSize=50)
ALTER SEQUENCE workout.training_id_seq INCREMENT BY 50;

-- Dla exercise (będzie miało allocationSize=50)
ALTER SEQUENCE workout.exercise_id_seq INCREMENT BY 50;

-- Opcjonalnie: Ustaw starting value powyżej obecnych danych
SELECT setval('workout.exercise_set_id_seq',
    COALESCE((SELECT MAX(id) FROM workout.exercise_set), 0) + 1);
SELECT setval('workout.training_id_seq',
    COALESCE((SELECT MAX(id) FROM workout.training), 0) + 1);
SELECT setval('workout.exercise_id_seq',
    COALESCE((SELECT MAX(id) FROM workout.exercise), 0) + 1);