package com.perfume.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.perfume.model.PerfumeNote;

@Repository
public interface PerfumeNoteRepository extends JpaRepository<PerfumeNote, Long> {
    List<PerfumeNote> findByPerfume_Id(Long perfumeId);
}