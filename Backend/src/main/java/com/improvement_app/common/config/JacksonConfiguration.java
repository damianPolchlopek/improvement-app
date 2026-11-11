package com.improvement_app.common.config;

import com.fasterxml.jackson.annotation.JsonInclude;
import org.springframework.boot.jackson.autoconfigure.JsonMapperBuilderCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import tools.jackson.databind.DeserializationFeature;
import tools.jackson.databind.MapperFeature;
import tools.jackson.databind.cfg.DateTimeFeature;

/**
 * Ustawienia Jacksona 3 (Spring Boot 4). Dostosowujemy builder Boota zamiast tworzyć własny
 * JsonMapper, żeby zachować jego domyślną konfigurację i żeby Spring MVC używał tych ustawień.
 * java.time i nazwy parametrów (rekordy) są w Jacksonie 3 wbudowane — nie trzeba modułów.
 */
@Configuration
public class JacksonConfiguration {

    /**
     * Ustawienia oznaczone „(domyślne)” Jackson 3 ma już tak ustawione. Zostają jawnie, bo aplikacja
     * na nich polega, a zmiana domyślnych wartości w przyszłej wersji nie powinna przejść niezauważona.
     */
    @Bean
    public JsonMapperBuilderCustomizer jsonMapperCustomizer() {
        return builder -> builder
                // Wielkość liter w enumach nie ma znaczenia: "breakfast" i "BREAKFAST" dają ten sam MealType
                .enable(MapperFeature.ACCEPT_CASE_INSENSITIVE_ENUMS)
                // (domyślne) Przy @JsonView pola bez widoku nie trafiają do JSON-a — nic nie wycieknie przypadkiem
                .disable(MapperFeature.DEFAULT_VIEW_INCLUSION)
                // (domyślne) Daty jako tekst ISO, np. "2026-11-11", a nie [2026,11,11] ani liczba;
                // dashboard na froncie parsuje właśnie takie daty
                .disable(DateTimeFeature.WRITE_DATES_AS_TIMESTAMPS)
                // (domyślne) Nadmiarowe pola w żądaniu są ignorowane, zamiast kończyć się błędem
                .disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
                // Brakujące pole prymitywne dostaje wartość domyślną (boolean → false, int → 0), jak w Jacksonie 2;
                // Jackson 3 domyślnie je odrzuca — np. daily bez "health" kończyłoby się błędem
                .disable(DeserializationFeature.FAIL_ON_NULL_FOR_PRIMITIVES)
                // Pola null i puste Optional nie trafiają do odpowiedzi, np. dashboard bez treningów
                // nie wysyła "lastTraining": null, tylko pomija to pole
                .changeDefaultPropertyInclusion(inclusion ->
                        inclusion.withValueInclusion(JsonInclude.Include.NON_ABSENT));
    }

}
