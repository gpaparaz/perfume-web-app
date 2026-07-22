package com.perfume.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.perfume.model.Brand;

@Repository
public interface BrandRepository extends JpaRepository<Brand, Long> {

    // Recupera i brand per iniziale e carica i profumi associati in un colpo solo
    @Query("SELECT DISTINCT b FROM Brand b LEFT JOIN FETCH b.perfumes ORDER BY b.name ASC")
    List<Brand> findBrandsByInitialWithPerfumes();
}