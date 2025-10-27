package com.improvement_app.food.infrastructure.repository;

import com.improvement_app.food.infrastructure.entity.summary.DietSummaryEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DietSummaryRepository extends JpaRepository<DietSummaryEntity, Long> {

    Page<DietSummaryEntity> findByUserId(Long userId, Pageable pageable);

    int deleteByIdAndUserId(Long id, Long userId);

    Optional<DietSummaryEntity> findByIdAndUserId(Long userId, Long id);
}
