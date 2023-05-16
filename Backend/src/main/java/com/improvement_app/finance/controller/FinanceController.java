package com.improvement_app.finance.controller;

import com.improvement_app.finance.repository.CryptoInformation;
import com.improvement_app.finance.service.CoinMarketCapServiceImpl;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@AllArgsConstructor
@RequestMapping("/finance/crypto")
public class FinanceController {

    private final CoinMarketCapServiceImpl coinMarketCapService;

    @GetMapping("/price")
    public ResponseEntity sss() {
        String s = coinMarketCapService.get();
        return ResponseEntity.ok(s);
    }

    @GetMapping("/description")
    public ResponseEntity<Map<String, CryptoInformation>> getCryptoInformation() {
        Map<String, CryptoInformation> allCryptoInformation = coinMarketCapService.getAllCryptoInformation();
        System.out.println("[Damian] " + allCryptoInformation);
        return ResponseEntity.ok(allCryptoInformation);
    }

}
