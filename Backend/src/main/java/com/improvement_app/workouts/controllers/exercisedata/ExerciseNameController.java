package com.improvement_app.workouts.controllers.exercisedata;

import com.improvement_app.workouts.entity.exercisesfields.Name;
import com.improvement_app.workouts.services.data.ExerciseNameService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.ws.rs.core.Response;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/exerciseName")
public class ExerciseNameController {

    private final ExerciseNameService exerciseNameService;

    @GetMapping("/")
    public Response getExerciseNames() {
        List<Name> exerciseNames = exerciseNameService.getExerciseNames();
        return Response.ok(exerciseNames).build();
    }

}
