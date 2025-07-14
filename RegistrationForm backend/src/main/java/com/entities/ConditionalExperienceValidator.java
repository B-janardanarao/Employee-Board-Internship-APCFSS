package com.entities;

import java.util.List;


import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class ConditionalExperienceValidator implements ConstraintValidator<ConditionalExperienceValidation, Employees> {

    @Override
    public boolean isValid(Employees employee, ConstraintValidatorContext context) {
        List<Experience> experiences = employee.getExperiences();

        if (experiences == null || experiences.isEmpty()) {
            return true; // No experience? Nothing to validate.
        }

        for (int i = 0; i < experiences.size(); i++) {
            Experience exp = experiences.get(i);
            if (isBlank(exp.getLocation()) || isBlank(exp.getOrgname()) ||
                isBlank(exp.getFromDate()) || isBlank(exp.getToDate())
         ) {

				/*
				 * context.disableDefaultConstraintViolation();
				 * context.buildConstraintViolationWithTemplate( "  ")
				 * .addConstraintViolation();
				 * 
				 * return false;
				 */
            	return false;
            }
        }

        return true;
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}
