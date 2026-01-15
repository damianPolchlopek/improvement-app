package com.improvement_app.workouts.services.data;

import com.improvement_app.workouts.entity.TrainingTemplateEntity;
import com.improvement_app.workouts.exceptions.TrainingTemplateNotFoundException;
import com.improvement_app.workouts.repository.TrainingTemplateEntityRepository;
import com.improvement_app.workouts.converters.TrainingTypeConverter;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@AllArgsConstructor
public class TrainingTemplateService {

    private TrainingTemplateEntityRepository trainingTemplateRepository;

    @Transactional
    public TrainingTemplateEntity getTrainingTemplate(String trainingTypeShortcut) {
        String trainingTypeName = TrainingTypeConverter.toTrainingTemplate(trainingTypeShortcut);

        return trainingTemplateRepository.findByName(trainingTypeName)
                .orElseThrow(() -> new TrainingTemplateNotFoundException(trainingTypeName));
    }

    @Transactional
    public List<TrainingTemplateEntity> recreateTemplates(List<TrainingTemplateEntity> templates) {
        trainingTemplateRepository.deleteAllInBatch();
        trainingTemplateRepository.flush();
        return trainingTemplateRepository.saveAll(templates);
    }

}
