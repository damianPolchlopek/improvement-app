-- Kolejność ćwiczeń w szablonie treningu (mapowana przez @OrderColumn, liczona od 0)
ALTER TABLE workout.training_template_exercise ADD COLUMN position INT;

-- Uzupełnienie istniejących wierszy: kolejność zapisu (id) = kolejność z pliku szablonu na Drive
UPDATE workout.training_template_exercise tte
SET position = ordered.pos
FROM (SELECT id,
             ROW_NUMBER() OVER (PARTITION BY training_template_id ORDER BY id) - 1 AS pos
      FROM workout.training_template_exercise) ordered
WHERE tte.id = ordered.id;

ALTER TABLE workout.training_template_exercise ALTER COLUMN position SET NOT NULL;
