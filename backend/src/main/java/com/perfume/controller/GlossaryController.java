package com.perfume.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.perfume.model.Ingredient;
import com.perfume.service.IngredientService;

@RestController
@RequestMapping("/api/glossary")
@CrossOrigin(origins = "http://localhost:5173")
public class GlossaryController {
    @Autowired
    private IngredientService ingredientService;

    @GetMapping
    public ResponseEntity<List<Ingredient>> getGlossary(@RequestParam(required = false) String letter) {
        List<Ingredient> ingredients = ingredientService.getIngredientsByLetter(letter);
        return ResponseEntity.ok(ingredients);
    }
}