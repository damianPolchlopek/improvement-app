package com.improvement_app.weekly.controller;

import com.improvement_app.weekly.entity.Category;
import com.improvement_app.weekly.entity.WeeklyRecord;
import com.improvement_app.weekly.repository.WeeklyRepository;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import javax.ws.rs.core.Response;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@AllArgsConstructor
@RequestMapping("/weekly")
public class WeeklyController {

    private final WeeklyRepository weeklyRepository;

    @GetMapping("/addList")
    public void addExampleWeeklyRecords(){
        WeeklyRecord p1 = new WeeklyRecord("89", LocalDate.now(), Category.Waga);
        WeeklyRecord p2 = new WeeklyRecord("89.2", LocalDate.now(), Category.Waga);

        weeklyRepository.save(p1);
        weeklyRepository.save(p2);
    }

    @GetMapping("/showList")
    public Response showList(){
        List<WeeklyRecord> items = weeklyRepository.findAll();
        return Response.ok(items).build();
    }

    @GetMapping("/getWeeklyList/{category}")
    public Response addWeeklyRecords(@PathVariable Category category){
        if (category == Category.Waga) {
            return Response.ok(weeklyRepository.findAll()).build();
        }

        List<WeeklyRecord> res = weeklyRepository.findAll().stream()
            .filter(item -> item.getCategory() == category)
            .collect(Collectors.toList());

        return Response.ok(res).build();
    }

    @GetMapping("/getAllCategoryType")
    public Response getAllCategoryType(){
        return Response.ok(Category.values()).build();
    }

    @PostMapping("/addItem")
    public Response addItem(@RequestBody WeeklyRecord item) {
        WeeklyRecord savedItem = weeklyRepository.save(item);
        return Response.ok(savedItem).build();
    }

    @DeleteMapping("/deleteItem/{itemId}")
    public Response deleteProduct(@PathVariable String itemId) {
        weeklyRepository.deleteById(itemId);
        return Response.ok().build();
    }

}
