package com.improvementApp.Security.models;

import lombok.Generated;
import org.springframework.data.annotation.Id;

//@Entity
//@Table(name = "roles")
public class Role {
	@Id
	@Generated
	private Integer id;

//	@Enumerated(EnumType.STRING)
//	@Column(length = 20)
	private ERole name;

	public Role() {

	}

	public Role(ERole name) {
		this.name = name;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public ERole getName() {
		return name;
	}

	public void setName(ERole name) {
		this.name = name;
	}

	@Override
	public String toString() {
		return "Role{" +
				"id=" + id +
				", name=" + name +
				'}';
	}
}