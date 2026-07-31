package com.perfume.model;

import jakarta.persistence.*;

@Entity
@Table(name = "accords")
public class Accord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(name = "name_normalized", nullable = false, unique = true)
    private String nameNormalized;

    public Accord() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getNameNormalized() { return nameNormalized; }
    public void setNameNormalized(String nameNormalized) {
this.nameNormalized = nameNormalized; }
}