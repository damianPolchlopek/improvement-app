package com.improvement_app.security.exceptions;

import com.improvement_app.exceptions.ErrorResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;

@Slf4j
@RestControllerAdvice
@Order(1) // Ensure this handler is processed before others
public class SecurityExceptionHandler {

    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<ErrorResponse> handleUserAlreadyExists(UserAlreadyExistsException e) {
        log.warn("User registration failed: {}", e.getMessage());

        ErrorResponse errorResponse = ErrorResponse.builder()
                .code("USER_ALREADY_EXISTS")
                .message(e.getMessage())
                .timestamp(LocalDateTime.now())
                .details("User with this email or username already exists in the system")
                .build();

        return ResponseEntity.badRequest().body(errorResponse);
    }

    @ExceptionHandler(RoleNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleRoleNotFound(RoleNotFoundException e) {
        log.error("Role configuration error: {}", e.getMessage());

        ErrorResponse errorResponse = ErrorResponse.builder()
                .code("ROLE_NOT_FOUND")
                .message("System configuration error")
                .timestamp(LocalDateTime.now())
                .details("Required role configuration is missing")
                .build();

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }

    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleUserNotFound(UsernameNotFoundException e) {
        log.warn("Authentication failed: {}", e.getMessage());

        ErrorResponse errorResponse = ErrorResponse.builder()
                .code("USER_NOT_FOUND")
                .message("User not found")
                .timestamp(LocalDateTime.now())
                .details("No user found with the provided credentials")
                .build();

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleBadCredentials(BadCredentialsException e) {
        log.warn("Authentication failed: invalid credentials");

        ErrorResponse errorResponse = ErrorResponse.builder()
                .code("INVALID_CREDENTIALS")
                .message("Invalid username or password")
                .timestamp(LocalDateTime.now())
                .details("The provided credentials are incorrect")
                .build();

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
    }

    @ExceptionHandler(EmailNotVerifiedException.class)
    public ResponseEntity<ErrorResponse> handleEmailNotVerified(EmailNotVerifiedException ex) {
        log.warn("Email not verified: {}", ex.getMessage());

        ErrorResponse errorResponse = ErrorResponse.builder()
                .code("EMAIL_NOT_VERIFIED")
                .message("Email must be verified before login. Check your email inbox.")
                .timestamp(LocalDateTime.now())
                .details("Account activation required")
                .build();

        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorResponse);
    }

    @ExceptionHandler(InvalidTokenException.class)
    public ResponseEntity<ErrorResponse> handleInvalidToken(InvalidTokenException ex) {
        log.warn("Invalid token: {}", ex.getMessage());

        ErrorResponse errorResponse = ErrorResponse.builder()
                .code("INVALID_TOKEN")
                .message("Invalid or expired verification token.")
                .timestamp(LocalDateTime.now())
                .details("The provided token is either invalid or has expired")
                .build();

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }

}