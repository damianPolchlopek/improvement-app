package com.improvement_app.food.infrastructure;

import com.improvement_app.food.domain.DietSummary;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DietSummaryRepository extends JpaRepository<DietSummary, Long> {

    Page<DietSummary> findAll(Pageable pageable);

}
