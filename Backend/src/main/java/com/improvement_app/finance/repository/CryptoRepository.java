package com.improvement_app.finance.repository;

import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@Repository
public class CryptoRepository {
    private final Map<String, CryptoInformation> cryptocurrenciesInformation = new HashMap<>();

//    https://e-kursy-walut.pl/all-time-high-kryptowalut/

    public CryptoRepository() {
        cryptocurrenciesInformation.put("BTC", new CryptoInformation(68744.03, LocalDate.parse("2021-11-10")));
        cryptocurrenciesInformation.put("ETH", new CryptoInformation(4858.82, LocalDate.parse("2021-11-10")));
        cryptocurrenciesInformation.put("BNB", new CryptoInformation(689.35, LocalDate.parse("2021-05-10")));
        cryptocurrenciesInformation.put("ADA", new CryptoInformation(3.09, LocalDate.parse("2021-09-02")));
        cryptocurrenciesInformation.put("DOT", new CryptoInformation(54.99, LocalDate.parse("2021-11-04")));
        cryptocurrenciesInformation.put("MATIC", new CryptoInformation(2.91, LocalDate.parse("2021-12-27")));
        cryptocurrenciesInformation.put("SOL", new CryptoInformation(259.62, LocalDate.parse("2021-11-06")));
        cryptocurrenciesInformation.put("AVAX", new CryptoInformation(146.21, LocalDate.parse("2021-11-21")));
        cryptocurrenciesInformation.put("ATOM", new CryptoInformation(44.54, LocalDate.parse("2021-11-19")));
        cryptocurrenciesInformation.put("ALGO", new CryptoInformation(2.37, LocalDate.parse("2021-09-12")));
        cryptocurrenciesInformation.put("ARB", new CryptoInformation(8.67, LocalDate.parse("2023-03-23")));
        cryptocurrenciesInformation.put("SYN", new CryptoInformation(4.92, LocalDate.parse("2021-10-24")));
    }

    public CryptoInformation get(String name) {
        return cryptocurrenciesInformation.get(name);
    }

    public Map<String, CryptoInformation> getAll() {
        return cryptocurrenciesInformation;
    }

}


