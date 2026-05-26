package com.improvement_app.security.oauth2;

import com.improvement_app.security.config.SecurityProperties;
import com.improvement_app.security.controllers.AuthCookieManager;
import com.improvement_app.security.entity.UserEntity;
import com.improvement_app.security.jwt.JwtUtils;
import com.improvement_app.security.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.stream.Collectors;

@Slf4j
@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtUtils jwtUtils;
    private final AuthCookieManager cookieManager;
    private final UserRepository userRepository;
    private final SecurityProperties securityProperties;

    @Value("${app.frontend.url:http://localhost:3000}")
    private String frontendUrl;

    @Override
    @Transactional(readOnly = true)
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");

        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found after OAuth2 login: " + email));

        String accessToken = jwtUtils.generateJwtToken(user.getUsername(), user.getRolesString());
        String refreshToken = jwtUtils.generateRefreshToken(user.getUsername());

        cookieManager.addAccessCookie(response, accessToken);
        cookieManager.addRefreshCookie(response, refreshToken);

        long accessTokenExpiresAt = System.currentTimeMillis() + securityProperties.getJwt().getAccessTokenExpirationMs();
        long refreshTokenExpiresAt = System.currentTimeMillis() + securityProperties.getJwt().getRefreshTokenExpirationMs();
        String roles = user.getRolesString().stream().collect(Collectors.joining(","));

        String redirectUrl = frontendUrl + "/oauth2/callback"
                + "?accessTokenExpiresAt=" + accessTokenExpiresAt
                + "&refreshTokenExpiresAt=" + refreshTokenExpiresAt
                + "&roles=" + roles;

        log.info("OAuth2 login success for user: {}, redirecting to frontend", user.getUsername());
        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }
}
