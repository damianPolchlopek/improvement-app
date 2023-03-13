package com.improvement_app.workouts.controllers.exercisedata;

import com.improvement_app.workouts.entity.exercisesfields.Progress;
import com.improvement_app.workouts.services.data.ExerciseProgressService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.ws.rs.core.Response;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/exerciseProgress")
public class ExerciseProgressController {

    private final ExerciseProgressService exerciseProgressService;

    @GetMapping("/")
    public Response getExerciseProgresses() {
        List<Progress> exerciseProgresses = exerciseProgressService.getExerciseProgress();
        return Response.ok(exerciseProgresses).build();
    }

}
