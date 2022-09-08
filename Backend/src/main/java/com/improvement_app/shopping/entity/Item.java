package com.improvement_app.shopping.entity;

import lombok.Data;
import lombok.Generated;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document
@NoArgsConstructor
public class Item {

    @Id
    @Generated
    private String id;
    private String name;
    private Category category;

    public Item(String name, Category category) {
        this.name = name;
        this.category = category;
    }
}
