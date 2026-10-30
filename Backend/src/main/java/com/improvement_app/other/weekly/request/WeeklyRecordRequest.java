package com.improvement_app.other.weekly.request;

import com.improvement_app.other.weekly.entity.Category;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record WeeklyRecordRequest(
        @NotBlank @Size(max = 255) String name,
        @NotNull Category category
) {
}
