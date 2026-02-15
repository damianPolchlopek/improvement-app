package com.improvement_app.workouts.response;

import java.time.LocalDate;

public record ChartPoint(
                    LocalDate localDate,
                    Double value)
{ }
