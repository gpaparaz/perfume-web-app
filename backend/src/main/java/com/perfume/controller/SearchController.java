package com.perfume.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.perfume.repository.IngredientRepository;
import com.perfume.repository.IngredientRepository.IngredientSearchResult;
import com.perfume.repository.PerfumeRepository;
import com.perfume.repository.PerfumeRepository.PerfumeSearchResult;

@RestController
@RequestMapping("/api/search")
public class SearchController {

    private final PerfumeRepository perfumeRepo;
    private final IngredientRepository ingredientRepo;

    public SearchController(PerfumeRepository perfumeRepo, IngredientRepository ingredientRepo) {
        this.perfumeRepo = perfumeRepo;
        this.ingredientRepo = ingredientRepo;
    }

    @GetMapping("/perfumes")
    public List<PerfumeSearchResult> searchPerfumes(
            @RequestParam String q,
            @RequestParam(defaultValue = "8") int limit) {
        if (q == null || q.isBlank())
            return List.of();
        return perfumeRepo.search(q.trim(), Math.min(limit, 20));
    }

    @GetMapping("/ingredients")
    public List<IngredientSearchResult> searchIngredients(
            @RequestParam String q,
            @RequestParam(defaultValue = "8") int limit) {
        if (q == null || q.isBlank())
            return List.of();
        return ingredientRepo.search(q.trim(), Math.min(limit, 20));
    }
}