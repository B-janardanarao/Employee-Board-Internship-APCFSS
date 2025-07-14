package com.controller;

import java.io.IOException;
import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtFilter extends OncePerRequestFilter {

	@Autowired
	private JwtUtil jwtUtil;
	
	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
	        throws ServletException, IOException {

	    String authHeader = request.getHeader("Authorization");
	    String token = null;
	    String empId = null;

	   
	    if (authHeader != null && authHeader.startsWith("Bearer ")) {
	        token = authHeader.substring(7);

	        try {
	            empId = jwtUtil.extractUserId(token);
	        } catch (Exception e) {
	            logger.error("Invalid JWT token", e);
	        }
	    }

	    if (token != null && empId != null && SecurityContextHolder.getContext().getAuthentication() == null) {
	        if (jwtUtil.validateToken(token)) {
	            UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
	                    empId, null, new ArrayList<>());
	            authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
	            SecurityContextHolder.getContext().setAuthentication(authToken);
	        }
	    }

	    filterChain.doFilter(request, response);
	}


}
