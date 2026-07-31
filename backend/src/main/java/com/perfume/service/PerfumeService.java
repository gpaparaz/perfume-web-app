package com.perfume.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.perfume.dto.BrandWithPerfumesDTO;
import com.perfume.model.Brand;
import com.perfume.repository.BrandRepository;

@Service
public class PerfumeService {

    @Autowired
    private BrandRepository brandRepository;

    @Autowired
    private PerfumeRepository perfumeRepository;
    @Autowired
    private PerfumeNoteRepository perfumeNoteRepository;
    @Autowired
    private PerfumeAccordRepository perfumeAccordRepository;

    public List<BrandWithPerfumesDTO> getAllBrandsWithPerfumes(String letter) {
        if (letter != null && !letter.trim().isEmpty()) {
            List<Brand> brands = brandRepository.findBrandsByInitialWithPerfumes(letter.trim());

            // 2. Converte ogni Brand nel suo DTO corrispondente
            return brands.stream()
                    .map(BrandWithPerfumesDTO::new)
                    .toList();
        }
        // 1. Recupera la lista di entità Brand dal DB
        List<Brand> brands = brandRepository.findBrandsByInitialWithPerfumes(letter);

        // 2. Converte ogni Brand nel suo DTO corrispondente
        return brands.stream()
                .map(BrandWithPerfumesDTO::new)
                .toList();
    }

    @Transactional(readOnly = true)
    public PerfumeDetailDTO getPerfumeDetail(Long id) {
        Perfume p = perfumeRepository.findById(id).orElse(null);
        if (p == null) return null;
        return PerfumeDetailDTO.from(
                p,
                perfumeNoteRepository.findByPerfume_Id(id),

        perfumeAccordRepository.findByPerfume_IdOrderByRankAsc(id));
    }

}
