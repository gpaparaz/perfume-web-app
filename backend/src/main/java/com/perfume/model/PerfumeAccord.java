package com.perfume.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@Table(name = "perfume_accords")
public class PerfumeAccord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "perfume_id", nullable = false)
    @JsonIgnoreProperties({ "notes", "accords", "brand" })
    private Perfume perfume;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "accord_id", nullable = false)
    private Accord accord;

    // la colonna e' SMALLINT: se ddl-auto=validate protesta, cambia in
"Short"
    private Integer rank;

    public PerfumeAccord() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Perfume getPerfume() { return perfume; }
    public void setPerfume(Perfume perfume) { this.perfume = perfume; }
    public Accord getAccord() { return accord; }
    public void setAccord(Accord accord) { this.accord = accord; }
    public Integer getRank() { return rank; }
    public void setRank(Integer rank) { this.rank = rank; }
}