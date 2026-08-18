import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/axios";
import type { Ingredient } from "../types";

export default function IngredientInspect() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [ingredient, setIngredient] = useState<Ingredient | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Ingredient | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFullIngredient = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const response = await api.get<Ingredient>(`/ingredient/${id}`);
        console.log(response.data);
        setIngredient(response.data);
      } catch (err) {
        console.error(
          "Errore nel recupero dei dettagli dell'ingrediente:",
          err
        );
        setError("Impossibile caricare i dettagli della materia prima.");
      } finally {
        setLoading(false);
      }
    };

    fetchFullIngredient();
  }, [id]);


   const startEdit = () => {
      if (!ingredient) return;
      setDraft({ ...ingredient });
      setSaveError(null);
      setEditing(true);
    };

    const cancelEdit = () => {
      setEditing(false);
      setDraft(null);
      setSaveError(null);
    };

    const field = (k: keyof Ingredient, v: string) =>
      setDraft((d) => (d ? { ...d, [k]: v } : d));

    const save = async () => {
      if (!draft || !id) return;
      setSaving(true);
      setSaveError(null);
      try {
        const res = await api.put<Ingredient>(`/ingredient/${id}`, draft);
        setIngredient(res.data);
        setEditing(false);
        setDraft(null);
      } catch (e) {
        console.error("Errore nel salvataggio:", e);
        setSaveError("Salvataggio non riuscito. Riprova.");
      } finally {
        setSaving(false);
      }
    };

  if (loading) {
    return (
      <div className="d-flex justify-content-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Caricamento in corso...</span>
        </div>
      </div>
    );
  }

  if (error || !ingredient) {
    return (
      <div className="container my-5 text-center">
        <div className="alert alert-danger">
          {error || "Ingrediente non trovato."}
        </div>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/ingredient")}
        >
          Torna al Glossario
        </button>
      </div>
    );
  }

  // ---------- EDIT MODE ----------
    if (editing && draft) {
      const tf = (label: string, k: keyof Ingredient, rows = 0) => (
        <div className="mb-3">
          <label className="form-label small text-muted">{label}</label>
          {rows > 0 ? (
            <textarea
              className="form-control"
              rows={rows}
              value={(draft[k] as string) ?? ""}
              onChange={(e) => field(k, e.target.value)}
            />
          ) : (
            <input
              className="form-control"
              value={(draft[k] as string) ?? ""}
              onChange={(e) => field(k, e.target.value)}
            />
          )}
        </div>
      );

      return (
        <div className="container my-5">
          <div className="card shadow-sm p-4">
            <h1 className="display-6 mb-1">{ingredient.name}</h1>
            <p className="text-muted">Modifica scheda (nome non modificabile)</p>
            {saveError && <div className="alert alert-danger">{saveError}</div>}

            <div className="row">
              <div className="col-md-6">{tf("Categoria", "category")}</div>
              <div className="col-md-6">{tf("Sottocategoria", "subcategory")}</div>
              <div className="col-md-4">{tf("Volatilità tipica", "typicalVolatility")}</div>
              <div className="col-md-4">{tf("Intensità odore", "odorStrength")}</div>
              <div className="col-md-4">{tf("Nome botanico", "botanicalName")}</div>
            </div>
            {tf("Descrizione breve", "shortDescription", 3)}
            {tf("Apparenza", "appearance", 2)}
            {tf("Paesi produttori", "producingCountries", 2)}
            {tf("Evoluzione immediata", "evolutionImmediate", 2)}
            {tf("Evoluzione dopo ore", "evolutionAfterHours", 2)}
            {tf("Evoluzione dopo giorni", "evolutionAfterDays", 2)}
            {tf("Testo completo", "fullExtractedText", 5)}
            {tf("URL foto", "imageUrl")}

            <div className="d-flex gap-2 mt-3">
              <button className="btn btn-primary" onClick={save} disabled={saving}>
                {saving ? "Salvataggio..." : "Salva"}
              </button>
              <button className="btn btn-outline-secondary" onClick={cancelEdit} disabled={saving}>
                Annulla
              </button>
            </div>
          </div>
        </div>
      );
    }

    // ---------- VIEW MODE ----------
    return (
      <div className="container my-5">
        <div className="d-flex justify-content-between mb-4">
          <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
            ← Indietro
          </button>
          <button className="btn btn-primary" onClick={startEdit}>
            Modifica
          </button>
        </div>

        <div className="card shadow-sm p-4">
          <div className="d-flex align-items-center mb-3">
            {ingredient.imageUrl && (
              <img
                src={ingredient.imageUrl}
                alt={ingredient.name}
                className="rounded me-3"
                style={{ width: 64, height: 64, objectFit: "cover" }}
              />
            )}
            <h1 className="display-5 mb-0">{ingredient.name}</h1>
            {ingredient.typicalVolatility && (
              <span className="badge bg-info text-dark ms-3 fs-6">
                {ingredient.typicalVolatility}
              </span>
            )}
          </div>

          <p className="text-muted fs-5">
            {ingredient.category}
            {ingredient.subcategory ? " — " : ""}
            <span className="text-secondary">{ingredient.subcategory}</span>
          </p>

          <hr />

          <div className="row g-4 mt-2">
            <div className="col-md-6">
              <h5>Descrizione olfattiva</h5>
              <p className="p-3 bg-light rounded">
                {ingredient.shortDescription || "Nessuna descrizione presente."}
              </p>
            </div>
            <div className="col-md-6">
              <h5>Evoluzione olfattiva</h5>
              <p className="p-3 bg-light rounded">
                {ingredient.evolutionImmediate || "Dati non disponibili."}
              </p>
              <p className="p-3 bg-light rounded">
                {ingredient.evolutionAfterHours || "Dati non disponibili."}
              </p>
              <p className="p-3 bg-light rounded">
                {ingredient.evolutionAfterDays || "Dati non disponibili."}
              </p>
            </div>
          </div>

          <table className="table table-striped table-bordered mt-3">
            <tbody>
              <tr><td>Nome botanico: {ingredient.botanicalName || "N/D"}</td></tr>
              <tr><td>Intensità odore: {ingredient.odorStrength || "N/D"}</td></tr>
              <tr><td>Apparenza: {ingredient.appearance || "N/D"}</td></tr>
              <tr><td>Paesi produttori: {ingredient.producingCountries || "N/D"}</td></tr>
            </tbody>
          </table>

          {ingredient.fullExtractedText && (
            <div className="mt-3">
              <span>{ingredient.fullExtractedText}</span>
            </div>
          )}
        </div>
      </div>
    );
  
}
