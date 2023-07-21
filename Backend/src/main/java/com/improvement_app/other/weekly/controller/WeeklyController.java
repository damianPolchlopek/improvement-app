package com.improvement_app.other.weekly.controller;

import com.improvement_app.other.weekly.entity.Category;
import com.improvement_app.other.weekly.entity.WeeklyRecord;
import com.improvement_app.other.weekly.repository.WeeklyRepository;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import javax.ws.rs.core.Response;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@AllArgsConstructor
@RequestMapping("/weekly")
public class WeeklyController {

    private final WeeklyRepository weeklyRepository;

    @GetMapping("/{category}")
    public Response getWeekly(@PathVariable Category category) {
        List<WeeklyRecord> res = weeklyRepository.findAll().stream()
                .filter(item -> item.getCategory() == category)
                .sorted((w1, w2) -> w2.getDate().compareTo(w1.getDate()))
                .collect(Collectors.toList());

        return Response.ok(res).build();
    }

    @GetMapping("/categories")
    public Response getAllCategoryType() {
        return Response.ok(Category.values()).build();
    }

    @PostMapping
    public Response addItem(@RequestBody WeeklyRecord item) {
        WeeklyRecord savedItem = weeklyRepository.save(item);
        return Response.ok(savedItem).build();
    }

    @DeleteMapping("{itemId}")
    public Response deleteProduct(@PathVariable String itemId) {
        weeklyRepository.deleteById(itemId);
        return Response.ok().build();
    }

}
