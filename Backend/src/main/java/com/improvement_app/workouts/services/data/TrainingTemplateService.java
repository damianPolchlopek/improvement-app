package com.improvement_app.workouts.services.data;

import com.improvement_app.workouts.entity2.TrainingTemplateEntity;
import com.improvement_app.workouts.repository2.TrainingTemplateEntityRepository;
import com.improvement_app.workouts.services.TrainingTypeConverter;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class TrainingTemplateService {

    private TrainingTemplateEntityRepository trainingTemplateRepository;


    public Optional<TrainingTemplateEntity> getTrainingTemplate(String trainingTypeShortcut) {
        String trainingTypeName = TrainingTypeConverter.convert(trainingTypeShortcut);
        return trainingTemplateRepository.findByName(trainingTypeName);
    }

    public List<TrainingTemplateEntity> saveAllTrainingTemplates(List<TrainingTemplateEntity> trainingTemplateList) {
        return trainingTemplateRepository.saveAll(trainingTemplateList);
    }

    public void deleteAllTrainingTemplates() {
        trainingTemplateRepository.deleteAll();
    }
}
