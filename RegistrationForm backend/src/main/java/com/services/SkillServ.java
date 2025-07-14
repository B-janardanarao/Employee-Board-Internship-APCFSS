package com.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.entities.Skill;
import com.repo.SkillRepository;

@Service
public class SkillServ {

	@Autowired
	private SkillRepository skillRepository;
	 public List<Skill> getAllSkills() {
	        return skillRepository.findAll();
	    }
}
