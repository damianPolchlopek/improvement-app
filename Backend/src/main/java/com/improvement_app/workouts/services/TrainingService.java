package com.improvement_app.workouts.services;

import com.improvement_app.workouts.entity.TrainingEntity;
import com.improvement_app.workouts.entity.TrainingTemplateEntity;
import com.improvement_app.workouts.repository.TrainingEntityRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class TrainingService {

    private final TrainingEntityRepository trainingEntityRepository;

    @Transactional
    public List<TrainingEntity> recreateTraining(List<TrainingEntity> trainings) {
        trainingEntityRepository.deleteAll();
        return trainingEntityRepository.saveAll(trainings);
    }

}
