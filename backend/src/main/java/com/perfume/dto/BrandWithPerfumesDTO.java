package com.perfume.dto;

import java.util.List;

public class BrandWithPerfumesDTO {
    private Long id;
    private String name;
    private List<PerfumeSlimDTO> perfumes;

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

    public List<PerfumeSlimDTO> getPerfumes() {
        return perfumes;
    }

    public void setPerfumes(List<PerfumeSlimDTO> perfumes) {
        this.perfumes = perfumes;
    }

    public BrandWithPerfumesDTO(Long id, String name, List<PerfumeSlimDTO> perfumes) {
        this.id = id;
        this.name = name;
        this.perfumes = perfumes;
    }

}