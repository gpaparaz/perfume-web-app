package com.perfume.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.perfume.dto.IngredientSummaryDTO;
import com.perfume.model.Ingredient;

@Repository
public interface IngredientRepository extends JpaRepository<Ingredient, Long> {
    List<Ingredient> findByNameStartingWithIgnoreCaseOrderByNameAsc(String letter);

    List<Ingredient> findAllByOrderByNameAsc();

    // La query istanzia direttamente il DTO leggendo solo 5 colonne dal DB
    @Query("SELECT new com.perfume.dto.IngredientSummaryDTO(i.id, i.name, i.category, i.subcategory, i.typicalVolatility) "
            +
            "FROM Ingredient i ORDER BY i.name ASC")
    List<IngredientSummaryDTO> findAllSummaries();

}