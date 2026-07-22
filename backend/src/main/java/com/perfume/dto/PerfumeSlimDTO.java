package com.perfume.dto;

import com.perfume.model.Perfume;

public class PerfumeSlimDTO {
    private Long id;
    private String title;
    private Integer releaseYear;

    // Costruttore, Getter e Setter
    public PerfumeSlimDTO(Long id, String title, Integer releaseYear) {
        this.id = id;
        this.title = title;
        this.releaseYear = releaseYear;
    }

    public PerfumeSlimDTO(Perfume perfume) {
        this.id = perfume.getId();
        this.title = perfume.getTitle();
        this.releaseYear = perfume.getReleaseYear();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Integer getReleaseYear() {
        return releaseYear;
    }

    public void setReleaseYear(Integer releaseYear) {
        this.releaseYear = releaseYear;
    }
}