package com.improvement_app.common.config;

import io.swagger.v3.oas.models.Operation;
import io.swagger.v3.oas.models.responses.ApiResponse;
import io.swagger.v3.oas.models.responses.ApiResponses;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class CommonErrorResponsesCustomizerTest {

    private final CommonErrorResponsesCustomizer customizer = new CommonErrorResponsesCustomizer();

    @Test
    @DisplayName("Dopisuje 400 i 401, gdy operacja ich nie ma")
    void shouldAddMissingCommonResponses() {
        Operation operation = new Operation().responses(new ApiResponses()
                .addApiResponse("200", new ApiResponse().description("OK")));

        Operation result = customizer.customize(operation, null);

        assertThat(result.getResponses()).containsKeys("200", "400", "401");
    }

    @Test
    @DisplayName("Nie nadpisuje 400, jeśli metoda już je zadeklarowała")
    void shouldNotOverrideExistingResponse() {
        Operation operation = new Operation().responses(new ApiResponses()
                .addApiResponse("400", new ApiResponse().description("Własny opis błędu")));

        Operation result = customizer.customize(operation, null);

        assertThat(result.getResponses().get("400").getDescription()).isEqualTo("Własny opis błędu");
        assertThat(result.getResponses()).containsKey("401");
    }
}
