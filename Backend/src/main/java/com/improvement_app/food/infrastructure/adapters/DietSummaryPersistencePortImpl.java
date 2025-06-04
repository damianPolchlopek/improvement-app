package com.improvement_app.food.infrastructure.adapters;

import com.improvement_app.food.application.ports.out.DietSummaryPersistencePort;
import com.improvement_app.food.domain.dietsummary.DietSummary;
import com.improvement_app.food.infrastructure.database.DietSummaryRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

@Configuration
@Transactional
@RequiredArgsConstructor
public class DietSummaryPersistencePortImpl implements DietSummaryPersistencePort {

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

    @Override
    public Optional<DietSummary> findById(Long id) {
        return dietSummaryRepository.findById(id);
    }

}
