package com.registration.Dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class LoginRequest {
	
	@NotBlank
    private String empid;  
     @NotBlank
    private String password; 

    
    public LoginRequest() {}

    public LoginRequest(String empid, String password) {
        this.empid = empid;
        this.password = password;
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
}
