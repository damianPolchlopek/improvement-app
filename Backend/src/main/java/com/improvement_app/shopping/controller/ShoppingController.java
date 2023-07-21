package com.improvement_app.shopping.controller;

import com.improvement_app.shopping.entity.Category;
import com.improvement_app.shopping.entity.Item;
import com.improvement_app.shopping.repository.ItemRepository;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@AllArgsConstructor
@RequestMapping("/shopping")
public class ShoppingController {

    private final ItemRepository itemRepository;

    @GetMapping("/category/{category}")
    public Response getProductByCategory(@PathVariable Category category) {
        if (category == Category.All) {
            return Response.ok(itemRepository.findAll()).build();
        }

        List<Item> res = itemRepository.findAll().stream()
                .filter(item -> item.getCategory() == category)
                .collect(Collectors.toList());

        return Response.ok(res).build();
    }

    @GetMapping("/categories")
    public Response getAllCategoryType() {
        return Response.ok(Category.values()).build();
    }

    @PostMapping(value = "/", produces = MediaType.APPLICATION_JSON)
    public Response addItem(@RequestBody Item item) {
        Item savedItem = itemRepository.save(item);
        return Response.ok(savedItem).build();
    }

    @DeleteMapping("/{itemId}")
    public Response deleteProduct(@PathVariable String itemId) {
        itemRepository.deleteById(itemId);
        return Response.ok().build();
    }

}
