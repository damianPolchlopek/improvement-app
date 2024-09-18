package com.improvement_app.food.application.ports;

import com.improvement_app.food.domain.DietSummary;
import com.improvement_app.food.domain.Meal;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;

public interface DietSummaryHandler {

    DietSummary save(DietSummary dietSummary);

    Page<DietSummary> findAll(Pageable pageable);
}
