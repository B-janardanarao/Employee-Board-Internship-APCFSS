package com.repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.entities.Wing;

@Repository
public interface wingRepo extends JpaRepository<Wing,String> {
	//Masters
	Optional<Wing> findByName(String name);
	
	Optional<Wing> findByCode(String code);

}
