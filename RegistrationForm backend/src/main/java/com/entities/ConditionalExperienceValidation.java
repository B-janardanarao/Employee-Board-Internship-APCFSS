package com.entities;


import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = ConditionalExperienceValidator.class)
@Target({ElementType.TYPE})  // applies to classes
@Retention(RetentionPolicy.RUNTIME)
public @interface ConditionalExperienceValidation {
    String message() default "Invalid experience data";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}

