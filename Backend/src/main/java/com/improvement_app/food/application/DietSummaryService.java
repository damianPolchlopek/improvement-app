package com.improvement_app.food.application;

import com.improvement_app.food.application.exceptions.DietSummaryNotFoundException;
import com.improvement_app.food.application.ports.in.DietSummaryManagementUseCase;
import com.improvement_app.food.application.ports.out.DietSummaryPersistencePort;
import com.improvement_app.food.domain.calculate.CalculateResult;
import com.improvement_app.food.domain.summary.DietSummary;
import com.improvement_app.food.ui.requests.create.CreateDietSummaryRequest;
import com.improvement_app.food.ui.requests.update.UpdateDietSummaryRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DietSummaryService implements DietSummaryManagementUseCase {

    private final DietSummaryPersistencePort dietSummaryPersistencePort;
    private final CalculationMacroelementsService calculationMacroelementsService;

    @Override
    public DietSummary saveDietDaySummary(Long userId, CreateDietSummaryRequest createDietSummaryRequest) {
        CalculateResult calculateResult = calculationMacroelementsService.calculateDayMacro(
                createDietSummaryRequest.toCalculateDayRequest());

        DietSummary dietSummary = createDietSummaryRequest.toDietSummary(calculateResult);

        return dietSummaryPersistencePort.save(userId, dietSummary);
    }

    @Override
    public Page<DietSummary> getDietSummaries(Long userId, Pageable pageable) {
        return dietSummaryPersistencePort.findAll(userId, pageable);
    }

    @Override
    public void deleteDietSummary(Long userId, Long id) {
        dietSummaryPersistencePort.deleteById(userId, id);
    }

    @Override
    public DietSummary getDayDietSummary(Long userId, Long id) {
        return dietSummaryPersistencePort.findById(userId, id)
                .orElseThrow(() -> new DietSummaryNotFoundException(id));
    }

    @Override
    public DietSummary updateDietSummary(Long userId, UpdateDietSummaryRequest updateDietSummaryRequest) {
        CalculateResult calculateResult = calculationMacroelementsService.calculateDayMacro(
                updateDietSummaryRequest.toCalculateDayRequest());

        long dietSummaryId = updateDietSummaryRequest.dietSummaryId();
        DietSummary oldDietSummary = dietSummaryPersistencePort.findById(userId, dietSummaryId)
                .orElseThrow(() -> new DietSummaryNotFoundException(dietSummaryId));

        DietSummary updated = oldDietSummary.update(calculateResult);

        return dietSummaryPersistencePort.save(userId, updated);
    }
}
