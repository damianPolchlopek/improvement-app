package com.improvement_app.security.response;

import java.util.List;

public record JwtResponse(
        Long id,
        String username,
        String email,
        List<String> roles,
        long accessTokenExpiresAt,
        long refreshTokenExpiresAt
) {
}
