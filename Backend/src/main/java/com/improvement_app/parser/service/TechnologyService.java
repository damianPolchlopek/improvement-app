package com.improvement_app.parser.service;

import com.improvement_app.parser.entity.Technology;
import com.improvement_app.parser.entity.TechnologyList;
import com.improvement_app.parser.repository.TechnologyListRepo;
import lombok.RequiredArgsConstructor;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class TechnologyService {

    private final TechnologyListRepo technologyListRepo;

    public List<Technology> parseAllJobOffers() throws IOException {
        final String urlJobOffers = "https://nofluffjobs.com/pl/backend?criteria=requirement%3DJava%20%20seniority%3Dmid&page=1";
        String html1 = getHtml(urlJobOffers);
        List<String> jobOfferUrls = getJobOfferUrls(html1);

        List<Technology> technologies = new ArrayList<>();

        for (String url : jobOfferUrls) {
            System.out.println("Analizuje: " + url);
            String jobOfferHtml = getHtml(url);
            List<String> skills = getTechnologies(jobOfferHtml);

            skills.forEach(skill -> {
                Technology technologyToAdd = technologies.stream()
                        .filter(technology -> technology.getName().equals(skill))
                        .findFirst()
                        .orElseGet(() -> {
                            Technology technology = new Technology();
                            technology.setName(skill);
                            technologies.add(technology);
                            return technology;
                        });

                technologyToAdd.setOccurrences(technologyToAdd.getOccurrences() + 1);
            });
        }

        technologies.sort(Comparator.comparing(Technology::getOccurrences).reversed());
        System.out.println("Technology: " + technologies);

        technologyListRepo.save(new TechnologyList(technologies));

        return technologies;
    }

    private List<String> getJobOfferUrls(String root) {
        final String urlPrefix = "https://nofluffjobs.com";
        List<String> urls = new ArrayList<>();

        final String jobOfferListRegex = "(class=\"list-container ng-star-inserted\">)[\\s\\S]*?(nfj-postings-list)";
        Pattern pattern = Pattern.compile(jobOfferListRegex);
        Matcher matcher = pattern.matcher(root);
        while (matcher.find()) {
            String jobOfferList = matcher.group();

            final String jobOfferRegex = "<a(.*)href=\"(/pl/.*)\" target=\"_self\" ngh=\"38";
            Pattern jobOfferPattern = Pattern.compile(jobOfferRegex);
            Matcher jobOfferMatcher = jobOfferPattern.matcher(jobOfferList);

            while (jobOfferMatcher.find()) {
                String jobOfferUrl = jobOfferMatcher.group(2);
                urls.add(urlPrefix + jobOfferUrl);
            }
        }

        return urls;
    }

    private List<String> getTechnologies(String html) {
        List<String> skills = new ArrayList<>();

        final String regexSection = "(?<=Obowiązkowe)[\\s\\S]*?(?=posting-nice-to-have)";
        final String regexSkill = "class=\"ng-star-inserted\">([^<]+)";

        Pattern pattern = Pattern.compile(regexSection);
        Matcher matcher = pattern.matcher(html);

        while (matcher.find()) {
            String sectionHtml = matcher.group(0);
            Pattern patternSkill = Pattern.compile(regexSkill);
            Matcher matcherSkill = patternSkill.matcher(sectionHtml);
            while (matcherSkill.find()) {
                String skill = matcherSkill.group(1);
                skills.add(skill.trim());
            }
        }

        return skills;
    }

    private String getHtml(String url) throws IOException {
        Document document = Jsoup.connect(url).get();
        return document.html();
    }

}
