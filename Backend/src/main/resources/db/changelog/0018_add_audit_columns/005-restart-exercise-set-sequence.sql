SELECT setval('workout.exercise_set_id_seq',
              (SELECT COALESCE(MAX(id), 0) FROM workout.exercise_set) + 50,
              false);