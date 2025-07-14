package com.entities;

import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.*;


@Entity
@Table(name = "menu_items")

public class MenuItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String label;

    private String path;
    
    private String icon; 
    
    
    

    @Column(name = "order_index")
    private Integer orderIndex;

	
    @ManyToMany(mappedBy = "menuItems")
    @JsonIgnore
    private Set<Roles> roles;
    
    
    


	public String getIcon() {
		return icon;
	}


	public void setIcon(String icon) {
		this.icon = icon;
	}


	public Integer getId() {
		return id;
	}


	public void setId(Integer id) {
		this.id = id;
	}


	public String getLabel() {
		return label;
	}


	public void setLabel(String label) {
		this.label = label;
	}


	public String getPath() {
		return path;
	}


	public void setPath(String path) {
		this.path = path;
	}


	public Integer getOrderIndex() {
		return orderIndex;
	}


	public void setOrderIndex(Integer orderIndex) {
		this.orderIndex = orderIndex;
	}


	public Set<Roles> getRoles() {
		return roles;
	}


	public void setRoles(Set<Roles> roles) {
		this.roles = roles;
	}
    
    
    
    

   

}
