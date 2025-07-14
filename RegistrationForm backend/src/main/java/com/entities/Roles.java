package com.entities;



import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.*;

@Entity
public class Roles{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer role_id;

    @Column(name = "role_name", nullable = false, unique = true)
    private String role_name;

    
    @ManyToMany(mappedBy = "roles")
    @JsonIgnore
    private Set<Users> users = new HashSet<>();
  
    @ManyToMany
    @JoinTable(
        name = "role_menu_items",
        joinColumns = @JoinColumn(name = "role_id"),
        inverseJoinColumns = @JoinColumn(name = "menu_item_id")
    )
    @JsonManagedReference
    private Set<MenuItem> menuItems = new HashSet<>();

    
   
    public Set<MenuItem> getMenuItems() {
		return menuItems;
	}

	public void setMenuItems(Set<MenuItem> menuItems) {
		this.menuItems = menuItems;
	}

	public Set<Users> getUsers() {
		return users;
	}

	public void setUsers(Set<Users> users) {
		this.users = users;
	}

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

}
