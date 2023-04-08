package com.improvement_app.other.daily.service;

import com.improvement_app.other.daily.entity.Daily;

import java.util.List;

public interface DailyService {
    List<Daily> getDailyList();

    Daily addDaily(Daily dailyList);
}
