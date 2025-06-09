package com.improvement_app.security.repository;

import com.improvement_app.security.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
	Optional<User> findByUsername(String username);

	Optional<User> findByEmail(String email);

	Boolean existsByUsername(String username);

	Boolean existsByEmail(String email);

	// Nowe metody dla weryfikacji emaila
	Optional<User> findByUsernameAndEmailVerifiedFalse(String email);

	Optional<User> findByEmailVerificationTokenAndEmailVerificationExpiresAfterAndEmailVerifiedFalse(
			String token, LocalDateTime now);
}
