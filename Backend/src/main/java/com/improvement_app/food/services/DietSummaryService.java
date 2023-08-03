package com.improvement_app.food.services;

import com.improvement_app.food.dto.DietSummaryDto;
import com.improvement_app.food.entity.DietSummary;
import com.improvement_app.food.repository.DietSummaryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DietSummaryService {

    private final DietSummaryRepository dietSummaryRepository;

    @Transactional
    public DietSummary addDietSummary(DietSummaryDto dietSummaryDto) {
        DietSummary dietSummary = DietSummary.from(dietSummaryDto);
        return dietSummaryRepository.save(dietSummary);
    }
}
