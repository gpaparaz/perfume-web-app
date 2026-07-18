package com.perfume.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "ingredients")
public class Ingredient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "olfactory_family")
    private String olfactoryFamily;

    public Ingredient() {
    }

    public Ingredient(Long id, String name, String description, String olfactoryFamily) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.olfactoryFamily = olfactoryFamily;
    }

    // ... getter e setter
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getOlfactoryFamily() {
        return olfactoryFamily;
    }

    public void setOlfactoryFamily(String olfactoryFamily) {
        this.olfactoryFamily = olfactoryFamily;
    }
}