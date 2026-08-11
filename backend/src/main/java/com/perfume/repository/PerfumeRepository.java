package com.perfume.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.perfume.model.Perfume;

@Repository
public interface PerfumeRepository extends JpaRepository<Perfume, Long> {
    public interface PerfumeSearchResult {
        Long getId();

        String getTitle();

        String getBrandName();

        String getImageUrl();
    }

    @Query(value = """
            SELECT p.id AS id, p.title AS title, b.name AS "brandName", p.image_url AS "imageUrl"
            FROM perfumes p
            JOIN brands b ON b.id = p.brand_id
            WHERE p.title ILIKE CONCAT(:q, '%') OR p.title % :q
            ORDER BY similarity(p.title, :q) DESC
            LIMIT :limit
            """, nativeQuery = true)
    List<PerfumeSearchResult> search(@Param("q") String q, @Param("limit") int limit);
}