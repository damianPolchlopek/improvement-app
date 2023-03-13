package com.improvement_app.shopping.controller;

import com.improvement_app.shopping.entity.Category;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.ws.rs.core.Response;

@RestController
@RequestMapping("/shopping-category")
public class ShoppingCategoryController {

    @GetMapping("/")
    public Response getAllCategoryType() {
        return Response.ok(Category.values()).build();
    }

}
