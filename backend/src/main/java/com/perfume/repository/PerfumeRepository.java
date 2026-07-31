package com.perfume.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.perfume.model.Perfume;

@Repository
public interface PerfumeRepository extends JpaRepository<Perfume, Long> {
}