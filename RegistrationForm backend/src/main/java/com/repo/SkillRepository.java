package com.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.entities.Skill;

@Repository
public interface SkillRepository extends JpaRepository<Skill, Long> {
	
}
