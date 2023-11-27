package com.improvement_app.other.daily.service;

import com.improvement_app.other.daily.entity.Daily;
import com.improvement_app.other.daily.repository.DailyRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class DailyService {

    private final DailyRepository dailyRepository;

    public List<Daily> getDailyList() {
        return dailyRepository.findAll();
    }

    public Daily addDaily(Daily daily) {
        Daily newDaily = new Daily(daily);
        return dailyRepository.save(newDaily);
    }

}
