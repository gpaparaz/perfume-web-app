package com.perfume.dto;

  public class IngredientUpdateDTO {
      private String category;
      private String subcategory;
      private String shortDescription;
      private String botanicalName;
      private String appearance;
      private String odorStrength;
      private String producingCountries;
      private String typicalVolatility;
      private String evolutionImmediate;
      private String evolutionAfterHours;
      private String evolutionAfterDays;
      private String fullExtractedText;
      private String imageUrl;

      public IngredientUpdateDTO() {}

      public String getCategory() { return category; }
      public void setCategory(String v) { this.category = v; }
      public String getSubcategory() { return subcategory; }
      public void setSubcategory(String v) { this.subcategory = v; }
      public String getShortDescription() { return shortDescription; }
      public void setShortDescription(String v) { this.shortDescription = v; }
      public String getBotanicalName() { return botanicalName; }
      public void setBotanicalName(String v) { this.botanicalName = v; }
      public String getAppearance() { return appearance; }
      public void setAppearance(String v) { this.appearance = v; }
      public String getOdorStrength() { return odorStrength; }
      public void setOdorStrength(String v) { this.odorStrength = v; }
      public String getProducingCountries() { return producingCountries; }
      public void setProducingCountries(String v) { this.producingCountries = v; }
      public String getTypicalVolatility() { return typicalVolatility; }
      public void setTypicalVolatility(String v) { this.typicalVolatility = v; }
      public String getEvolutionImmediate() { return evolutionImmediate; }
      public void setEvolutionImmediate(String v) { this.evolutionImmediate = v; }
      public String getEvolutionAfterHours() { return evolutionAfterHours; }
      public void setEvolutionAfterHours(String v) { this.evolutionAfterHours = v; }
      public String getEvolutionAfterDays() { return evolutionAfterDays; }
      public void setEvolutionAfterDays(String v) { this.evolutionAfterDays = v; }
      public String getFullExtractedText() { return fullExtractedText; }
      public void setFullExtractedText(String v) { this.fullExtractedText = v; }
      public String getImageUrl() { return imageUrl; }
      public void setImageUrl(String v) { this.imageUrl = v; }
  }