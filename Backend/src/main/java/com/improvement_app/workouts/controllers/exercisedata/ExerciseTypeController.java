package com.improvement_app.workouts.controllers.exercisedata;

import com.improvement_app.workouts.entity.exercisesfields.Type;
import com.improvement_app.workouts.services.data.ExerciseTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.ws.rs.core.Response;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/exerciseType")
public class ExerciseTypeController {

    private final ExerciseTypeService exerciseTypeService;

    @GetMapping("/")
    public Response getExerciseTypes() {
        List<Type> exerciseTypes = exerciseTypeService.getExerciseTypes();
        return Response.ok(exerciseTypes).build();
    }

}
