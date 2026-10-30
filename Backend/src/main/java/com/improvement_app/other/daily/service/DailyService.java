package com.improvement_app.other.daily.service;

import com.improvement_app.other.daily.entity.Daily;
import com.improvement_app.other.daily.repository.DailyRepository;
import com.improvement_app.other.daily.request.DailyRequest;
import com.improvement_app.other.daily.response.DailyResponse;
import com.improvement_app.security.entity.UserEntity;
import com.improvement_app.security.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@AllArgsConstructor
public class DailyService {

    private final DailyRepository dailyRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public Page<DailyResponse> getDailyList(Long userId, Pageable pageable) {
        return dailyRepository.findByUserId(userId, pageable)
                .map(DailyResponse::from);
    }

    @Transactional
    public DailyResponse addDaily(Long userId, DailyRequest request) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + userId));

        Daily saved = dailyRepository.save(Daily.from(request, user));
        return DailyResponse.from(saved);
    }

}
