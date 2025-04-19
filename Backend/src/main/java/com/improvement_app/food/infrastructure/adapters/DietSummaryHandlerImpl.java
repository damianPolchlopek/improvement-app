package com.improvement_app.food.infrastructure.adapters;

import com.improvement_app.food.application.ports.DietSummaryHandler;
import com.improvement_app.food.domain.DietSummary;
import com.improvement_app.food.domain.Meal;
import com.improvement_app.food.infrastructure.DietSummaryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;

@Configuration
@RequiredArgsConstructor
public class DietSummaryHandlerImpl implements DietSummaryHandler {

    private final DietSummaryRepository dietSummaryRepository;

    @Override
    public DietSummary save(DietSummary dietSummary) {
        return dietSummaryRepository.save(dietSummary);
    }

    @Override
    public Page<DietSummary> findAll(Pageable pageable) {
        return dietSummaryRepository.findAll(pageable);
    }

    @Override
    public void deleteById(Long id) {
        dietSummaryRepository.deleteById(id);
    }

}
