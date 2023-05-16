package com.improvement_app.finance.read;

import com.improvement_app.finance.repository.CryptoInformation;

import java.util.Map;

public class ReadModel {
    private final Map<String, CryptoInformation> cryptocurrenciesInformation;

    public ReadModel(Map<String, CryptoInformation> cryptocurrenciesInformation) {
        this.cryptocurrenciesInformation = cryptocurrenciesInformation;
    }
}
