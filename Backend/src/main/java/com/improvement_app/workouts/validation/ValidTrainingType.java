package com.improvement_app.workouts.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import jakarta.validation.constraints.Pattern;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Composed constraint: dopuszcza tylko znane skróty typu treningu
 * (te same, które rozpoznaje TrainingTypeConverter).
 */
@Target({ElementType.PARAMETER, ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Pattern(regexp = "^(A|B|C|D|E|K1|K2|K3|KARDIO|F1|F2|F)$",
        message = "Nieprawidłowy typ treningu")
@Constraint(validatedBy = {})
public @interface ValidTrainingType {

    String message() default "Nieprawidłowy typ treningu";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};

}
