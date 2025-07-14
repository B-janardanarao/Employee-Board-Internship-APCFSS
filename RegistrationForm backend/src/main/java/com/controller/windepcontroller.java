package com.controller;

import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.entities.Department;
import com.entities.Employees;
import com.entities.Experience;
import com.entities.MenuItem;
import com.entities.Roles;
import com.entities.Skill;
import com.entities.Users;
import com.entities.Wing;
import com.registration.Dto.EmployeeUserDTO;
import com.registration.Dto.ExperienceDTO;
import com.registration.Dto.LoginRequest;

import com.repo.UserRepo;
import com.repo.employeerepo;
import com.repo.rolesRepo;
import com.services.SkillServ;
import com.services.departmentService;
import com.services.employeeSer;
import com.services.wingService;


import jakarta.validation.Valid;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api")
public class windepcontroller {

	@Autowired
	private departmentService departmentservice;

	@Autowired
	private wingService wingservice;

	@Autowired
	private employeeSer employeeser;
	
	@Autowired
	private employeerepo employeeRepo;

	@Autowired
	private SkillServ skillServ;
	
	@Autowired
	private rolesRepo rolerepo;

	@Autowired
	private UserRepo userrepo;
	
	@Autowired
	private employeerepo emprepo;

	@Autowired
	private JwtUtil jwtUtil;
	
	@Autowired
	private PasswordEncoder passwordEncoder;

	@GetMapping("/wings")
	public List<Wing> getAllwings() {
		return wingservice.getallWings();
	}
	
	

