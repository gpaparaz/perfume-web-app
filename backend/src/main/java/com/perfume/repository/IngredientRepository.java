package com.perfume.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.perfume.dto.IngredientSummaryDTO;
import com.perfume.model.Ingredient;

@Repository
public interface IngredientRepository extends JpaRepository<Ingredient, Long> {
    public interface IngredientSearchResult {
        Long getId();

        String getName();

        String getImageUrl();
    }

    List<Ingredient> findByNameStartingWithIgnoreCaseOrderByNameAsc(String letter);

    List<Ingredient> findAllByOrderByNameAsc();

    // La query istanzia direttamente il DTO leggendo solo 5 colonne dal DB
    @Query("SELECT new com.perfume.dto.IngredientSummaryDTO(i.id, i.name, i.category, i.subcategory, i.typicalVolatility, i.imageUrl) "
            +
            "FROM Ingredient i ORDER BY i.name ASC")
    List<IngredientSummaryDTO> findAllSummaries();

    @Query(value = """
            SELECT id AS id, name AS name, image_url AS imageUrl
            FROM ingredients
            WHERE name ILIKE CONCAT(:q, '%') OR name % :q
            ORDER BY similarity(name, :q) DESC
            LIMIT :limit
            """, nativeQuery = true)
    List<IngredientSearchResult> search(@Param("q") String q, @Param("limit") int limit);

}