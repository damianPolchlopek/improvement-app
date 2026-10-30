package com.improvement_app.other.weekly.service;

import com.improvement_app.other.weekly.entity.Category;
import com.improvement_app.other.weekly.entity.WeeklyRecord;
import com.improvement_app.other.weekly.repository.WeeklyRepository;
import com.improvement_app.other.weekly.request.WeeklyRecordRequest;
import com.improvement_app.other.weekly.response.WeeklyRecordResponse;
import com.improvement_app.security.entity.UserEntity;
import com.improvement_app.security.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@AllArgsConstructor
public class WeeklyService {

    private final WeeklyRepository weeklyRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<WeeklyRecordResponse> getWeeklyRecords(Long userId, Category category) {
        return weeklyRepository.findByUserIdAndCategoryOrderByDateDescIdDesc(userId, category).stream()
                .map(WeeklyRecordResponse::from)
                .toList();
    }

    @Transactional
    public WeeklyRecordResponse addWeeklyRecord(Long userId, WeeklyRecordRequest request) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + userId));

        WeeklyRecord saved = weeklyRepository.save(WeeklyRecord.from(request, user));
        return WeeklyRecordResponse.from(saved);
    }

    // Cudzy wpis traktujemy jak nieistniejący — nie zdradzamy, że takie id jest w bazie
    @Transactional
    public void deleteWeeklyRecord(Long userId, Long id) {
        WeeklyRecord weeklyRecord = weeklyRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Weekly record not found: " + id));
        weeklyRepository.delete(weeklyRecord);
    }

}
