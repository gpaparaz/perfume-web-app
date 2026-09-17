package com.perfume.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.perfume.model.Accord;

@Repository
public interface AccordRepository extends JpaRepository<Accord, Long> {
    List<Accord> findAllByOrderByNameAsc();
}