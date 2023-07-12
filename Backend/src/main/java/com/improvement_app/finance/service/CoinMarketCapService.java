package com.improvement_app.finance.service;

import com.improvement_app.finance.repository.CryptoInformation;

import java.util.Map;

public interface CoinMarketCapService {

    String get(String coins, String currency);

    Map<String, CryptoInformation> getAllCryptoInformation();
}
