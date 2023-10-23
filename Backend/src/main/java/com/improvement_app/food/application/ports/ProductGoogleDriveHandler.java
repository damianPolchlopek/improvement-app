package com.improvement_app.food.application.ports;

import com.improvement_app.food.domain.Product;

import java.io.IOException;
import java.util.List;

public interface ProductGoogleDriveHandler {

    List<Product> findAll() throws IOException;
}
