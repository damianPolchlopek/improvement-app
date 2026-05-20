package com.improvement_app.security.repository;

import com.improvement_app.security.entity.TokenTypeEnum;
import com.improvement_app.security.entity.UserEntity;
import com.improvement_app.security.entity.UserTokenEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.Optional;

public interface UserTokenRepository extends JpaRepository<UserTokenEntity, Long> {

    Optional<UserTokenEntity> findByTokenAndType(String tokenValue, TokenTypeEnum expectedType);

    @Query("SELECT COUNT(t) FROM UserTokenEntity t WHERE t.user = :user AND t.type = :type AND t.createdAt > :since")
    long countByUserAndTypeAndCreatedAtAfter(
            @Param("user") UserEntity user,
            @Param("type") TokenTypeEnum type,
            @Param("since") Instant since
    );
}
