package com.registration;



import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;


@SpringBootApplication(scanBasePackages = "com")
@EnableJpaRepositories(basePackages = "com.repo")
@EntityScan(basePackages = "com.entities")
public class RegistrationFormApplication {

	public static void main(String[] args) {
		SpringApplication.run(RegistrationFormApplication.class, args);
		
		
	}

}
