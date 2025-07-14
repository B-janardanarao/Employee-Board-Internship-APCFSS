package com.repo;

import com.entities.Employees;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;


public interface employeerepo extends JpaRepository<Employees, Long> {
//	List<Employees> findByWingIgnoreCase(String wing);
	Optional<Employees> findByUser_Empid(String empid);
	
	//Mater
	List<Employees> findByMasters_Wing_NameIgnoreCase(String wingName);


	
}
