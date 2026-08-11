package com.perfume.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.perfume.dto.BrandWithPerfumesDTO;
import com.perfume.dto.PerfumeDetailDTO;
import com.perfume.service.PerfumeService;

@RestController
@RequestMapping("/api/perfumes")
public class PerfumeController {

    @Autowired
    private PerfumeService perfumeService;

    @GetMapping("/detail/{id}")
    public ResponseEntity<PerfumeDetailDTO> getPerfumeDetail(@PathVariable Long id) {
        PerfumeDetailDTO d = perfumeService.getPerfumeDetail(id);
        return d == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(d);
    }

    @GetMapping("{letter}")
    public ResponseEntity<List<BrandWithPerfumesDTO>> getBrandWithPerfumes(@PathVariable String letter) {
        return ResponseEntity.ok(perfumeService.getAllBrandsWithPerfumes(letter));
    }

}
