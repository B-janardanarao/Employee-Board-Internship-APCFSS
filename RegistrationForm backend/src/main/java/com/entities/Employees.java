package com.entities;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@ConditionalExperienceValidation
@Entity
public class Employees {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
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

	
	@Lob
	@Column(columnDefinition = "TEXT")
	@NotBlank(message = "Photo is required")
	private String photo;

	
	private String totalExp;

	@ElementCollection
	@CollectionTable(name = "employee_skills", joinColumns = @JoinColumn(name = "employee_id"))
	@Column(name = "skill")
	@Size(min = 1, message = "At least one skill must be selected")
	private List<@NotBlank String> skills;

//	@NotBlank(message = "Wing is required")
//	private String wing;
//
//	@NotBlank(message = "Department is required")
//	private String department;
	
	
	@ManyToOne
    @JoinColumn(name = "master_id", nullable = false) // Foreign key to Masters table
    private Masters masters;
	
	

	public Masters getMasters() {
		return masters;
	}

	public void setMasters(Masters masters) {
		this.masters = masters;
	}

	
	
	@NotBlank(message = "Address is required")
	private String address;

	@OneToMany(mappedBy = "employee", cascade = CascadeType.ALL, orphanRemoval = true)
	@JsonManagedReference
	@Valid
	private List<Experience> experiences;

	@OneToOne(cascade = CascadeType.ALL)
	@JoinColumn(name = "empid", referencedColumnName = "empid")
	@JsonIgnore
	private Users user;
	

	public Users getUser() {
		return user;
	}

	public void setUser(Users user) {
		this.user = user;
	}

	public String getPhoto() {
		return photo;
	}

	public void setPhoto(String photo) {
		this.photo = photo;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
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

	public List<String> getSkills() {
		return skills;
	}

	public void setSkills(List<String> skills) {
		this.skills = skills;
	}

	

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public List<Experience> getExperiences() {
		return experiences;
	}

	public void setExperiences(List<Experience> experiences) {
		this.experiences = experiences;
	}

	public String getTotalExp() {
		return totalExp;
	}

	public void setTotalExp(String totalExp) {
		this.totalExp = totalExp;
	}

}
