package com.perfume.dto;

public class IngredientSummaryDTO {
    private Long id;
    private String name;
    private String category;
    private String subcategory;
    private String typicalVolatility;
    private String imageUrl;

    // 1. Default no-arg constructor (needed as a fallback for Hibernate)
    public IngredientSummaryDTO() {
    }

    // 2. Full constructor
    // Ingredient.java
    public IngredientSummaryDTO(Long id, String name, String category, String subcategory, String typicalVolatility,
            String imageUrl) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.subcategory = subcategory;
        this.typicalVolatility = typicalVolatility;
        this.imageUrl = imageUrl;
    }

    // Getter
    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getCategory() {
        return category;
    }

    public String getSubcategory() {
        return subcategory;
    }

    public String getTypicalVolatility() {
        return typicalVolatility;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public void setSubcategory(String subcategory) {
        this.subcategory = subcategory;
    }

    public void setTypicalVolatility(String typicalVolatility) {
        this.typicalVolatility = typicalVolatility;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}