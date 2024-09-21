package com.improvement_app.food.application.ports;

import com.improvement_app.food.domain.Meal;

import java.io.IOException;
import java.util.List;

public interface SweetsGoogleDriveHandler {
    List<Meal> findAll() throws IOException;

}
