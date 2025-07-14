package com.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.entities.Roles;

public interface rolesRepo extends JpaRepository<Roles, Integer> {

}
