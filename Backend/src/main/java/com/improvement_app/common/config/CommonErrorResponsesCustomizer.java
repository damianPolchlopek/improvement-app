package com.improvement_app.common.config;

import io.swagger.v3.oas.models.Operation;
import io.swagger.v3.oas.models.responses.ApiResponse;
import io.swagger.v3.oas.models.responses.ApiResponses;
import org.springdoc.core.customizers.OperationCustomizer;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;

/**
 * Dopisuje standardowe kody błędów (400/401) do każdej operacji w Swaggerze,
 * o ile dana metoda nie zadeklarowała ich sama przez @ApiResponses.
 * Unika powtarzania tego samego bloku w każdym kontrolerze.
 */
@Component
public class CommonErrorResponsesCustomizer implements OperationCustomizer {

    @Override
    public Operation customize(Operation operation, HandlerMethod handlerMethod) {
        ApiResponses responses = operation.getResponses();

        if (!responses.containsKey("400")) {
            responses.addApiResponse("400", new ApiResponse().description("Nieprawidłowe dane wejściowe"));
        }
        if (!responses.containsKey("401")) {
            responses.addApiResponse("401", new ApiResponse().description("Brak autoryzacji"));
        }

        return operation;
    }
}
