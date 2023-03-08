package com.improvement_app.workouts.services.data;

import com.improvement_app.workouts.entity.TrainingTemplate;

import java.util.List;

public interface TrainingTemplateService {

    TrainingTemplate getTrainingTemplateByName(String trainingTemplate);

    List<TrainingTemplate> saveAllTrainingTemplates(List<TrainingTemplate> trainingTemplateList);

    void deleteAllTrainingTemplates();

}
