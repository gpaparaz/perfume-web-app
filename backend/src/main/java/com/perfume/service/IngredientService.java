package com.perfume.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.perfume.dto.IngredientSummaryDTO;
import com.perfume.model.Ingredient;
import com.perfume.repository.IngredientRepository;

@Service
public class IngredientService {
    @Autowired
    private IngredientRepository ingredientRepository;

    public List<Ingredient> getIngredientsByLetter(String letter) {
        if (letter != null && !letter.trim().isEmpty()) {
            return ingredientRepository.findByNameStartingWithIgnoreCaseOrderByNameAsc(letter.trim());
        }
        return ingredientRepository.findAllByOrderByNameAsc();
    }

    // 1. Recupera la lista leggera per il glossario globale
    public List<IngredientSummaryDTO> getAllIngredientSummaries() {
        return ingredientRepository.findAllSummaries();
    }

    // 2. Recupera l'ingrediente completo per l'Inspect tramite ID
    public Optional<Ingredient> getIngredientById(Long id) {
        return ingredientRepository.findById(id);
    }
}