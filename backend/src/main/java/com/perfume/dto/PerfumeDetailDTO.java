package com.perfume.dto;

import java.util.ArrayList;
import java.util.List;

import com.perfume.model.Ingredient;
import com.perfume.model.Perfume;
import com.perfume.model.PerfumeAccord;
import com.perfume.model.PerfumeNote;

public class PerfumeDetailDTO {
    private Long id;
    private String title;
    private String description;
    private Integer releaseYear;
    private String perfumer;
    private String imageUrl;
    private Long brandId;
    private String brandName;
    private List<NoteDTO> top = new ArrayList<>();
    private List<NoteDTO> heart = new ArrayList<>();
    private List<NoteDTO> base = new ArrayList<>();
    private List<AccordDTO> accords = new ArrayList<>();

    public static PerfumeDetailDTO from(Perfume p, List<PerfumeNote>
notes, List<PerfumeAccord> accs) {
        PerfumeDetailDTO d = new PerfumeDetailDTO();
        d.id = p.getId();
        d.title = p.getTitle();
        d.description = p.getDescription();
        d.releaseYear = p.getReleaseYear();
        d.perfumer = p.getPerfumer();
        d.imageUrl = p.getImageUrl();
        if (p.getBrand() != null) {
            d.brandId = p.getBrand().getId();
            d.brandName = p.getBrand().getName();
        }
        for (PerfumeNote n : notes) {
            Ingredient ing = n.getIngredient();
            NoteDTO nd = new NoteDTO(ing.getId(), ing.getName(),
ing.getImageUrl(), ing.isFromGlossary());
            String layer = n.getLayer() == null ? "" :
n.getLayer().toLowerCase();
            if (layer.equals("top")) d.top.add(nd);
            else if (layer.equals("heart")) d.heart.add(nd);
            else d.base.add(nd);
        }
        for (PerfumeAccord a : accs) {
            d.accords.add(new AccordDTO(a.getAccord().getId(),
a.getAccord().getName(), a.getRank()));
        }
        return d;
    }

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public Integer getReleaseYear() { return releaseYear; }
    public String getPerfumer() { return perfumer; }
    public String getImageUrl() { return imageUrl; }
    public Long getBrandId() { return brandId; }
    public String getBrandName() { return brandName; }
    public List<NoteDTO> getTop() { return top; }
    public List<NoteDTO> getHeart() { return heart; }
    public List<NoteDTO> getBase() { return base; }
    public List<AccordDTO> getAccords() { return accords; }

    public static class NoteDTO {
        private Long ingredientId;
        private String name;
        private String imageUrl;
        private boolean fromGlossary;

        public NoteDTO(Long ingredientId, String name, String imageUrl,
boolean fromGlossary) {
            this.ingredientId = ingredientId;
            this.name = name;
            this.imageUrl = imageUrl;
            this.fromGlossary = fromGlossary;
        }

        public Long getIngredientId() { return ingredientId; }
        public String getName() { return name; }
        public String getImageUrl() { return imageUrl; }
        public boolean isFromGlossary() { return fromGlossary; }
    }

    public static class AccordDTO {
        private Long id;
        private String name;
        private Integer rank;

        public AccordDTO(Long id, String name, Integer rank) {
            this.id = id;
            this.name = name;
            this.rank = rank;
        }

        public Long getId() { return id; }
        public String getName() { return name; }
        public Integer getRank() { return rank; }
    }
}