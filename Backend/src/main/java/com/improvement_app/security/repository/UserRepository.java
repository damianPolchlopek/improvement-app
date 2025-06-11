package com.improvement_app.security.repository;

import com.improvement_app.security.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {
	Optional<UserEntity> findByUsername(String username);

	Optional<UserEntity> findByEmail(String email);

	Boolean existsByUsername(String username);

	Boolean existsByEmail(String email);

	// Nowe metody dla weryfikacji emaila
	Optional<UserEntity> findByUsernameAndEmailVerifiedFalse(String email);

	Optional<UserEntity> findByEmailVerificationTokenAndEmailVerificationExpiresAfterAndEmailVerifiedFalse(
			String token, LocalDateTime now);
}