	@GetMapping("/departments")
	public List<Department> getdepbyWing(@RequestParam String wing) {
		return departmentservice.getdepartmentbyWing(wing);
	}
	
	
	@GetMapping("/roleBased-Sidebars/{empId}")
	public List<MenuItem> getMenusByUser(@PathVariable String empId) {
	    Users user = userrepo.findByEmpid(empId)
	            .orElseThrow(() -> new RuntimeException("User not found"));

	   
	    user.getRoles().forEach(role -> {
	        role.getMenuItems().forEach(menu -> {
	            System.out.println(" - " + menu.getLabel() + " (" + menu.getPath() + ")");
	        });
	    });
	    
	  
	    Set<MenuItem> menuItems = user.getRoles().stream()
	            .flatMap(role -> role.getMenuItems().stream())
	            .collect(Collectors.toSet()); 

	   
	    List<MenuItem> sortedMenuItems = menuItems.stream()
	            .sorted(Comparator.comparing(menu -> menu.getOrderIndex()))
	            .collect(Collectors.toList());

	    return sortedMenuItems;
	}





	
	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody LoginRequest login) {
	    if (login.getEmpid() == null || login.getEmpid().isBlank()) {
	        return ResponseEntity.badRequest().body("Employee ID must not be blank");
	    }

	    Optional<Users> userOpt = userrepo.findById(login.getEmpid());

	    if (userOpt.isPresent()) {
	        Users user = userOpt.get();
	        Employees emp = user.getEmployees();

	        
	        if (user.getPassword() == null || user.getPassword().isEmpty()) {
	            if (emp != null && emp.getDateOfBirth().equals(login.getPassword())) {
	                return buildLoginResponse(user);
	            }
	        } else {
	        	 String rawPassword = login.getPassword();
	             String storedHashedPassword = user.getPassword();

	             boolean match = passwordEncoder.matches(rawPassword, storedHashedPassword);
	             System.out.println("Match result: " + match);

	             if (match) {
	                 return buildLoginResponse(user);
	             }	        }
	    }

	    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid ID or Password");
	}



	private ResponseEntity<?> buildLoginResponse(Users user) {
	    Employees emp = user.getEmployees();

	  //  String token = jwtUtil.generateToken(user.getEmpid()); 
	    
	    //rolebased also
	    String roleName = user.getRoles().stream()
                .findFirst()
                .map(Roles::getRole_name)
                .orElse("User");

String token = jwtUtil.generateToken(user.getEmpid(), Map.of("role", roleName));




	    Map<String, Object> response = new HashMap<>();
	    response.put("token", token);
	    response.put("empid", user.getEmpid());
	    response.put("username", user.getUsername());
	    
	    if (emp != null) {
	        response.put("id", emp.getId());
//	        response.put("wingName", emp.getWing());
	        
	        response.put("wingName", emp.getMasters().getWing().getName());
	        
	        response.put("name", emp.getName());
	        
//	        response.put("department", emp.getDepartment());
	        
	        response.put("department", emp.getMasters().getDepartment().getName());
	        
	        Set<Roles> roles = user.getRoles();
	        if (roles != null && !roles.isEmpty()) {
	            // only one role expected:
	            Roles firstRole = roles.iterator().next();
	            response.put("roleName", firstRole.getRole_name());
	            response.put("roleId", firstRole.getRole_id());
	           
	                System.out.println("Role ID: " + firstRole.getRole_id());
	                System.out.println("Role Name: " + firstRole.getRole_name());
	           
	            
	        }
	        
	       
	    }

	    return ResponseEntity.ok(response);
	}




	
	

	@PostMapping("/register")
	
		public ResponseEntity<?> save(@Valid @RequestBody  EmployeeUserDTO dto, BindingResult result) {

		if (result.hasErrors()) {

			List<String> errors = result.getAllErrors().stream().map(error -> error.getDefaultMessage()).toList();
			return ResponseEntity.badRequest().body(errors);

		}
 
        Employees savedEmployee = employeeser.saveEmployee(dto);

       
        return ResponseEntity.ok(savedEmployee);

	}

	

	/*
	 * @PostMapping("/register") public Employees save( @RequestBody Employees emp)
	 * { return employeeser.saveEmployee(emp); }
	 */
	@PutMapping("/update/{empid}")
	public ResponseEntity<Employees> updateEmployee(@PathVariable String empid, @RequestBody EmployeeUserDTO updated) {
		return employeeser.updateEmployee(empid, updated);
	}

	@GetMapping("/register/{empid}") // get all details for editing
	public ResponseEntity<EmployeeUserDTO> getEmployeeId(@PathVariable String empid) {
		Optional<Employees> empOpt = employeeser.getEmployeeById(empid);
		if (empOpt.isPresent()) {
			Employees emp = empOpt.get();
	        Users user = emp.getUser(); // Assuming @OneToOne relation is set

	        
			
	        EmployeeUserDTO dto = new EmployeeUserDTO();
	        dto.setId(emp.getId());
	        dto.setEmpid(user.getEmpid());
	        dto.setName(emp.getName());
	        dto.setFatherName(emp.getFatherName());
	        dto.setDateOfBirth(emp.getDateOfBirth().toString());
	        dto.setAge(emp.getAge());
	        dto.setDateOfJoining(emp.getDateOfJoining().toString());
	        dto.setGender(emp.getGender());
	       dto.setPhoto(emp.getPhoto());
	        dto.setTotalExp(emp.getTotalExp());
	       
			
	        dto.setRole_name(user.getRoles().stream()
	                  .findFirst()
	                  .map(Roles::getRole_name)
	                  .orElse("N/A"));
	        
	        dto.setRole_id(user.getRoles().stream()
	                  .findFirst()
	                  .map(Roles::getRole_id)
	                  .orElse(null)); 

	        
	        dto.setSkills(emp.getSkills());
//	        dto.setWing(emp.getWing());
//	        dto.setDepartment(emp.getDepartment());
	        
	        //Masters
	        dto.setWing(emp.getMasters().getWing().getCode());       
	        dto.setDepartment(emp.getMasters().getDepartment().getCode());

	       
	        
	        dto.setAddress(emp.getAddress());

	       
	        List<ExperienceDTO> expDTOs = emp.getExperiences().stream().map(exp -> {
	            ExperienceDTO edto = new ExperienceDTO();
	            edto.setId(exp.getId());
	            edto.setLocation(exp.getLocation());
	            edto.setOrgname(exp.getOrgname());
	            edto.setFromDate(exp.getFromDate().toString());
	            edto.setToDate(exp.getToDate().toString());
	            edto.setDuration(exp.getDuration());
	            return edto;
	        }).toList();

	        dto.setExperiences(expDTOs);

	        return ResponseEntity.ok(dto);
		} else {
			return ResponseEntity.notFound().build();
		}
		
		
	}

	/*
	 * @PostMapping("/login") public ResponseEntity<?> login(@Valid @RequestBody
	 * LoginRequest request) { Long id = request.getId(); String password =
	 * request.getPassword();
	 * 
	 * Optional<Employees> empOpt = employeeser.authenticate(id, password);
	 * 
	 * if (empOpt.isPresent()) { return ResponseEntity.ok(empOpt.get()); } else {
	 * return
	 * ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials"); }
	 * 
	 * }
	 */

	@GetMapping("/names")
	public List<EmployeeUserDTO> names() {
		return employeeser.getAllNames();
	}

	@GetMapping("/details/{empid}")
	public ResponseEntity<EmployeeUserDTO> getEmployeeById(@PathVariable String empid) {
	    Optional<Employees> empOpt = employeeser.getEmployeeById(empid);
	    
	    if (empOpt.isPresent()) {
	        Employees emp = empOpt.get();
	        Users user = emp.getUser(); // Assuming @OneToOne relation is set

	        EmployeeUserDTO dto = new EmployeeUserDTO();
	        dto.setId(emp.getId());
	        dto.setEmpid(user.getEmpid());
	        dto.setName(emp.getName());
	        dto.setFatherName(emp.getFatherName());
	        dto.setDateOfBirth(emp.getDateOfBirth().toString());
	        dto.setAge(emp.getAge());
	        dto.setDateOfJoining(emp.getDateOfJoining().toString());
	        dto.setGender(emp.getGender());
	        dto.setPhoto(emp.getPhoto());
	        dto.setTotalExp(emp.getTotalExp());
	        dto.setSkills(emp.getSkills());
	        
//        dto.setWing(emp.getWing());
//        dto.setDepartment(emp.getDepartment());
//	      Masters
	        
	        dto.setWing(emp.getMasters().getWing().getName());
	        dto.setDepartment(emp.getMasters().getDepartment().getName());

	       
	        
	        dto.setAddress(emp.getAddress());

	        dto.setRole_name(user.getRoles().stream().findFirst().map(Roles::getRole_name).orElse(null));
	        
	        dto.setRole_id(user.getRoles().stream().findFirst().map(Roles::getRole_id).orElse(null));
	        
	      
	        
	  
	       
	        List<ExperienceDTO> expDTOs = emp.getExperiences().stream().map(exp -> {
	            ExperienceDTO edto = new ExperienceDTO();
	            edto.setId(exp.getId());
	            edto.setLocation(exp.getLocation());
	            edto.setOrgname(exp.getOrgname());
	            edto.setFromDate(exp.getFromDate().toString());
	            edto.setToDate(exp.getToDate().toString());
	            edto.setDuration(exp.getDuration());
	            return edto;
	        }).toList();

	        dto.setExperiences(expDTOs);

	        return ResponseEntity.ok(dto);
	    } else {
	        return ResponseEntity.notFound().build();
	    }
	}

	
	
	
	@PutMapping("/password")
	public ResponseEntity<?> updatePassword(@RequestBody Map<String, String> payload) {
	    try {
	        String empid = payload.get("empid");
	        String newPassword = payload.get("password");
	        
	        
	        System.out.println("Received empid: " + payload.get("empid"));
	        System.out.println("Received password: " + payload.get("password"));


	        if (empid == null || newPassword == null || newPassword.isBlank()) {
	            return ResponseEntity.badRequest().body("empid and password are required");
	        }

	        Optional<Users> userOpt = userrepo.findById(empid);
	        if (userOpt.isEmpty()) {
	            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
	        }

	        Users user = userOpt.get();
	        user.setPassword(passwordEncoder.encode(newPassword));
	        userrepo.save(user);

	        return ResponseEntity.ok("Password updated successfully");
	    } catch (Exception e) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                             .body("Something went wrong: " + e.getMessage());
	    }
	}




