package com.improvement_app.workouts.services.data;

import com.improvement_app.workouts.entity.TrainingTemplate;
import com.improvement_app.workouts.repository.TrainingTemplateRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class TrainingTemplateService {

    private TrainingTemplateRepository trainingTemplateRepository;


    public TrainingTemplate getTrainingTemplateByName(String trainingTemplate) {
        return trainingTemplateRepository.findByName(trainingTemplate);
    }

    public List<TrainingTemplate> saveAllTrainingTemplates(List<TrainingTemplate> trainingTemplateList) {
        return trainingTemplateRepository.saveAll(trainingTemplateList);
    }

    public void deleteAllTrainingTemplates() {
        trainingTemplateRepository.deleteAll();
    }
}
