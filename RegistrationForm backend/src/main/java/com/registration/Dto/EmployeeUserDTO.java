package com.registration.Dto;


import java.util.List;

import com.entities.Experience;
import com.entities.Masters;
import com.entities.Users;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;

public class EmployeeUserDTO {

   
    private Long id;

    @NotBlank(message = "Name is required")
    @Size(min = 3, max = 22, message = "Name must be between 3 and 22 characters")
    private String name;

    @NotBlank(message = "FatherName is required")
    @Size(min = 3, max = 22, message = "FatherName must be between 3 and 22 characters")
    private String fatherName;

    @NotBlank
    @Pattern(regexp = "^\\d{2}-\\d{2}-\\d{4}$", message = "Date of Birth must be in the format dd-MM-yyyy")
    private String dateOfBirth;

    @Min(value = 18, message = "Minimum age must be 18")
    @Max(value = 50, message = "Maximum age must be 50")
    private int age;

    @NotBlank(message = "Date of Joining is required")
    @Pattern(regexp = "^\\d{2}-\\d{2}-\\d{4}$", message = "Date of Joining must be in the format dd-MM-yyyy")
    private String dateOfJoining;

    @NotBlank(message = "Gender is required")
    private String gender;

    @NotBlank(message = "Photo is required")
    private String photo;

   
    private String totalExp;

    @Size(min = 1, message = "At least one skill must be selected")
    private List<@NotBlank String> skills;

   
    private String wing;

   
    private String department;

    @NotBlank(message = "Address is required")
    private String address;
    
    @Valid
    private List<ExperienceDTO> experiences;
    
   
    
    
    

   
    //user fields


	

	private String empid;

    private String password;
    
    



   	
   	
    
    
    
   // role fieds
   
private  Integer role_id;
    
    private String role_name;
   




	public Integer getRole_id() {
		return role_id;
	}




	public void setRole_id(Integer role_id) {
		this.role_id = role_id;
	}




	public String getRole_name() {
		return role_name;
	}




	public void setRole_name(String role_name) {
		this.role_name = role_name;
	}
	
	
	
	


	public String getEmpid() {
		return empid;
	}




	public void setEmpid(String empid) {
		this.empid = empid;
	}




	public String getPassword() {
		return password;
	}




	public void setPassword(String password) {
		this.password = password;
	}




	public Long getId() {
		return id;
	}




	public void setId(Long id) {
        this.id = id;
    }

    
    

    public List<ExperienceDTO> getExperiences() {
		return experiences;
	}

	public void setExperiences(List<ExperienceDTO> experiences) {
		this.experiences = experiences;
	}

	public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getFatherName() {
        return fatherName;
    }

    public void setFatherName(String fatherName) {
        this.fatherName = fatherName;
    }

    public String getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(String dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getDateOfJoining() {
        return dateOfJoining;
    }

    public void setDateOfJoining(String dateOfJoining) {
        this.dateOfJoining = dateOfJoining;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getPhoto() {
        return photo;
    }

    public void setPhoto(String photo) {
        this.photo = photo;
    }

    public String getTotalExp() {
        return totalExp;
    }

    public void setTotalExp(String totalExp) {
        this.totalExp = totalExp;
    }

    public List<String> getSkills() {
        return skills;
    }

    public void setSkills(List<String> skills) {
        this.skills = skills;
    }

    public String getWing() {
        return wing;
    }

    public void setWing(String wing) {
        this.wing = wing;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

  
    
}
