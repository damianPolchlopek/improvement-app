package com.improvement_app.finance.util;

import java.util.ArrayList;
import java.util.List;

public class MarketCapUrlBuilder {
    private static final String BASE_URL = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest";
    private final List<String> symbols = new ArrayList<>();
    private String convert;

    public MarketCapUrlBuilder addSymbol(String symbol) {
        symbols.add(symbol);
        return this;
    }

    public MarketCapUrlBuilder setConvert(String convert) {
        this.convert = convert;
        return this;
    }

    public String build() {
        StringBuilder urlBuilder = new StringBuilder(BASE_URL);
        urlBuilder.append("?symbol=").append(String.join(",", symbols));
        urlBuilder.append("&convert=").append(convert);
        return urlBuilder.toString();
    }
}
