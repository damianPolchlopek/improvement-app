package com.improvement_app.security.controllers;

import com.improvement_app.security.request.ResendVerificationEmailRequest;
import com.improvement_app.security.request.SignupRequest;
import com.improvement_app.security.response.JwtResponse;
import com.improvement_app.security.response.MessageResponse;
import com.improvement_app.security.response.RefreshTokenResponse;
import com.improvement_app.security.request.LoginRequest;
import com.improvement_app.security.services.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final AuthCookieManager cookieManager;

    @PostMapping("/signin")
    public ResponseEntity<JwtResponse> authenticateUser(
            @Valid @RequestBody LoginRequest loginRequest,
            HttpServletResponse response) {

        AuthService.AuthResult result = authService.authenticateUser(loginRequest);

        cookieManager.addAccessCookie(response, result.accessToken());
        cookieManager.addRefreshCookie(response, result.refreshToken());

        return ResponseEntity.ok(result.userInfo());
    }

    @PostMapping("/signup")
    public ResponseEntity<MessageResponse> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        authService.registerUser(signUpRequest);
        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<RefreshTokenResponse> refresh(
            HttpServletRequest request,
            HttpServletResponse response) {

        String rawRefreshToken = cookieManager.extractCookie(request, AuthCookieManager.REFRESH_COOKIE)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Brak refresh tokena"));

        AuthService.RefreshResult result = authService.refreshToken(rawRefreshToken);

        cookieManager.addAccessCookie(response, result.accessToken());

        return ResponseEntity.ok(RefreshTokenResponse.of(result.expiresAt()));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletResponse response) {
        cookieManager.clearCookies(response);
        return ResponseEntity.noContent().build();
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
