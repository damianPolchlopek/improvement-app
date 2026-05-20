package com.improvement_app.security.response;

public record RefreshTokenResponse(long accessTokenExpiresAt) {

    public static RefreshTokenResponse of(long accessTokenExpiresAt) {
        return new RefreshTokenResponse(accessTokenExpiresAt);
    }
}
