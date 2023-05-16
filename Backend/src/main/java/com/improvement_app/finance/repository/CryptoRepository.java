package com.improvement_app.finance.repository;

import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@Repository
public class CryptoRepository {

    private final Map<String, CryptoInformation> cryptocurrenciesInformation = new HashMap<>();

    public CryptoRepository() {
        cryptocurrenciesInformation.put("BTC", new CryptoInformation(68744.03, LocalDate.parse("2021-11-10")));
        cryptocurrenciesInformation.put("ETH", new CryptoInformation(4858.82, LocalDate.parse("2021-11-10")));
        cryptocurrenciesInformation.put("ADA", new CryptoInformation(3.09, LocalDate.parse("2021-09-02")));
        cryptocurrenciesInformation.put("DOT", new CryptoInformation(54.99, LocalDate.parse("2021-11-04")));
        cryptocurrenciesInformation.put("MATIC", new CryptoInformation(2.91, LocalDate.parse("2021-12-27")));
    }

    public CryptoInformation get(String name) {
        return cryptocurrenciesInformation.get(name);
    }

    public Map<String, CryptoInformation> getAll() {
        return cryptocurrenciesInformation;
    }

}


