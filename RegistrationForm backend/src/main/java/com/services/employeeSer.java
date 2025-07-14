package com.services;

import java.beans.Transient;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;


import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import com.entities.Department;
import com.entities.Employees;
import com.entities.Experience;
import com.entities.Masters;
import com.entities.Roles;
import com.entities.Users;
import com.entities.Wing;
import com.registration.Dto.EmployeeUserDTO;
import com.registration.Dto.ExperienceDTO;
import com.repo.MastersRepo;
import com.repo.UserRepo;
import com.repo.departmentRepo;
import com.repo.employeerepo;
import com.repo.rolesRepo;
import com.repo.wingRepo;

import jakarta.transaction.Transactional;

@Service
public class employeeSer {
	
	@Autowired
	private employeerepo employeeRepo;
	
	@Autowired
	private UserRepo userrepo;
	
	@Autowired
	private rolesRepo rolesrepo;
	
	@Autowired
	private MastersRepo mastersRepo;
	
	@Autowired
	private wingRepo wingRepo;
	
	@Autowired
	private departmentRepo deptRepo;
	
	
	public employeeSer(employeerepo employeeRepo) {
		this.employeeRepo=employeeRepo;
	}
	@Transactional
	public Employees saveEmployee(EmployeeUserDTO dto) {

	    // Step 1: Create and save Users first
	    Users user = new Users();
	    
	    if (dto.getEmpid() == null || dto.getEmpid().isBlank()) {
	        throw new IllegalArgumentException("Emp ID is required");
	    }
	    
	    
	    user.setEmpid(dto.getEmpid());
	    user.setPassword(dto.getPassword());
	    user.setUsername(dto.getName());
	    
	    
	    if (dto.getRole_id() != null) {
	        Roles role = rolesrepo.findById(dto.getRole_id())
	            .orElseThrow(() -> new IllegalArgumentException("Role not found"));
	        user.getRoles().add(role); 
	        role.getUsers().add(user);
	    }

	    user = userrepo.save(user); // save user first
	    

	    // Step 2: Now create Employees and set the user
	    Employees emp = new Employees();
	    emp.setName(dto.getName());
	    emp.setFatherName(dto.getFatherName());
	    emp.setDateOfBirth(dto.getDateOfBirth());
	    emp.setAge(dto.getAge());
	    emp.setDateOfJoining(dto.getDateOfJoining());
	    emp.setGender(dto.getGender());
	    emp.setSkills(dto.getSkills());
	    emp.setAddress(dto.getAddress());
//	    emp.setDepartment(dto.getDepartment());
//	    emp.setWing(dto.getWing());
	    
	    
	 // 1. Fetch Wing entity by wing name (String)
	    Wing wing = wingRepo.findByCode(dto.getWing())
	        .orElseThrow(() -> new RuntimeException("Wing not found"));

	    // 2. Fetch Department entity by department name (String)
	    Department department = deptRepo.findByCode(dto.getDepartment())
	        .orElseThrow(() -> new RuntimeException("Department not found"));

	    // 3. Fetch Masters entity by Wing and Department entities
	    Masters masters = mastersRepo.findByWingAndDepartment(wing, department)
	        .orElseThrow(() -> new RuntimeException("Invalid wing/department combination"));

	    // 4. Set Masters in Employees entity
	    emp.setMasters(masters);


	    
	    
	    
	    emp.setPhoto(dto.getPhoto());

	    // Ensure totalExp is not null
	    emp.setTotalExp(dto.getTotalExp() == null ? "0" : dto.getTotalExp());

	    emp.setUser(user); // link the user

	    // Step 3: Handle experiences
	    if (dto.getExperiences() != null) {
	        List<Experience> experiences = dto.getExperiences().stream().map(expDto -> {
	            Experience exp = new Experience();
	            exp.setId(expDto.getId());
	            exp.setLocation(expDto.getLocation());
	            exp.setOrgname(expDto.getOrgname());
	            exp.setFromDate(expDto.getFromDate());
	            exp.setToDate(expDto.getToDate());
	            exp.setDuration(expDto.getDuration());
	            exp.setEmployee(emp); // set back-reference
	            return exp;
	        }).collect(Collectors.toList());

	        emp.setExperiences(experiences);
	    }

	    
	    return employeeRepo.save(emp);
	}
	
	
	public List<EmployeeUserDTO> getAllNames() {
	    List<Employees> employees = employeeRepo.findAll();

	    return employees.stream().map(emp -> {
	        EmployeeUserDTO dto = new EmployeeUserDTO();

	        // map employee fields as before...
	        dto.setId(emp.getId());
	        dto.setName(emp.getName());
	        dto.setFatherName(emp.getFatherName());
	        dto.setDateOfBirth(emp.getDateOfBirth());
	        dto.setAge(emp.getAge());
	        dto.setDateOfJoining(emp.getDateOfJoining());
	        dto.setGender(emp.getGender());
	        dto.setPhoto(emp.getPhoto());
	        dto.setTotalExp(emp.getTotalExp());
	        dto.setSkills(emp.getSkills());
//	        dto.setWing(emp.getWing());
//	        dto.setDepartment(emp.getDepartment());
	        
	       
	        
	        dto.setAddress(emp.getAddress());

	        if (emp.getUser() != null) {
	            dto.setEmpid(emp.getUser().getEmpid());
	        }

	        // Map Experiences list to ExperienceDTO list
	        if (emp.getExperiences() != null && !emp.getExperiences().isEmpty()) {
	            List<ExperienceDTO> expDtos = emp.getExperiences().stream()
	                .map(exp -> {
	                    ExperienceDTO expDto = new ExperienceDTO();
	                    expDto.setId(exp.getId());  // if ExperienceDTO has id
	                    expDto.setLocation(exp.getLocation());
	                    expDto.setOrgname(exp.getOrgname());
	                    expDto.setFromDate(exp.getFromDate());
	                    expDto.setToDate(exp.getToDate());
	                    expDto.setDuration(exp.getDuration());
	                    
	                    return expDto;
	                }).collect(Collectors.toList());

	            dto.setExperiences(expDtos);
	        }

	        return dto;
	    }).collect(Collectors.toList());
	}


	
	public Optional<Employees> getEmployeeById(String empid) {
	    return employeeRepo.findByUser_Empid(empid);
	}
	
