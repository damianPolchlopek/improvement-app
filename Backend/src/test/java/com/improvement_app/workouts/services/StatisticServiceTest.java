package com.improvement_app.workouts.services;

import com.improvement_app.workouts.exceptions.InvalidDateRangeException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

/**
 * Unit testy zamiast E2E — walidacja zakresu dat w StatisticService.
 * Pure Mockito, brak Springa, brak DB.
 *
 * #25 — beginDate > endDate → InvalidDateRangeException
 * #26 — endDate w przyszłości → InvalidDateRangeException
 */
@ExtendWith(MockitoExtension.class)
class StatisticServiceTest {

    private static final Long USER_ID = 1L;
    private static final String EXERCISE = "Pompki";
    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("dd-MM-yyyy");

    @Mock ExerciseService exerciseService;
    @InjectMocks StatisticService statisticService;

    // ─── #25 — beginDate po endDate ───────────────────────────────
    @Test
    @DisplayName("[#25] beginDate po endDate rzuca InvalidDateRangeException — serwis ćwiczeń nie jest wywołany")
    void shouldThrowWhenBeginDateAfterEndDate() {
        assertThatThrownBy(() -> statisticService.generateStatisticChartData(
                USER_ID, EXERCISE, "Weight", "31-12-2024", "01-01-2024"))
                .isInstanceOf(InvalidDateRangeException.class)
                .hasMessageContaining("Start date cannot be after end date");

        verifyNoInteractions(exerciseService);
    }

    // ─── #26 — endDate w przyszłości ──────────────────────────────
    @Test
    @DisplayName("[#26] endDate ponad 1 dzień w przyszłości rzuca InvalidDateRangeException")
    void shouldThrowWhenEndDateInFuture() {
        String farFuture = LocalDate.now().plusYears(1).format(FORMATTER);

        assertThatThrownBy(() -> statisticService.generateStatisticChartData(
                USER_ID, EXERCISE, "Weight", "01-01-2024", farFuture))
                .isInstanceOf(InvalidDateRangeException.class)
                .hasMessageContaining("End date cannot be in the future");

        verifyNoInteractions(exerciseService);
    }

    @Test
    @DisplayName("[#26 boundary] endDate = jutro jest dozwolone (granica plusDays(1))")
    void shouldAllowTomorrowAsEndDate() {
        String tomorrow = LocalDate.now().plusDays(1).format(FORMATTER);
        when(exerciseService.findByNameOrderByDate(any(), any(), any(), any()))
                .thenReturn(java.util.List.of());

        assertThatCode(() -> statisticService.generateStatisticChartData(
                USER_ID, EXERCISE, "Weight", "01-01-2024", tomorrow))
                .doesNotThrowAnyException();
    }
}
