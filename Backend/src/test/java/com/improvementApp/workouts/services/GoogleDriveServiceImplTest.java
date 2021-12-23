package com.improvementApp.workouts.services;

import com.improvementApp.workouts.DataForTests;
import com.improvementApp.workouts.entity.Exercise;
import org.junit.Assert;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.MockitoJUnitRunner;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@ExtendWith(MockitoExtension.class)
@RunWith(MockitoJUnitRunner.class)
class GoogleDriveServiceImplTest {

    final Exercise exercise1 = DataForTests.generateFirstExerciseFirstTraining();
    final Exercise exercise2 = DataForTests.generateSecondExerciseFirstTraining();
    final Exercise exercise3 = DataForTests.generateThirdExerciseFirstTraining();

    final Exercise exercise4 = DataForTests.generateFirstExerciseSecondTraining();
    final Exercise exercise5 = DataForTests.generateSecondExerciseSecondTraining();
    final Exercise exercise6 = DataForTests.generateThirdExerciseSecondTraining();

    final Exercise exercise7 = DataForTests.generateFirstExerciseThirdTraining();
    final Exercise exercise8 = DataForTests.generateSecondExerciseThirdTraining();
    final Exercise exercise9 = DataForTests.generateThirdExerciseThirdTraining();

    @Mock
    ExerciseService exerciseService;

    @InjectMocks
    GoogleDriveServiceImpl googleDriveService;

    //TODO: sprawdzic czy trzeba jakies testy do tej klasy dopisac

    @Test
    void should_get_drive_files() {

    }

    @Test
    void should_save_all_exercises_to_db() {

    }

    @Test
    void should_download_file() {

    }

    @Test
    void should_upload_file_in_folder() {

    }

    @Test
    void should_generate_file_name() {
        //given
        Mockito.lenient().when(exerciseService.findAll()).thenReturn(generateThreeTrainings());

        //when
        final String dateString = LocalDate.now().format(DateTimeFormatter.ofPattern("dd.MM.yyyy"));
        final String expectedTrainingName = "103 - " + dateString + "r. - B";
        List<Exercise> exercisesToAdd =  new ArrayList<>(Arrays.asList(exercise7, exercise8, exercise9));
        final String serviceResult = googleDriveService.generateFileName(exercisesToAdd);

        //then
        Assert.assertEquals(expectedTrainingName, serviceResult);
    }

    private List<Exercise> generateThreeTrainings() {
        return new ArrayList<>(Arrays.asList(exercise1, exercise2, exercise3, exercise4, exercise5, exercise6,
                exercise7, exercise8, exercise9));
    }

    @Test
    void should_init_application() {

    }
}