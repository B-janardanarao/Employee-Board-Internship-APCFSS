package com.repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.entities.Department;
import com.entities.Masters;
import com.entities.Wing;

public interface MastersRepo extends JpaRepository<Masters, Long>{

	Optional<Masters> findByWingAndDepartment(Wing wing, Department department);

}
