package com.perfume.model;

import java.time.LocalDateTime;

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

    @Column(nullable = false, unique = true)
    private String name;

    private String category;
    private String subcategory;

    @Column(name = "short_description", columnDefinition = "TEXT")
    private String shortDescription;

    @Column(name = "botanical_name")
    private String botanicalName;

    @Column(columnDefinition = "TEXT")
    private String appearance;

    @Column(name = "odor_strength")
    private String odorStrength;

    @Column(name = "producing_countries", columnDefinition = "TEXT")
    private String producingCountries;

    @Column(name = "typical_volatility")
    private String typicalVolatility;

    @Column(name = "evolution_immediate", columnDefinition = "TEXT")
    private String evolutionImmediate;

    @Column(name = "evolution_after_hours", columnDefinition = "TEXT")
    private String evolutionAfterHours;

    @Column(name = "evolution_after_days", columnDefinition = "TEXT")
    private String evolutionAfterDays;

    @Column(name = "full_extracted_text", columnDefinition = "TEXT")
    private String fullExtractedText;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    // Costruttore vuoto obbligatorio per JPA
    public Ingredient() {
    }

    // GETTER E SETTER
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

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getSubcategory() {
        return subcategory;
    }

    public void setSubcategory(String subcategory) {
        this.subcategory = subcategory;
    }

    public String getShortDescription() {
        return shortDescription;
    }

    public void setShortDescription(String shortDescription) {
        this.shortDescription = shortDescription;
    }

    public String getBotanicalName() {
        return botanicalName;
    }

    public void setBotanicalName(String botanicalName) {
        this.botanicalName = botanicalName;
    }

    public String getAppearance() {
        return appearance;
    }

    public void setAppearance(String appearance) {
        this.appearance = appearance;
    }

    public String getOdorStrength() {
        return odorStrength;
    }

    public void setOdorStrength(String odorStrength) {
        this.odorStrength = odorStrength;
    }

    public String getProducingCountries() {
        return producingCountries;
    }

    public void setProducingCountries(String producingCountries) {
        this.producingCountries = producingCountries;
    }

    public String getTypicalVolatility() {
        return typicalVolatility;
    }

    public void setTypicalVolatility(String typicalVolatility) {
        this.typicalVolatility = typicalVolatility;
    }

    public String getEvolutionImmediate() {
        return evolutionImmediate;
    }

    public void setEvolutionImmediate(String evolutionImmediate) {
        this.evolutionImmediate = evolutionImmediate;
    }

    public String getEvolutionAfterHours() {
        return evolutionAfterHours;
    }

    public void setEvolutionAfterHours(String evolutionAfterHours) {
        this.evolutionAfterHours = evolutionAfterHours;
    }

    public String getEvolutionAfterDays() {
        return evolutionAfterDays;
    }

    public void setEvolutionAfterDays(String evolutionAfterDays) {
        this.evolutionAfterDays = evolutionAfterDays;
    }

    public String getFullExtractedText() {
        return fullExtractedText;
    }

    public void setFullExtractedText(String fullExtractedText) {
        this.fullExtractedText = fullExtractedText;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}