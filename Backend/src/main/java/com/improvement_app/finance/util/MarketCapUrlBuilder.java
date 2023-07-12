package com.improvement_app.finance.util;

public class MarketCapUrlBuilder {
    private static final String BASE_URL = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest";

    private String coins;
    private String convert;

    public MarketCapUrlBuilder addCoins(String coins) {
        this.coins = coins;
        return this;
    }

    public MarketCapUrlBuilder setConvert(String convert) {
        this.convert = convert;
        return this;
    }

    public String build() {
        return BASE_URL + "?symbol=" + coins +
                "&convert=" + convert;
    }
}
