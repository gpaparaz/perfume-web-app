package com.perfume.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.perfume.model.Brand;

@Repository
public interface BrandRepository extends JpaRepository<Brand, Long> {

    public interface BrandOption {
      Long getId();
      String getName();
    }

    // Fetches brands by initial and loads their perfumes in a single query
    @Query("SELECT DISTINCT b FROM Brand b " +
            "LEFT JOIN FETCH b.perfumes " +
            "WHERE LOWER(b.name) LIKE LOWER(CONCAT(:letter, '%')) " +
            "ORDER BY b.name ASC")
    List<Brand> findBrandsByInitialWithPerfumes(@Param("letter") String initial);
    List<BrandOption> findAllByOrderByNameAsc();
}