package com.improvement_app.workouts.entity.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RepAndWeight {
    private Double repetition;
    private Double weight;

    public Double getCapacity(){
        return repetition * weight;
    }
}
