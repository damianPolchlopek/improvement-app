package com.improvement_app.food.infrastructure.database;

import com.improvement_app.food.infrastructure.entity.DietSummaryEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DietSummaryRepository extends JpaRepository<DietSummaryEntity, Long> {

    Page<DietSummaryEntity> findAll(Pageable pageable);



}
