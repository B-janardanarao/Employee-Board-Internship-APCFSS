package com.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.entities.Wing;
import com.repo.wingRepo;

@Service
public class wingService {

	@Autowired
	private wingRepo wingrepo;
	
	public List<Wing> getallWings(){
		return wingrepo.findAll();
	}
}
