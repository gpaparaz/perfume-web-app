import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/axios";
import type { Ingredient } from "../types";
import { downloadText, toCsv } from "../utils/download";
import { noteImage } from "../utils/noteImage";

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
          "Failed to fetch ingredient details:",
          err
        );
        setError("Could not load the raw material details.");
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
      console.error("Save failed:", e);
      setSaveError("Save failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const exportCsv = () => {
    if (!ingredient) return;
    const headers = [
      "id",
      "name",
      "category",
      "subcategory",
      "botanical_name",
      "typical_volatility",
      "odor_strength",
      "short_description",
      "appearance",
      "producing_countries",
      "evolution_immediate",
      "evolution_after_hours",
      "evolution_after_days",
      "full_extracted_text",
      "source_url",
      "image_url",
      "from_glossary",
    ];
    const i = ingredient;
    const row = [
      i.id,
      i.name,
      i.category,
      i.subcategory,
      i.botanicalName,
      i.typicalVolatility,
      i.odorStrength,
      i.shortDescription,
      i.appearance,
      i.producingCountries,
      i.evolutionImmediate,
      i.evolutionAfterHours,
      i.evolutionAfterDays,
      i.fullExtractedText,
      i.sourceUrl,
      i.imageUrl,
      i.fromGlossary,
    ];
    downloadText(`${i.name || "ingredient"}.csv`, toCsv(headers, [row]));
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error || !ingredient) {
    return (
      <div className="container my-5 text-center">
        <div className="alert alert-danger">
          {error || "Ingredient not found."}
        </div>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/ingredient")}
        >
          Back to Glossary
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
          <p className="text-muted">Edit sheet (name is read-only)</p>
          {saveError && <div className="alert alert-danger">{saveError}</div>}

          <div className="row">
            <div className="col-md-6">{tf("Category", "category")}</div>
            <div className="col-md-6">
              {tf("Subcategory", "subcategory")}
            </div>
            <div className="col-md-4">
              {tf("Typical volatility", "typicalVolatility")}
            </div>
            <div className="col-md-4">
              {tf("Odor strength", "odorStrength")}
            </div>
            <div className="col-md-4">
              {tf("Botanical name", "botanicalName")}
            </div>
          </div>
          {tf("Short description", "shortDescription", 3)}
          {tf("Appearance", "appearance", 2)}
          {tf("Producing countries", "producingCountries", 2)}
          {tf("Immediate evolution", "evolutionImmediate", 2)}
          {tf("Evolution after hours", "evolutionAfterHours", 2)}
          {tf("Evolution after days", "evolutionAfterDays", 2)}
          {tf("Full text", "fullExtractedText", 5)}
          {tf("Photo URL", "imageUrl")}

          <div className="d-flex gap-2 mt-3">
            <button
              className="btn btn-primary"
              onClick={save}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              className="btn btn-outline-secondary"
              onClick={cancelEdit}
              disabled={saving}
            >
              Cancel
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
        <div>
          <button
            className="btn btn-outline-secondary"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>
        </div>
        <div>
          <button className="btn btn-primary" onClick={startEdit}>
            Edit
          </button>
          <button className="btn btn-outline-success" onClick={exportCsv}>
            ⬇ Export CSV
          </button>
        </div>
      </div>

      <div className="card shadow-sm p-4">
        <div className="d-flex align-items-center mb-3">
          {ingredient.imageUrl && (
            <div
              className="photo-plate me-4 flex-shrink-0"
              style={{ width: 160, height: 160 }}
            >
              <img src={noteImage(ingredient.imageUrl, "full")} alt={ingredient.name} />
            </div>
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
            <h5>Olfactory description</h5>
            <p className="p-3 bg-light rounded">
              {ingredient.shortDescription || "No description available."}
            </p>
          </div>
          <div className="col-md-6">
            <h5>Olfactory evolution</h5>
            <p className="p-3 bg-light rounded">
              {ingredient.evolutionImmediate || "Data not available."}
            </p>
            <p className="p-3 bg-light rounded">
              {ingredient.evolutionAfterHours || "Data not available."}
            </p>
            <p className="p-3 bg-light rounded">
              {ingredient.evolutionAfterDays || "Data not available."}
            </p>
          </div>
        </div>

        <table className="table table-striped table-bordered mt-3">
          <tbody>
            <tr>
              <td>Botanical name: {ingredient.botanicalName || "N/A"}</td>
            </tr>
            <tr>
              <td>Odor strength: {ingredient.odorStrength || "N/A"}</td>
            </tr>
            <tr>
              <td>Appearance: {ingredient.appearance || "N/A"}</td>
            </tr>
            <tr>
              <td>
                Producing countries: {ingredient.producingCountries || "N/A"}
              </td>
            </tr>
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
