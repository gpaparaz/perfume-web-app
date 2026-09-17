package com.perfume.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.perfume.repository.BrandRepository;
import com.perfume.repository.BrandRepository.BrandOption;

@RestController
@RequestMapping("/api/brands")
public class BrandController {

    private final BrandRepository repo;

    public BrandController(BrandRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<BrandOption> all() {
        return repo.findAllByOrderByNameAsc(); 
    }
}