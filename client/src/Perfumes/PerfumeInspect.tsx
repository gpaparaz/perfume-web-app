import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AccordPyramid from "../CustomComponents/AccordPyramid";
import api from "../services/axios";
import type { NoteDetail, PerfumeDetail } from "../types";

export default function PerfumeInspect() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [perfume, setPerfume] = useState<PerfumeDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const res = await api.get<PerfumeDetail>(`/perfumes/detail/${id}`);
        setPerfume(res.data);
      } catch (err) {
        console.error("Errore nel recupero della fragranza:", err);
        setError("Impossibile caricare la fragranza.");
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Caricamento in corso...</span>
        </div>
      </div>
    );
  }

  if (error || !perfume) {
    return (
      <div className="container my-5 text-center">
        <div className="alert alert-danger">
          {error || "Fragranza non trovata."}
        </div>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/perfumes")}
        >
          Torna alle fragranze
        </button>
      </div>
    );
  }

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
              onClick={() => navigate(`/glossary/${n.ingredientId}`)}
            >
              {n.imageUrl ? (
                <img
                  src={n.imageUrl}
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
      <button
        className="btn btn-outline-secondary mb-4"
        onClick={() => navigate(-1)}
      >
        ← Indietro
      </button>

      <div className="card shadow-sm p-4">
        <div className="row g-4">
          <div className="col-md-4">
            {perfume.imageUrl ? (
              <img
                src={perfume.imageUrl}
                alt={perfume.title}
                className="img-fluid rounded"
              />
            ) : (
              <div
                className="bg-light rounded d-flex align-items-center justify-content-center text-muted"
                style={{ height: 280 }}
              >
                Nessuna foto
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
                <strong>Naso:</strong> {perfume.perfumer}
              </p>
            )}
          </div>
        </div>

        <hr />

        <h4 className="mb-3">Piramide olfattiva</h4>
        {noNotes ? (
          <p className="text-muted">
            Nessuna nota disponibile per questa fragranza.
          </p>
        ) : (
          <>
            {renderLayer("Note di testa", perfume.top)}
            {renderLayer("Note di cuore", perfume.heart)}
            {renderLayer("Note di fondo", perfume.base)}
          </>
        )}

        {perfume.description && (
          <p className="text-body">{perfume.description}</p>
        )}
      </div>
    </div>
  );
}
