package com.repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;


import com.entities.Users;

public interface UserRepo extends JpaRepository<Users, String> {
	Optional<Users> findByEmpid(String empid);

}
