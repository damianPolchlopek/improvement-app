package com.improvement_app.security.controllers;

import com.improvement_app.security.command.request.LoginRequest;
import com.improvement_app.security.command.request.SignupRequest;
import com.improvement_app.security.command.response.JwtResponse;
import com.improvement_app.security.command.response.MessageResponse;
import com.improvement_app.security.services.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

	private final AuthService authService;

	@PostMapping("/signin")
	public ResponseEntity<JwtResponse> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
		JwtResponse jwtResponse = authService.authenticateUser(loginRequest);
		return ResponseEntity.ok(jwtResponse);
	}

	@PostMapping("/signup")
	public ResponseEntity<MessageResponse> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
		authService.registerUser(signUpRequest);
		return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
	}
}