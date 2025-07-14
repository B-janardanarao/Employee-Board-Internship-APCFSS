package com.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.entities.Department;
import com.repo.departmentRepo;

@Service
public class departmentService {

	@Autowired
	private departmentRepo departmentrepo;
	
	public List<Department> getdepartmentbyWing(String wingCode){
        return departmentrepo.findByWing_Code(wingCode);
    }

	
	
	
}
