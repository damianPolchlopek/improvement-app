package com.improvement_app.food.infrastructure.adapters;

import com.improvement_app.food.application.ports.DietSummaryHandler;
import com.improvement_app.food.domain.DietSummary;
import com.improvement_app.food.infrastructure.DietSummaryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
public class DietSummaryHandlerImpl implements DietSummaryHandler {

    private final DietSummaryRepository dietSummaryRepository;

    @Override
    public DietSummary save(DietSummary dietSummary) {
        return dietSummaryRepository.save(dietSummary);
    }
}
