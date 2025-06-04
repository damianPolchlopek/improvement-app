package com.improvement_app.food.application.ports.out;

import com.improvement_app.food.domain.dietsummary.DietSummary;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

public interface DietSummaryPersistencePort {

    DietSummary save(DietSummary dietSummary);

    Page<DietSummary> findAll(Pageable pageable);

    void deleteById(Long id);

    Optional<DietSummary> findById(Long id);
}
