package com.improvement_app.workouts.services;

import com.improvement_app.workouts.entity.TrainingEntity;
import com.improvement_app.workouts.repository.TrainingEntityRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
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

    @PersistenceContext
    private EntityManager entityManager;

    @Transactional
    public void recreateTraining(List<TrainingEntity> trainings) {
        log.info("Usuwanie starych treningów...");
        trainingEntityRepository.deleteAllInBatch();
        entityManager.flush();
        entityManager.clear();

        log.info("Zapisywanie {} treningów...", trainings.size());

        int batchSize = 50;
        int totalSaved = 0;

        for (TrainingEntity training : trainings) {
            entityManager.persist(training);
            totalSaved++;

            if (totalSaved % batchSize == 0) {
                entityManager.flush();
                entityManager.clear();
                log.debug("Zapisano {}/{} treningów", totalSaved, trainings.size());
            }
        }

        // Final flush dla pozostałych
        entityManager.flush();
        entityManager.clear();

        log.info("Zapisano wszystkie {} treningi", trainings.size());
    }

    @Transactional
    public List<TrainingEntity> save(List<TrainingEntity> trainings) {
        return trainingEntityRepository.saveAll(trainings);
    }

}
