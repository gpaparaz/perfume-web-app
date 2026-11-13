import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdvancedSearch } from "../hooks/useAdvancedSearch";
import NotePicker from "./NotePicker";

export default function AdvancedSearch() {
  const {
    brands,
    accords,
    optionsError,
    filters,
    updateFilters,
    toggleAccord,
    addNote,
    removeNote,
    reset,
    hasFilters,
    page,
    setPage,
    result,
    loading,
    error,
  } = useAdvancedSearch();
  const navigate = useNavigate();

  // Text typed in the brand box; it maps to brandId only on an exact match
  // with one of the datalist options.
  const [brandText, setBrandText] = useState("");
  const brandIdByName = useMemo(
    () => new Map(brands.map((b) => [b.name.toLowerCase(), b.id])),
    [brands]
  );

  // Accords not yet chosen: already-selected ones live in the chips only.
  const availableAccords = useMemo(
    () => accords.filter((a) => !filters.accordIds.includes(a.id)),
    [accords, filters.accordIds]
  );

  const accordNameById = useMemo(
    () => new Map(accords.map((a) => [a.id, a.name])),
    [accords]
  );

  function handleBrandChange(value: string) {
    setBrandText(value);
    const id = brandIdByName.get(value.trim().toLowerCase()) ?? null;
    if (id !== filters.brandId) updateFilters({ brandId: id });
  }

  function handleReset() {
    reset();
    setBrandText("");
  }

  const brandUnmatched = brandText.trim() !== "" && filters.brandId === null;

  return (
    <div className="container my-4">
      <h1 className="h3 mb-4">Ricerca avanzata</h1>

      {optionsError && (
        <div className="alert alert-warning py-2">{optionsError}</div>
      )}

      <div className="row g-4">
        {/* Filters */}
        <aside className="col-lg-4">
          <div className="card shadow-sm">
            <div className="card-body d-flex flex-column gap-3">
              <div>
                <label htmlFor="as-name" className="form-label fw-semibold">
                  Nome
                </label>
                <input
                  id="as-name"
                  type="text"
                  className="form-control"
                  placeholder="Contiene..."
                  value={filters.name}
                  onChange={(e) => updateFilters({ name: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="as-brand" className="form-label fw-semibold">
                  Brand
                </label>
                <input
                  id="as-brand"
                  type="text"
                  list="as-brand-options"
                  className={`form-control ${brandUnmatched ? "is-invalid" : ""}`}
                  placeholder="Scegli un brand..."
                  value={brandText}
                  onChange={(e) => handleBrandChange(e.target.value)}
                />
                <datalist id="as-brand-options">
                  {brands.map((b) => (
                    <option key={b.id} value={b.name} />
                  ))}
                </datalist>
                {brandUnmatched && (
                  <div className="invalid-feedback">
                    Seleziona un brand dall'elenco.
                  </div>
                )}
              </div>

              <div>
                <span className="form-label fw-semibold d-block">
                  Anno di uscita
                </span>
                <div className="input-group">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Dal"
                    aria-label="Anno dal"
                    value={filters.yearFrom}
                    onChange={(e) => updateFilters({ yearFrom: e.target.value })}
                  />
                  <span className="input-group-text">–</span>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Al"
                    aria-label="Anno al"
                    value={filters.yearTo}
                    onChange={(e) => updateFilters({ yearTo: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <span className="form-label fw-semibold d-block">
                  Note <span className="text-muted fw-normal small">(tutte)</span>
                </span>
                <NotePicker
                  selected={filters.notes}
                  onAdd={addNote}
                  onRemove={removeNote}
                />
              </div>

              <div>
                <span className="form-label fw-semibold d-block">
                  Accordi <span className="text-muted fw-normal small">(tutti)</span>
                </span>

                {filters.accordIds.length > 0 && (
                  <div className="d-flex flex-wrap gap-1 mb-2">
                    {filters.accordIds.map((id) => {
                      const name = accordNameById.get(id) ?? String(id);
                      return (
                        <span
                          key={id}
                          className="badge rounded-pill text-bg-secondary d-inline-flex align-items-center gap-1"
                        >
                          {name}
                          <button
                            type="button"
                            className="btn-close btn-close-white"
                            style={{ fontSize: "0.5rem" }}
                            aria-label={`Rimuovi ${name}`}
                            onClick={() => toggleAccord(id)}
                          />
                        </span>
                      );
                    })}
                  </div>
                )}

                {/* Picking an option adds it as a chip; the select then
                    resets so more accords can be added one after another. */}
                <select
                  className="form-select"
                  aria-label="Aggiungi un accordo"
                  value=""
                  onChange={(e) => {
                    const id = Number(e.target.value);
                    if (id) toggleAccord(id);
                  }}
                  disabled={availableAccords.length === 0}
                >
                  <option value="">
                    {accords.length === 0
                      ? "Caricamento accordi..."
                      : availableAccords.length === 0
                        ? "Tutti gli accordi selezionati"
                        : "Aggiungi un accordo..."}
                  </option>
                  {availableAccords.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={handleReset}
                disabled={!hasFilters && brandText === ""}
              >
                Azzera filtri
              </button>
            </div>
          </div>
        </aside>

        {/* Results */}
        <section className="col-lg-8">
          {!hasFilters && (
            <div className="text-muted text-center py-5">
              Imposta almeno un filtro per iniziare la ricerca.
            </div>
          )}

          {hasFilters && error && (
            <div className="alert alert-danger">{error}</div>
          )}

          {hasFilters && !error && (
            <>
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted small">
                  {result
                    ? `${result.totalElements.toLocaleString("it-IT")} profumi trovati`
                    : "Ricerca in corso..."}
                </span>
                {loading && (
                  <span
                    className="spinner-border spinner-border-sm text-secondary"
                    role="status"
                    aria-label="Caricamento"
                  />
                )}
              </div>

              {result && result.content.length === 0 && (
                <div className="text-muted text-center py-5">
                  Nessun profumo corrisponde ai filtri.
                </div>
              )}

              {result && result.content.length > 0 && (
                <div
                  className="list-group shadow-sm"
                  style={{ opacity: loading ? 0.6 : 1 }}
                >
                  {result.content.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      className="list-group-item list-group-item-action d-flex align-items-center gap-3"
                      onClick={() => navigate(`/perfumes/${p.id}`)}
                    >
                      {p.imageUrl ? (
                        <img
                          src={p.imageUrl}
                          alt=""
                          className="rounded flex-shrink-0"
                          style={{ width: "3rem", height: "3rem", objectFit: "cover" }}
                          loading="lazy"
                        />
                      ) : (
                        <div
                          className="rounded bg-body-secondary flex-shrink-0"
                          style={{ width: "3rem", height: "3rem" }}
                        />
                      )}
                      <div className="flex-grow-1 text-start text-truncate">
                        <div className="fw-semibold text-truncate">{p.title}</div>
                        <div className="small text-muted text-truncate">
                          {p.brandName}
                        </div>
                      </div>
                      {p.releaseYear && (
                        <span className="badge text-bg-light">{p.releaseYear}</span>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {result && result.totalPages > 1 && (
                <nav
                  className="d-flex align-items-center justify-content-between mt-3"
                  aria-label="Paginazione risultati"
                >
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    disabled={page === 0 || loading}
                    onClick={() => setPage(page - 1)}
                  >
                    ← Precedente
                  </button>
                  <span className="small text-muted">
                    Pagina {page + 1} di {result.totalPages}
                  </span>
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    disabled={page >= result.totalPages - 1 || loading}
                    onClick={() => setPage(page + 1)}
                  >
                    Successiva →
                  </button>
                </nav>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}
