package com.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
public class SecurityConfig {

	@Autowired
	private JwtFilter jwtFilter;
	
	 @Bean
	    public PasswordEncoder passwordEncoder() {
	        return new BCryptPasswordEncoder();
	    }


	 @Bean
	 public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
	     http
	         .csrf().disable()
	         .cors()
	         .and()
	         .authorizeHttpRequests(auth -> auth
	             .requestMatchers("/api/login","/api/register", "/public/**").permitAll()
	             .requestMatchers("/api/password").authenticated()
	             .anyRequest().authenticated()
	         )
	         .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
	         .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
	         .formLogin().disable();

	     return http.build();
	 }


	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration config = new CorsConfiguration();
		
		config.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
		config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
		config.setAllowedHeaders(Arrays.asList("Authorization", "Cache-Control", "Content-Type"));
		config.setAllowCredentials(true); 
		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", config);
		return source;
	}
}
