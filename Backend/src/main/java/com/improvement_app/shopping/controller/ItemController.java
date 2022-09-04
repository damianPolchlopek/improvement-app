package com.improvement_app.shopping.controller;

import com.improvement_app.shopping.entity.Category;
import com.improvement_app.shopping.entity.Item;
import com.improvement_app.shopping.repository.ItemRepository;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import javax.ws.rs.core.Response;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@AllArgsConstructor
@RequestMapping("/shopping")
public class ItemController {

    private final ItemRepository itemRepository;

    @GetMapping("/addList")
    public void addExampleProducts(){
        Item p1 = new Item("Kurczak", Category.SklepSpożywczy);
        Item p2 = new Item("Pepsi", Category.SklepSpożywczy);

        itemRepository.save(p1);
        itemRepository.save(p2);
    }

    @GetMapping("/showList")
    public Response showList(){
        List<Item> items = itemRepository.findAll();
        return Response.ok(items).build();
    }

    @GetMapping("/getShoppingList/{category}")
    public Response addTraining(@PathVariable Category category){
        if (category == Category.All){
            return Response.ok(itemRepository.findAll()).build();
        }

        List<Item> res = itemRepository.findAll().stream()
                .filter(item -> item.getCategory() == category)
                .collect(Collectors.toList());

        return Response.ok(res).build();
    }

    @GetMapping("/getAllCategoryType")
    public Response getAllCategoryType(){
        return Response.ok(Category.values()).build();
    }

    @PostMapping("/addItem")
    public Response addItem(@RequestBody Item item) {
        System.out.println(item);
        Item savedItem = itemRepository.save(item);
        return Response.ok(savedItem).build();
    }

    @DeleteMapping("/deleteItem/{itemId}")
    public Response deleteProduct(@PathVariable String itemId) {
        itemRepository.deleteById(itemId);
        return Response.ok().build();
    }

}
