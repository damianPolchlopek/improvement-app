package com.improvement_app.security.response;

import lombok.Data;

import java.util.List;

@Data
public class JwtResponse {
	private Long id;
	private String username;
	private String email;
	private final List<String> roles;
	private long accessTokenExpiresAt;
	private long refreshTokenExpiresAt;

	public JwtResponse(Long id, String username, String email, List<String> roles,
					   long accessTokenExpiresAt, long refreshTokenExpiresAt) {
		this.id = id;
		this.username = username;
		this.email = email;
		this.roles = roles;
		this.accessTokenExpiresAt = accessTokenExpiresAt;
		this.refreshTokenExpiresAt = refreshTokenExpiresAt;
	}
}
