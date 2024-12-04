package com.improvement_app.workouts.services.data;

import com.improvement_app.workouts.entity.TrainingTemplate;
import com.improvement_app.workouts.repository.TrainingTemplateRepository;
import com.improvement_app.workouts.services.TrainingTypeConverter;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class TrainingTemplateService {

    private TrainingTemplateRepository trainingTemplateRepository;


    public Optional<TrainingTemplate> getTrainingTemplate(String trainingTypeShortcut) {
        String trainingTypeName = TrainingTypeConverter.convert(trainingTypeShortcut);
        return trainingTemplateRepository.findByName(trainingTypeName);
    }

    public List<TrainingTemplate> saveAllTrainingTemplates(List<TrainingTemplate> trainingTemplateList) {
        return trainingTemplateRepository.saveAll(trainingTemplateList);
    }

    public void deleteAllTrainingTemplates() {
        trainingTemplateRepository.deleteAll();
    }
}
