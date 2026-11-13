package com.perfume.dto;

import java.util.List;

import com.perfume.model.Brand;

public class BrandWithPerfumesDTO {
    private Long id;
    private String name;
    private List<PerfumeSlimDTO> perfumes;
    private String logoUrl;

    // Constructor converting from the entity
    public BrandWithPerfumesDTO(Brand brand) {
        this.id = brand.getId();
        this.name = brand.getName();
        this.logoUrl = brand.getLogoUrl();

        // brand.getPerfumes() holds Perfume entities: map them to the perfume
        // DTOs:
        if (brand.getPerfumes() != null) {
            this.perfumes = brand.getPerfumes().stream()
                    .map(PerfumeSlimDTO::new)
                    .toList();
        }
    }

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

    public String getLogoUrl() {
        return logoUrl;
    }

    public void setLogoUrl(String logoUrl) {
        this.logoUrl = logoUrl;
    }

}