	public void delete(String empid) {
		userrepo.deleteById(empid);
	}
	
	
	public Optional<Employees> authenticate(Long id, String password) {
	    Optional<Employees> empOpt = employeeRepo.findById(id);

	    if (empOpt.isPresent()) {
	        Employees emp = empOpt.get();

	        
	        String dobStr = emp.getDateOfBirth();  

	        if (dobStr.equals(password)) {
	            return Optional.of(emp);
	        }
	    }
	    return Optional.empty();
	}

	/*
	 * public ResponseEntity<Employees> updateEmployee(String empid, Employees
	 * updated) {
	 * 
	 * Optional<Employees> existing = employeeRepo.findByUser_Empid(empid); if
	 * (existing.isPresent()) { Employees emp = existing.get();
	 * 
	 * emp.setName(updated.getName()); emp.setFatherName(updated.getFatherName());
	 * emp.setDateOfBirth(updated.getDateOfBirth()); emp.setAge(updated.getAge());
	 * emp.setDateOfJoining(updated.getDateOfJoining());
	 * emp.setGender(updated.getGender()); emp.setSkills(updated.getSkills());
	 * 
	 * // emp.setWing(updated.getWing()); //
	 * emp.setDepartment(updated.getDepartment());
	 * 
	 * 
	 * // Handle Masters relationship (wing+department) Wing wing =
	 * wingRepo.findByName(updated.getWing()) .orElseThrow(() -> new
	 * RuntimeException("Wing not found"));
	 * 
	 * Department department = deptRepo.findByName(updated.getDepartment())
	 * .orElseThrow(() -> new RuntimeException("Department not found"));
	 * 
	 * Masters masters = mastersRepo.findByWingAndDepartment(wing, department)
	 * .orElseThrow(() -> new
	 * RuntimeException("Invalid wing/department combination"));
	 * 
	 * emp.setMasters(masters);
	 * 
	 * 
	 * 
	 * emp.setAddress(updated.getAddress());
	 * 
	 * 
	 * emp.setPhoto(updated.getPhoto()); emp.setTotalExp(updated.getTotalExp());
	 * 
	 * if (updated.getUser() != null && updated.getUser().getRoles() != null &&
	 * !updated.getUser().getRoles().isEmpty()) { Users user = emp.getUser();
	 * 
	 * user.getRoles().clear(); // Clear existing roles
	 * 
	 * Roles onlyRole = updated.getUser().getRoles().iterator().next(); // Take
	 * first (and only) role Roles roleEntity =
	 * rolesrepo.findById(onlyRole.getRole_id()) .orElseThrow(() -> new
	 * RuntimeException("Role not found: " + onlyRole.getRole_id()));
	 * 
	 * user.getRoles().add(roleEntity); userrepo.save(user); }
	 * 
	 * 
	 * 
	 * 
	 * 
	 * emp.getExperiences().clear(); // Clear old experiences if
	 * (updated.getExperiences() != null) { for (Experience exp :
	 * updated.getExperiences()) { exp.setEmployee(emp); // Set the back-reference
	 * emp.getExperiences().add(exp); } }
	 * 
	 * 
	 * 
	 * return ResponseEntity.ok(employeeRepo.save(emp)); } else { return
	 * ResponseEntity.notFound().build(); } }
	 * 
	 */
	
	
	public ResponseEntity<Employees> updateEmployee(String empid, EmployeeUserDTO dto) {
	    Employees emp = employeeRepo.findByUser_Empid(empid)
	            .orElseThrow(() -> new RuntimeException("Employee not found"));

	
	    emp.setName(dto.getName());
	    emp.setFatherName(dto.getFatherName());
	    emp.setDateOfBirth(dto.getDateOfBirth());
	    emp.setAge(dto.getAge());
	    emp.setDateOfJoining(dto.getDateOfJoining());
	    emp.setGender(dto.getGender());
	    emp.setSkills(dto.getSkills());
	    emp.setAddress(dto.getAddress());
	    emp.setPhoto(dto.getPhoto());
	    emp.setTotalExp(dto.getTotalExp());

	    
	    Wing wing = wingRepo.findByCode(dto.getWing())
	            .orElseThrow(() -> new RuntimeException("Wing not found"));

	    Department department = deptRepo.findByCode(dto.getDepartment())
	            .orElseThrow(() -> new RuntimeException("Department not found"));

	    
	    Masters masters = mastersRepo.findByWingAndDepartment(wing, department)
	            .orElseThrow(() -> new RuntimeException("Invalid wing/department combination"));

	    emp.setMasters(masters);

	   
	    if (dto.getRole_id() != null) {
	        Users user = emp.getUser();
	        user.getRoles().clear();
	        Roles role = rolesrepo.findById(dto.getRole_id())
	                .orElseThrow(() -> new RuntimeException("Role not found: " + dto.getRole_id()));
	        user.getRoles().add(role);
	        userrepo.save(user);
	    }


	    // Clear existing experiences
	    emp.getExperiences().clear();

	   
	    if (dto.getExperiences() != null && !dto.getExperiences().isEmpty()) {
	        for (ExperienceDTO expDTO : dto.getExperiences()) {
	            Experience exp = new Experience();
	            
	            
	            exp.setOrgname(expDTO.getOrgname());
	            exp.setLocation(expDTO.getLocation());

	           
	            exp.setFromDate(expDTO.getFromDate());
	            exp.setToDate(expDTO.getToDate());

	            exp.setDuration(expDTO.getDuration());
	            
	            
	            exp.setEmployee(emp);
	            emp.getExperiences().add(exp);
	        }
	    }

	    Employees updatedEmp = employeeRepo.save(emp);
	    return ResponseEntity.ok(updatedEmp);
	}

	
	
	
	
	
	

	}
