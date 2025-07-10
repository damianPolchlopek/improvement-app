package com.improvement_app.security.controllers;

import com.improvement_app.security.request.LoginRequest;
import com.improvement_app.security.request.RefreshTokenRequest;
import com.improvement_app.security.request.ResendVerificationEmailRequest;
import com.improvement_app.security.request.SignupRequest;
import com.improvement_app.security.response.JwtResponse;
import com.improvement_app.security.response.MessageResponse;
import com.improvement_app.security.response.RefreshTokenResponse;
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

	@PostMapping("/refresh-token")
	public ResponseEntity<RefreshTokenResponse> refresh(@RequestBody RefreshTokenRequest refreshTokenRequest) {
		RefreshTokenResponse refreshTokenResponse = authService.refreshToken(refreshTokenRequest);
		return ResponseEntity.ok(refreshTokenResponse);
	}

	@GetMapping("/verify-email")
	public ResponseEntity<MessageResponse> verifyEmail(@RequestParam String token) {
		String result = authService.verifyEmail(token);
		return ResponseEntity.ok(new MessageResponse(result));
	}

	@PostMapping("/resend-verification")
	public ResponseEntity<String> resendVerification(@RequestBody ResendVerificationEmailRequest request) {
		try {
			authService.resendVerificationEmail(request.getUsername());
			return ResponseEntity.ok("Email weryfikacyjny został wysłany ponownie.");
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}

}