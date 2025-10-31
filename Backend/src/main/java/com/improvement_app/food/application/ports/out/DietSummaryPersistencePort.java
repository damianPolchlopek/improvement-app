package com.improvement_app.food.application.ports.out;

import com.improvement_app.food.domain.summary.DietSummary;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

public interface DietSummaryPersistencePort {

    DietSummary save(Long userId, DietSummary dietSummaryEntity);

    Page<DietSummary> findAll(Long userId, Pageable pageable);

    void deleteById(Long userId, Long id);

    Optional<DietSummary> findById(Long userId, Long id);
}
