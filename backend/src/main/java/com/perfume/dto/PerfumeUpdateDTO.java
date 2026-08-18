package com.perfume.dto;

  public class PerfumeUpdateDTO {
      private String description;
      private Integer releaseYear;
      private String perfumer;
      private String imageUrl;

      public PerfumeUpdateDTO() {}

      public String getDescription() { return description; }
      public void setDescription(String v) { this.description = v; }
      public Integer getReleaseYear() { return releaseYear; }
      public void setReleaseYear(Integer v) { this.releaseYear = v; }
      public String getPerfumer() { return perfumer; }
      public void setPerfumer(String v) { this.perfumer = v; }
      public String getImageUrl() { return imageUrl; }
      public void setImageUrl(String v) { this.imageUrl = v; }
  }