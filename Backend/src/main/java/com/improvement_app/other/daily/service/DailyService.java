package com.improvement_app.other.daily.service;

import com.improvement_app.other.daily.entity.Daily;
import com.improvement_app.other.daily.repository.DailyRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class DailyService {

    private final DailyRepository dailyRepository;

    public Page<Daily> getDailyList(Pageable pageable) {
        return dailyRepository.findAll(pageable);
    }

    public Daily addDaily(Daily daily) {
        Daily newDaily = new Daily(daily);
        return dailyRepository.save(newDaily);
    }

}
