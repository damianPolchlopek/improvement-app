package com.improvement_app.security.controllers;

import com.improvement_app.security.config.SecurityProperties;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.Arrays;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class AuthCookieManager {

    public static final String ACCESS_COOKIE = "access_token";
    public static final String REFRESH_COOKIE = "refresh_token";
    public static final String REFRESH_COOKIE_PATH = "/api/auth/refresh-token";

    private final SecurityProperties securityProperties;

    public void addAccessCookie(HttpServletResponse response, String token) {
        ResponseCookie cookie = ResponseCookie.from(ACCESS_COOKIE, token)
                .httpOnly(true)
                .secure(securityProperties.getCookie().isSecure())
                .path("/")
                .maxAge(Duration.ofMillis(securityProperties.getJwt().getAccessTokenExpirationMs()))
                .sameSite(securityProperties.getCookie().getSameSite())
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    public void addRefreshCookie(HttpServletResponse response, String token) {
        ResponseCookie cookie = ResponseCookie.from(REFRESH_COOKIE, token)
                .httpOnly(true)
                .secure(securityProperties.getCookie().isSecure())
                .path(REFRESH_COOKIE_PATH)
                .maxAge(Duration.ofMillis(securityProperties.getJwt().getRefreshTokenExpirationMs()))
                .sameSite(securityProperties.getCookie().getSameSite())
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    public void clearCookies(HttpServletResponse response) {
        clearCookie(response, ACCESS_COOKIE, "/");
        clearCookie(response, REFRESH_COOKIE, REFRESH_COOKIE_PATH);
    }

    public Optional<String> extractCookie(HttpServletRequest request, String name) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null) return Optional.empty();
        return Arrays.stream(cookies)
                .filter(c -> name.equals(c.getName()))
                .map(Cookie::getValue)
                .findFirst();
    }

    private void clearCookie(HttpServletResponse response, String name, String path) {
        ResponseCookie cookie = ResponseCookie.from(name, "")
                .httpOnly(true)
                .secure(securityProperties.getCookie().isSecure())
                .path(path)
                .maxAge(0)
                .sameSite(securityProperties.getCookie().getSameSite())
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }
}
