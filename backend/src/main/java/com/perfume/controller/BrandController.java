package com.perfume.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.perfume.dto.BrandOptionDTO;
import com.perfume.repository.BrandRepository;

@RestController
@RequestMapping("/api/brands")
public class BrandController {

    private final BrandRepository repo;

    public BrandController(BrandRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<BrandOptionDTO> all() {
        return repo.findAllOptions();
    }
}