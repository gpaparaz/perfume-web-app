import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AccordPyramid from "../CustomComponents/AccordPyramid";
import api from "../services/axios";
import type { NoteDetail, PerfumeDetail } from "../types";
import { downloadText, toCsv } from "../utils/download";
import { noteImage } from "../utils/noteImage";

export default function PerfumeInspect() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [perfume, setPerfume] = useState<PerfumeDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({
    description: "",
    releaseYear: "",
    perfumer: "",
    imageUrl: "",
  });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const res = await api.get<PerfumeDetail>(`/perfumes/detail/${id}`);
        setPerfume(res.data);
      } catch (err) {
        console.error("Failed to fetch the fragrance:", err);
        setError("Could not load the fragrance.");
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const startEdit = () => {
    if (!perfume) return;
    setDraft({
      description: perfume.description ?? "",
      releaseYear:
        perfume.releaseYear != null ? String(perfume.releaseYear) : "",
      perfumer: perfume.perfumer ?? "",
      imageUrl: perfume.imageUrl ?? "",
    });
    setSaveError(null);
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setSaveError(null);
  };

  const save = async () => {
    if (!id) return;
    setSaving(true);
    setSaveError(null);
    try {
      const body = {
        description: draft.description || null,
        releaseYear:
          draft.releaseYear.trim() === "" ? null : Number(draft.releaseYear),
        perfumer: draft.perfumer || null,
        imageUrl: draft.imageUrl || null,
      };
      const res = await api.put<PerfumeDetail>(`/perfumes/${id}`, body);
      setPerfume(res.data);
      setEditing(false);
    } catch (e) {
      console.error("Save failed:", e);
      setSaveError("Save failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const exportCsv = () => {
    if (!perfume) return;
    const notes = (ns: typeof perfume.top) => ns.map((n) => n.name).join("; ");
    const headers = [
      "id",
      "brand",
      "title",
      "release_year",
      "perfumer",
      "description",
      "image_url",
      "top_notes",
      "heart_notes",
      "base_notes",
      "accords",
    ];
    const row = [
      perfume.id,
      perfume.brandName,
      perfume.title,
      perfume.releaseYear,
      perfume.perfumer,
      perfume.description,
      perfume.imageUrl,
      notes(perfume.top),
      notes(perfume.heart),
      notes(perfume.base),
      perfume.accords.map((a) => a.name).join("; "),
    ];
    downloadText(`${perfume.title || "profumo"}.csv`, toCsv(headers, [row]));
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

  if (error || !perfume) {
    return (
      <div className="container my-5 text-center">
        <div className="alert alert-danger">
          {error || "Fragrance not found."}
        </div>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/perfumes")}
        >
          Back to fragrances
        </button>
      </div>
    );
  }

  // ---------- EDIT MODE ----------
  if (editing) {
    return (
      <div className="container my-5">
        <div className="card shadow-sm p-4">
          <h1 className="display-6 mb-1">{perfume.title}</h1>
          <p className="text-muted">
            Edit sheet (title and brand are read-only)
          </p>
          {saveError && <div className="alert alert-danger">{saveError}</div>}

          <div className="mb-3">
            <label className="form-label small text-muted">
              Release year
            </label>
            <input
              type="number"
              className="form-control"
              value={draft.releaseYear}
              onChange={(e) =>
                setDraft((d) => ({ ...d, releaseYear: e.target.value }))
              }
            />
          </div>
          <div className="mb-3">
            <label className="form-label small text-muted">
              Nose (perfumer)
            </label>
            <input
              className="form-control"
              value={draft.perfumer}
              onChange={(e) =>
                setDraft((d) => ({ ...d, perfumer: e.target.value }))
              }
            />
          </div>
          <div className="mb-3">
            <label className="form-label small text-muted">URL foto</label>
            <input
              className="form-control"
              value={draft.imageUrl}
              onChange={(e) =>
                setDraft((d) => ({ ...d, imageUrl: e.target.value }))
              }
            />
          </div>
          <div className="mb-3">
            <label className="form-label small text-muted">Description</label>
            <textarea
              className="form-control"
              rows={5}
              value={draft.description}
              onChange={(e) =>
                setDraft((d) => ({ ...d, description: e.target.value }))
              }
            />
          </div>

          <div className="d-flex gap-2 mt-2">
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
  const renderLayer = (title: string, notes: NoteDetail[]) =>
    notes.length === 0 ? null : (
      <div className="mb-4">
        <h6 className="text-uppercase text-muted mb-2">{title}</h6>
        <div className="d-flex flex-wrap">
          {notes.map((n) => (
            <div
              key={n.ingredientId}
              className="d-flex align-items-center border rounded-pill ps-1 pe-3 py-1 m-1"
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/ingredient/${n.ingredientId}`)}
            >
              {n.imageUrl ? (
                <img
                  src={noteImage(n.imageUrl, "thumb")}
                  alt={n.name}
                  className="rounded-circle me-2"
                  style={{ width: 34, height: 34, objectFit: "cover" }}
                />
              ) : (
                <span
                  className="d-inline-flex align-items-center justify-content-center rounded-circle bg-light me-2"
                  style={{ width: 34, height: 34 }}
                >
                  🌿
                </span>
              )}
              <span>{n.name}</span>
            </div>
          ))}
        </div>
      </div>
    );

  const noNotes =
    perfume.top.length + perfume.heart.length + perfume.base.length === 0;

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
        <div className="row g-4">
          <div className="col-md-4">
            {perfume.imageUrl ? (
              <div className="photo-plate p-4" style={{ aspectRatio: "3 / 4" }}>
                <img src={perfume.imageUrl} alt={perfume.title} />
              </div>
            ) : (
              <div
                className="bg-light rounded d-flex align-items-center justify-content-center text-muted"
                style={{ height: 280 }}
              >
                No photo
              </div>
            )}
          </div>

          <div className="col-md-8">
            <h1 className="display-6 mb-1">{perfume.title}</h1>
            <p className="fs-5 text-muted mb-2">
              {perfume.brandName}
              {perfume.releaseYear && (
                <span className="badge bg-secondary ms-2">
                  {perfume.releaseYear}
                </span>
              )}
            </p>
            {perfume.accords.length > 0 && (
              <AccordPyramid accords={perfume.accords} />
            )}
            {/* {perfume.accords.length > 0 && (
              <div className="mb-3">
                {perfume.accords.map((a) => (
                  <span
                    key={a.id}
                    className="badge bg-info text-dark me-1 mb-1"
                  >
                    {a.name}
                  </span>
                ))}
              </div>
            )} */}
            {perfume.perfumer && (
              <p className="mb-2">
                <strong>Nose:</strong> {perfume.perfumer}
              </p>
            )}
          </div>
        </div>

        <hr />

        <h4 className="mb-3">Olfactory pyramid</h4>
        {noNotes ? (
          <p className="text-muted">
            No notes available for this fragrance.
          </p>
        ) : (
          <>
            {renderLayer("Top notes", perfume.top)}
            {renderLayer("Heart notes", perfume.heart)}
            {renderLayer("Base notes", perfume.base)}
          </>
        )}

        {perfume.description && (
          <p className="text-body">{perfume.description}</p>
        )}
      </div>
    </div>
  );
}
