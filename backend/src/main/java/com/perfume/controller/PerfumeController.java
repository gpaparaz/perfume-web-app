package com.perfume.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.perfume.dto.BrandWithPerfumesDTO;
import com.perfume.service.PerfumeService;

@RestController
@RequestMapping("/api/perfumes")
@CrossOrigin(origins = "http://localhost:5173")
public class PerfumeController {

    @Autowired
    private PerfumeService perfumeService;

    @GetMapping
    public ResponseEntity<List<BrandWithPerfumesDTO>> getBrandWithPerfumes() {
        return ResponseEntity.ok(perfumeService.getAllBrandsWithPerfumes());
    }

}
