package com.improvement_app.security.response;

public record RefreshTokenResponse(String accessToken) {

    public static RefreshTokenResponse of(String accessToken) {
        return new RefreshTokenResponse(accessToken);
    }
}
