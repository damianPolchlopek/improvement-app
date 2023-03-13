package com.improvement_app.workouts.controllers.exercisedata;

import com.improvement_app.workouts.entity.exercisesfields.Place;
import com.improvement_app.workouts.services.data.ExercisePlaceService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.ws.rs.core.Response;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/exercisePlace")
public class ExercisePlaceController {

    private final ExercisePlaceService exercisePlaceService;

    @GetMapping("/")
    public Response getExercisePlaces() {
        List<Place> exercisePlaces = exercisePlaceService.getExercisePlaces();
        return Response.ok(exercisePlaces).build();
    }

}