//	@GetMapping("/wing/{wing}")
//	@Transactional(readOnly = true)  //lob use so use it
//	public List<Employees> getByWing(@PathVariable String wing) {
////	    return employeeRepo.findByWingIgnoreCase(wing);
//		
////		return employeeRepo.findByWingIgnoreCase(wing);
//		
//		//Masters
//		return employeeRepo.findByMasters_Wing_NameIgnoreCase(wing);
//		
//	}	

	@GetMapping("/wing/{wing}")
	@Transactional(readOnly = true)
	public List<EmployeeUserDTO> getByWing(@PathVariable String wing) {
	    List<Employees> employees = employeeRepo.findByMasters_Wing_NameIgnoreCase(wing);
	    return employees.stream()
	                    .map(this::mapToDTO)
	                    .collect(Collectors.toList());
	}

	private EmployeeUserDTO mapToDTO(Employees emp) {
	    EmployeeUserDTO dto = new EmployeeUserDTO();
	    dto.setEmpid(emp.getUser().getEmpid()); 
	    dto.setName(emp.getName());
	    
	    return dto;
	}

	

	

	@GetMapping("/skills")
	public List<Skill> getAllSkills() {
		return skillServ.getAllSkills();
	}

	@DeleteMapping("/delete/{empid}")
	public void delete(@PathVariable String empid) {
		employeeser.delete(empid);
	}
	
	@GetMapping("/roles")
	public List<EmployeeUserDTO> getAllRoles() {
	    return rolerepo.findAll()
	        .stream()
	        .map(role -> {EmployeeUserDTO dto = new EmployeeUserDTO();
            dto.setRole_id(role.getRole_id());
            dto.setRole_name(role.getRole_name());
            return dto;
	})
	.collect(Collectors.toList());

	}
}
