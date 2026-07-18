package com.perfume.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.perfume.dto.IngredientSummaryDTO;
import com.perfume.model.Ingredient;
import com.perfume.service.IngredientService;

@RestController
@RequestMapping("/api/glossary")
@CrossOrigin(origins = "http://localhost:5173")
public class GlossaryController {
    @Autowired
    private IngredientService ingredientService;

    // 1. Endpoint globale: restituisce solo i dati minimi
    @GetMapping
    public ResponseEntity<List<IngredientSummaryDTO>> getGlossarySummary() {
        return ResponseEntity.ok(ingredientService.getAllIngredientSummaries());
    }

    // 2. Endpoint Inspect: restituisce l'ingrediente completo con TUTTE le colonne
    // per ID
    @GetMapping("/{id}")
    public ResponseEntity<Ingredient> getIngredientById(@PathVariable Long id) {
        return ingredientService.getIngredientById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}