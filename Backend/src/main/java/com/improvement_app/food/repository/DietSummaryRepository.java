package com.improvement_app.food.repository;

import com.improvement_app.food.entity.DietSummary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DietSummaryRepository extends JpaRepository<DietSummary, Long> {

}
