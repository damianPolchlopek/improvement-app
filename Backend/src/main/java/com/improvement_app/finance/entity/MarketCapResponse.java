package com.improvement_app.finance.entity;

import lombok.Data;

@Data
public class MarketCapResponse extends Object {
    private Status status;
    private DataObject data;

    @Data
    public static class Status {
        private String timestamp;
        private int error_code;
        private String error_message;
        private int elapsed;
        private int credit_count;
        private String notice;
    }

    @Data
    public static class DataObject {
        private Cryptocurrency cryptocurrency;

        @Data
        public static class Cryptocurrency {
            private int id;
            private String name;
            private String symbol;
            private String slug;
            private int num_market_pairs;
            private String date_added;
            private String[] tags;
            private int max_supply;
            private int circulating_supply;
            private int total_supply;
            private int is_active;
            private boolean infinite_supply;
            private Object platform;
            private int cmc_rank;
            private int is_fiat;
            private Object self_reported_circulating_supply;
            private Object self_reported_market_cap;
            private Object tvl_ratio;
            private String last_updated;
            private Quote quote;

            @Data
            public static class Quote {
                private USD USD;

                @Data
                public static class USD {
                    private double price;
                    private double volume_24h;
                    private double volume_change_24h;
                    private double percent_change_1h;
                    private double percent_change_24h;
                    private double percent_change_7d;
                    private double percent_change_30d;
                    private double percent_change_60d;
                    private double percent_change_90d;
                    private double market_cap;
                    private double market_cap_dominance;
                    private double fully_diluted_market_cap;
                    private Object tvl;
                    private String last_updated;
                }
            }
        }
    }
}
