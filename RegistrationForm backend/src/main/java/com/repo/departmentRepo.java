package com.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.entities.Department;


@Repository
public interface departmentRepo extends JpaRepository<Department, String> {
	List<Department> findByWing_Code(String wingCode);
	
	//Masters
	Optional<Department> findByName(String name);
	
	// DepartmentRepository.java
	Optional<Department> findByCode(String code);


}
