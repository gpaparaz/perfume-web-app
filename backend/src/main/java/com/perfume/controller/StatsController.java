package com.perfume.controller;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.perfume.dto.StatsDTO;

@RestController
@RequestMapping("/api/stats")
public class StatsController {

    private final JdbcTemplate jdbc;

    public StatsController(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    // Headline counts for the home page, in a single round trip.
    @GetMapping
    public StatsDTO stats() {
        return jdbc.queryForObject(
                "SELECT (SELECT count(*) FROM perfumes) AS perfumes, "
                        + "(SELECT count(*) FROM brands) AS brands, "
                        + "(SELECT count(*) FROM ingredients) AS ingredients, "
                        + "(SELECT count(*) FROM accords) AS accords",
                (rs, i) -> new StatsDTO(
                        rs.getLong("perfumes"),
                        rs.getLong("brands"),
                        rs.getLong("ingredients"),
                        rs.getLong("accords")));
    }
}
