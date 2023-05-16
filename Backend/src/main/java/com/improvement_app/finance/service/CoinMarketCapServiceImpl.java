package com.improvement_app.finance.service;

import com.google.gson.Gson;
import com.improvement_app.finance.entity.MarketCapResponse;
import com.improvement_app.finance.repository.CryptoInformation;
import com.improvement_app.finance.repository.CryptoRepository;
import lombok.RequiredArgsConstructor;
import org.apache.http.HttpEntity;
import org.apache.http.HttpHeaders;
import org.apache.http.NameValuePair;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CoinMarketCapServiceImpl implements CoinMarketCapService {

    private static final String apiKey = "90c48b1c-81a5-4e96-801f-493d4a30784b";
    private final CryptoRepository cryptoRepository;

    public String get() {
//        String uri = "https://pro-api.coinmarketcap.com";
        String uri = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=BTC,ETH,ADA,DOT,MATIC&convert=USD";
        List<NameValuePair> paratmers = new ArrayList<NameValuePair>();
        paratmers.add(new BasicNameValuePair("start","1"));
        paratmers.add(new BasicNameValuePair("limit","5000"));
        paratmers.add(new BasicNameValuePair("convert","USD"));

        String result = "";

        try {
            result = makeAPICall(uri, paratmers);
            Gson gson = new Gson();
            MarketCapResponse bitcoinInfo = gson.fromJson(result, MarketCapResponse.class);

            System.out.println(bitcoinInfo);


            System.out.println(result);
        } catch (IOException e) {
            System.out.println("Error: cannont access content - " + e.toString());
        } catch (URISyntaxException e) {
            System.out.println("Error: Invalid URL " + e.toString());
        }

        return result;
    }

    public static String makeAPICall(String uri, List<NameValuePair> parameters)
            throws URISyntaxException, IOException {
        String response_content = "";

        URIBuilder query = new URIBuilder(uri);
//        query.addParameters(parameters);


        HttpGet request = new HttpGet(query.build());
        request.setHeader(HttpHeaders.ACCEPT, "application/json");
        request.addHeader("X-CMC_PRO_API_KEY", apiKey);

        CloseableHttpClient client = HttpClients.createDefault();
        CloseableHttpResponse response = client.execute(request);

        try {
            System.out.println(response.getStatusLine());
            HttpEntity entity = response.getEntity();
            response_content = EntityUtils.toString(entity);
            EntityUtils.consume(entity);
        } finally {
            response.close();
        }

        return response_content;
    }

    public CryptoInformation getInformation(String name) {
        return cryptoRepository.get(name);
    }

    public Map<String, CryptoInformation> getAllCryptoInformation() {
        return cryptoRepository.getAll();
    }

}
