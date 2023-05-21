package com.improvement_app.finance.service;

import com.improvement_app.finance.util.MarketCapUrlBuilder;
import com.improvement_app.finance.repository.CryptoInformation;
import com.improvement_app.finance.repository.CryptoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j;
import org.apache.http.HttpEntity;
import org.apache.http.HttpHeaders;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Log4j
public class CoinMarketCapServiceImpl implements CoinMarketCapService {

    private final String apiKey = "90c48b1c-81a5-4e96-801f-493d4a30784b";
    private final CryptoRepository cryptoRepository;

    public String get() {
        String url = new MarketCapUrlBuilder()
                .addSymbol("BTC")
                .addSymbol("ETH")
                .addSymbol("BNB")
                .addSymbol("ADA")
                .addSymbol("DOT")
                .addSymbol("MATIC")
                .addSymbol("SOL")
                .addSymbol("AVAX")
                .addSymbol("ATOM")
                .addSymbol("ALGO")
                .setConvert("USD")
                .build();

        String result = "";

        try {
            result = makeAPICall(url);

        } catch (IOException e) {
            log.error("Cannot access content - " + e);
        } catch (URISyntaxException e) {
            log.error("Invalid URL " + e);
        }

        return result;
    }

    public String makeAPICall(String uri)
            throws URISyntaxException, IOException {
        String responseContent;

        URIBuilder query = new URIBuilder(uri);

        HttpGet request = new HttpGet(query.build());
        request.setHeader(HttpHeaders.ACCEPT, "application/json");
        request.addHeader("X-CMC_PRO_API_KEY", apiKey);

        CloseableHttpClient client = HttpClients.createDefault();

        try (CloseableHttpResponse response = client.execute(request)) {
            HttpEntity entity = response.getEntity();
            responseContent = EntityUtils.toString(entity);
            EntityUtils.consume(entity);
        }

        return responseContent;
    }

    public Map<String, CryptoInformation> getAllCryptoInformation() {
        return cryptoRepository.getAll();
    }

}
