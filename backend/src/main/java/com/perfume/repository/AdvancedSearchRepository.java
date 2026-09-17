package com.perfume.repository;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.perfume.dto.PerfumeSearchRowDTO;

@Repository
public class AdvancedSearchRepository {

    private final JdbcTemplate jdbc;

    public AdvancedSearchRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    private record Where(String sql, List<Object> params) {
    }

    private static String placeholders(int n) {
        return String.join(",", Collections.nCopies(n, "?"));
    }

    private Where buildWhere(String name, Long brandId, List<Long> accordIds, List<Long> noteIds, Integer yearFrom, Integer yearTo) {
        StringBuilder sb = new StringBuilder(" WHERE 1 = 1");
        List<Object> p = new ArrayList<>();

        if (name != null && !name.isBlank()) {
            sb.append(" AND p.title ILIKE ?");
            p.add("%" + name.trim() + "%");
        }
        if (brandId != null) {
            sb.append(" AND p.brand_id = ?");
            p.add(brandId);
        }
        if (yearFrom != null) {
            sb.append(" AND p.release_year >= ?");
            p.add(yearFrom);
        }
        if (yearTo != null) {
            sb.append(" AND p.release_year <= ?");
            p.add(yearTo);
        }
        // "Li deve avere tutti": si parte dal lato indicizzato (accord_id /
        // ingredient_id) per costruire i candidati, invece di valutare una
        // subquery su ognuno dei ~112k profumi.
        if (accordIds != null && !accordIds.isEmpty()) {
            sb.append(" AND p.id IN (SELECT pa.perfume_id FROM perfume_accords pa WHERE pa.accord_id IN (")
                    .append(placeholders(accordIds.size()))
                    .append(") GROUP BY pa.perfume_id HAVING count(DISTINCT pa.accord_id) = ?)");
            p.addAll(accordIds);
            p.add(accordIds.size());
        }
        if (noteIds != null && !noteIds.isEmpty()) {
            sb.append(" AND p.id IN (SELECT pn.perfume_id FROM perfume_notes pn WHERE pn.ingredient_id IN (")
                    .append(placeholders(noteIds.size()))
                    .append(") GROUP BY pn.perfume_id HAVING count(DISTINCT pn.ingredient_id) = ?)");
            p.addAll(noteIds);
            p.add(noteIds.size());
        }
        return new Where(sb.toString(), p);
    }

    public long count(String name, Long brandId, List<Long> accordIds, List<Long> noteIds, Integer yearFrom, Integer yearTo) {
        Where w = buildWhere(name, brandId, accordIds, noteIds, yearFrom, yearTo);
        String sql = "SELECT count(*) FROM perfumes p JOIN brands b ON b.id = p.brand_id" + w.sql();
        Long n = jdbc.queryForObject(sql, Long.class, w.params().toArray());
        return n == null ? 0 : n;
    }

    public List<PerfumeSearchRowDTO> search(String name, Long brandId, List<Long> accordIds, List<Long> noteIds, Integer yearFrom, Integer yearTo, int page, int size) {
        Where w = buildWhere(name, brandId, accordIds, noteIds, yearFrom, yearTo);
        StringBuilder sb = new StringBuilder(
                "SELECT p.id, p.title, b.name AS brand_name, p.release_year, p.image_url "
                        + "FROM perfumes p JOIN brands b ON b.id = p.brand_id").append(w.sql());
        List<Object> params = new ArrayList<>(w.params());

        // Priorita' di rilevanza: piu' gli accordi scelti sono dominanti (rank
        // basso), piu' il profumo e' caratteristico. Senza accordi non c'e'
        // segnale, quindi alfabetico.
        if (accordIds != null && !accordIds.isEmpty()) {
            sb.append(" ORDER BY (SELECT COALESCE(sum(pa.rank), 0) FROM perfume_accords pa")
                    .append(" WHERE pa.perfume_id = p.id AND pa.accord_id IN (")
                    .append(placeholders(accordIds.size()))
                    .append(")) ASC, b.name ASC, p.title ASC");
            params.addAll(accordIds);
        } else {
            sb.append(" ORDER BY b.name ASC, p.title ASC");
        }
        sb.append(" LIMIT ? OFFSET ?");
        params.add(size);
        params.add((long) page * size);

        return jdbc.query(sb.toString(), (rs, i) -> new PerfumeSearchRowDTO(
                rs.getLong("id"),
                rs.getString("title"),
                rs.getString("brand_name"),
                (Integer) rs.getObject("release_year"),
                rs.getString("image_url")), params.toArray());
    }
}