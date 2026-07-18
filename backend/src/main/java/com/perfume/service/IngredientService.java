package com.perfume.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
}