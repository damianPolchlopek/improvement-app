package com.improvement_app.food.ui;

import com.improvement_app.exceptions.ErrorResponse;
import com.improvement_app.food.application.ports.in.ProductManagementUseCase;
import com.improvement_app.food.domain.enums.ProductCategory;
import com.improvement_app.food.ui.response.GetProductResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/food")
@Tag(name = "Products", description = "API do zarządzania produktami spożywczymi")
@Validated
public class ProductController {

    private final ProductManagementUseCase productManagementUseCase;

    @GetMapping("/product")
    @Operation(
            summary = "Pobierz listę produktów",
            description = "Zwraca listę produktów spożywczych na podstawie kategorii i nazwy"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Lista produktów została pomyślnie pobrana",
                    content = @Content(
                            mediaType = "application/json",
                            array = @ArraySchema(schema = @Schema(implementation = GetProductResponse.class))
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Nieprawidłowe parametry wyszukiwania",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Nie znaleziono produktów spełniających kryteria",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class)
                    )
            )
    })
    public ResponseEntity<List<GetProductResponse>> getProductsRequest(
            @Parameter(
                    description = "Kategoria produktu",
                    required = true,
                    example = "VEGETABLES",
                    schema = @Schema(allowableValues = {"MEAT", "DAIRY", "CARBS", "FAT", "FRUIT_VEGETABLES", "SPICES", "SWEETS", "OTHER", "ALL"})
            )
            @RequestParam
            @NotBlank(message = "Kategoria produktu nie może być pusta")
            String productCategory,

            @Parameter(
                    description = "Nazwa produktu (może być częściowa)",
                    example = "pomidor"
            )
            @RequestParam
            String productName)
    {
        ProductCategory productCategoryEnum = ProductCategory.fromValue(productCategory);
        List<GetProductResponse> products = productManagementUseCase.getProducts(productCategoryEnum, productName)
                .stream()
                .map(GetProductResponse::from)
                .toList();
        return ResponseEntity.ok(products);
    }

    @GetMapping("/product/categories")
    @Operation(
            summary = "Pobierz dostępne kategorie produktów",
            description = "Zwraca listę wszystkich dostępnych kategorii produktów spożywczych"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Lista kategorii została pomyślnie pobrana",
                    content = @Content(
                            mediaType = "application/json",
                            array = @ArraySchema(schema = @Schema(type = "string", example = "VEGETABLES"))
                    )
            )
    })
    public ResponseEntity<List<String>> getProductCategories() {
        List<String> categories = productManagementUseCase.getAvailableCategories();
        return ResponseEntity.ok(categories);
    }

}
