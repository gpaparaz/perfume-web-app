package com.perfume.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.perfume.dto.PageDTO;
import com.perfume.dto.PerfumeSearchRowDTO;
import com.perfume.repository.AdvancedSearchRepository;

import com.perfume.repository.IngredientRepository;
import com.perfume.repository.IngredientRepository.IngredientSearchResult;
import com.perfume.repository.PerfumeRepository;
import com.perfume.repository.PerfumeRepository.PerfumeSearchResult;


@RestController
@RequestMapping("/api/search")
public class SearchController {

    private final PerfumeRepository perfumeRepo;
    private final IngredientRepository ingredientRepo;
    private final AdvancedSearchRepository advancedRepo;

    public SearchController(PerfumeRepository perfumeRepo, IngredientRepository ingredientRepo, AdvancedSearchRepository advancedSearchRepository) {
        this.perfumeRepo = perfumeRepo;
        this.ingredientRepo = ingredientRepo;
        this.advancedRepo = advancedSearchRepository;
    }

    @GetMapping("/perfumes")
    public List<PerfumeSearchResult> searchPerfumes(
            @RequestParam String q,
            @RequestParam(defaultValue = "8") int limit) {
        if (q == null || q.isBlank())
            return List.of();
        return perfumeRepo.search(q.trim(), Math.min(limit, 50));
    }

    @GetMapping("/ingredients")
    public List<IngredientSearchResult> searchIngredients(
            @RequestParam String q,
            @RequestParam(defaultValue = "8") int limit) {
        if (q == null || q.isBlank())
            return List.of();
        return ingredientRepo.search(q.trim(), Math.min(limit, 50));
    }

    @GetMapping("/perfumes/advanced")
    public PageDTO<PerfumeSearchRowDTO> advanced(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Long brandId,
            @RequestParam(required = false) List<Long> accordIds,
            @RequestParam(required = false) List<Long> noteIds,
            @RequestParam(required = false) Integer yearFrom,
            @RequestParam(required = false) Integer yearTo,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "25") int size) {

        int safeSize = Math.min(Math.max(size, 1), 100);
        int safePage = Math.max(page, 0);

        long total = advancedRepo.count(name, brandId, accordIds, noteIds, yearFrom, yearTo);
        List<PerfumeSearchRowDTO> content = total == 0
                ? List.of()
                : advancedRepo.search(name, brandId, accordIds, noteIds, yearFrom, yearTo, safePage, safeSize);

        int totalPages = (int) Math.ceil((double) total / safeSize);
        return new PageDTO<>(content, safePage, safeSize, total, totalPages);
    }
}