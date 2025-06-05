package com.improvement_app.food.infrastructure.adapters;

import com.improvement_app.food.application.ports.out.DietSummaryPersistencePort;
import com.improvement_app.food.domain.DietSummary;
import com.improvement_app.food.infrastructure.entity.DietSummaryEntity;
import com.improvement_app.food.infrastructure.database.DietSummaryRepository;
import com.improvement_app.food.infrastructure.mappers.DietSummaryMapper;
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
    private final DietSummaryMapper dietSummaryMapper;

    @Override
    public DietSummary save(DietSummary dietSummary) {
        DietSummaryEntity dietSummaryEntity = dietSummaryMapper.toEntity(dietSummary);
        DietSummaryEntity savedDietSummary = dietSummaryRepository.save(dietSummaryEntity);
        return dietSummaryMapper.toDomain(savedDietSummary);
    }

    @Override
    public Page<DietSummary> findAll(Pageable pageable) {
        return dietSummaryRepository.findAll(pageable)
                .map(dietSummaryMapper::toDomain);
    }

    @Override
    public void deleteById(Long id) {
        dietSummaryRepository.deleteById(id);
    }

    @Override
    public Optional<DietSummary> findById(Long id) {
        Optional<DietSummaryEntity> byId = dietSummaryRepository.findById(id);
        return byId.map(dietSummaryMapper::toDomain);
    }

}
