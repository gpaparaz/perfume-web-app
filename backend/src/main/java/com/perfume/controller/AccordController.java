package com.perfume.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.perfume.model.Accord;
import com.perfume.repository.AccordRepository;

@RestController
@RequestMapping("/api/accords")
public class AccordController {

    private final AccordRepository repo;

    public AccordController(AccordRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Accord> all() {
        return repo.findAllByOrderByNameAsc();
    }
}