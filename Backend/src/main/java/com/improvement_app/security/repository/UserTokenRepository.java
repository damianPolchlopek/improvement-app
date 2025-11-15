package com.improvement_app.security.repository;

import com.improvement_app.security.entity.TokenTypeEnum;
import com.improvement_app.security.entity.UserTokenEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserTokenRepository extends JpaRepository<UserTokenEntity, Long> {


    Optional<UserTokenEntity> findByTokenAndType(String tokenValue, TokenTypeEnum expectedType);
}
