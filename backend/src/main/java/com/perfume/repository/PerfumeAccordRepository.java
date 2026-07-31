package com.perfume.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.perfume.model.PerfumeAccord;

@Repository
public interface PerfumeAccordRepository extends
JpaRepository<PerfumeAccord, Long> {
    List<PerfumeAccord> findByPerfume_IdOrderByRankAsc(Long perfumeId);
}