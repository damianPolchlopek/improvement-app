package com.improvement_app.common.audit;

import org.springframework.data.domain.AuditorAware;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class AuditAwareImpl implements AuditorAware<String> {

    /**
     * Zwraca opcjonalną (Optional) nazwę użytkownika aktualnie zalogowanego w systemie.
     * Zakłada, że używany jest Spring Security.
     */
    @Override
    public Optional<String> getCurrentAuditor() {
        // 1. Pobieramy obiekt Authentication z kontekstu bezpieczeństwa
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // 2. Sprawdzamy, czy użytkownik jest zalogowany i czy nie jest anonimowy
        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
            // Można zwrócić pusty Optional, jeśli użytkownik jest anonimowy
            return Optional.of("SYSTEM"); // Lub Optional.empty();
        }

        // 3. Zwracamy nazwę użytkownika (Principal)
        // Musisz dostosować rzutowanie (String) do typu, który przechowujesz jako tożsamość użytkownika.
        // Jeśli używasz UserDetails, możesz potrzebować: ( (UserDetails) authentication.getPrincipal() ).getUsername()
        return Optional.of(((UserDetails) authentication.getPrincipal()).getUsername());
    }
}
