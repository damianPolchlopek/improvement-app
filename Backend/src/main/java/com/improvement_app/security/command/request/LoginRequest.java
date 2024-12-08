package com.improvement_app.security.command.request;

import lombok.Data;

import jakarta.validation.constraints.NotBlank;

@Data
public class LoginRequest {
	@NotBlank
	private String username;

	@NotBlank
	private String password;

	@Override
	public String toString() {
		return "LoginRequest{" +
				"username='" + username + '\'' +
				", password='" + password + '\'' +
				'}';
	}
}
