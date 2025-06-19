package com.improvement_app.workouts.services.data;

import com.improvement_app.workouts.entity2.TrainingTemplateEntity;
import com.improvement_app.workouts.exceptions.TrainingTemplateNotFoundException;
import com.improvement_app.workouts.repository2.TrainingTemplateEntityRepository;
import com.improvement_app.workouts.services.TrainingTypeConverter;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class TrainingTemplateService {

    private TrainingTemplateEntityRepository trainingTemplateRepository;


    public TrainingTemplateEntity getTrainingTemplate(String trainingTypeShortcut) {
        String trainingTypeName = TrainingTypeConverter.toTrainingTemplate(trainingTypeShortcut);

        return trainingTemplateRepository.findByName(trainingTypeName)
                .orElseThrow(() -> new TrainingTemplateNotFoundException(trainingTypeName));
    }

    public List<TrainingTemplateEntity> saveAllTrainingTemplates(List<TrainingTemplateEntity> trainingTemplateList) {
        return trainingTemplateRepository.saveAll(trainingTemplateList);
    }

    public void deleteAllTrainingTemplates() {
        trainingTemplateRepository.deleteAll();
    }
}
