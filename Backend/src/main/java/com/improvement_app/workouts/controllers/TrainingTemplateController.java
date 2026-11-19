package com.improvement_app.workouts.controllers;

import com.improvement_app.common.web.ApiVersions;
import com.improvement_app.util.ListResponse;
import com.improvement_app.workouts.entity.TrainingTemplateEntity;
import com.improvement_app.workouts.response.TrainingTemplateResponse;
import com.improvement_app.workouts.services.data.TrainingTemplateService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Tag(name = "Training Template API", description = "Szablony treningów importowane z Google Drive")
@RestController
@RequiredArgsConstructor
@RequestMapping(ApiVersions.V1 + "/training-templates")
public class TrainingTemplateController {

    private final TrainingTemplateService trainingTemplateService;

    @Operation(summary = "Pobierz wszystkie szablony treningów",
            description = "Zwraca listę szablonów treningów (posortowaną po nazwie) wraz z ćwiczeniami w kolejności z szablonu")
    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ListResponse<TrainingTemplateResponse> getAllTrainingTemplates() {
        List<TrainingTemplateResponse> templates = trainingTemplateService.getAllTrainingTemplates().stream()
                .map(TrainingTemplateEntity::toResponse)
                .toList();
        return ListResponse.of(templates);
    }

    @Operation(summary = "Pobierz szablon treningu",
            description = "Zwraca szablon treningu po skrócie typu (np. A, C1)")
    @GetMapping(value = "/{template}", produces = MediaType.APPLICATION_JSON_VALUE)
    public TrainingTemplateResponse getTrainingTemplate(@PathVariable String template) {
        return trainingTemplateService.getTrainingTemplate(template)
                .toResponse();
    }
}
