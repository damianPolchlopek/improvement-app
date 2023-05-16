package com.improvement_app.finance.repository;

import lombok.Data;

import java.time.LocalDate;

@Data
public class CryptoInformation {
    private Double ath;
    private LocalDate athDate;

    public CryptoInformation(Double ATH, LocalDate ATHDate) {
        this.ath = ATH;
        this.athDate = ATHDate;
    }
}
