package com.improvement_app.workouts.services;

import com.improvement_app.workouts.entity.TrainingEntity;
import com.improvement_app.workouts.repository.TrainingEntityRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class TrainingService {

    private final TrainingEntityRepository trainingEntityRepository;

    public List<TrainingEntity> saveAll(List<TrainingEntity> exercises) {
        return trainingEntityRepository.saveAll(exercises);
    }

    public void deleteAllTrainings() {
        trainingEntityRepository.deleteAll();
        trainingEntityRepository.flush();
    }
}
