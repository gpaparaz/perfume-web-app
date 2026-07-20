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

  useEffect(() => {
    const fetchFullIngredient = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const response = await api.get<Ingredient>(`/glossary/${id}`);
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
          onClick={() => navigate("/glossary")}
        >
          Torna al Glossario
        </button>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <button
        className="btn btn-outline-secondary mb-4"
        onClick={() => navigate(-1)}
      >
        ← Indietro
      </button>

      <div className="card shadow-sm p-4">
        <div className="d-flex align-items-center mb-3">
          <h1 className="display-5 mb-0">{ingredient.name}</h1>
          <span className="badge bg-info text-dark ms-3 fs-6">
            {ingredient.typicalVolatility}
          </span>
        </div>

        <p className="text-muted fs-5">
          {ingredient.category} —{" "}
          <span className="text-secondary">{ingredient.subcategory}</span>
        </p>

        <hr />

        <div className="row g-4 mt-2">
          <div className="col-md-6">
            <h5>Descrizione Olfattiva</h5>
            <p className="p-3 bg-light rounded">
              {ingredient.shortDescription || "Nessuna descrizione presente."}
            </p>
          </div>

          <div className="col-md-6">
            <h5>Evoluzione Olfattiva / Note Tecniche</h5>
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

        <div className="mt-4">
          <table className="table table-striped table-bordered mt-3">
            <tbody>
              <tr>
                <td>
                  Famiglia Chimica / Note:{" "}
                  {ingredient.typicalVolatility || "N/D"}
                </td>
              </tr>
              <tr>
                <td>Durata odore: {ingredient.odorStrength || "N/D"}</td>
              </tr>
              <tr>
                <td>Apparenza: {ingredient.appearance || "N/D"}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-4">
          <span>{ingredient.fullExtractedText}</span>
        </div>
      </div>
    </div>
  );
}
