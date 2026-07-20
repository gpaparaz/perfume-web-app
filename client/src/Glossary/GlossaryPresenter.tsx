import { useNavigate } from "react-router-dom";
import AlphabetFilter from "../CustomComponents/AlphabetFilter";
import { useIngredients } from "../hooks/useIngredients";

export default function GlossaryPresenter() {
  const { ingredients, selectedLetter, loading, error, toggleLetter } =
    useIngredients();
  const navigate = useNavigate();

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Glossario delle Materie Prime</h1>

      <AlphabetFilter
        activeLetter={selectedLetter}
        onLetterSelect={toggleLetter}
      />

      {loading && (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Caricamento...</span>
          </div>
        </div>
      )}

      {error && <div className="alert alert-danger text-center">{error}</div>}

      {!loading && !error && (
        <div className="row row-cols-1 row-cols-md-3 g-4 mt-3">
          {ingredients.length > 0 ? (
            ingredients.map((ingredient) => (
              <div
                className="col"
                key={ingredient.id}
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/glossary/${ingredient.id}`)}
              >
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title text-capitalize">
                      {ingredient.name}
                    </h5>
                    <h6 className="card-subtitle mb-2 text-muted small">
                      Category: {ingredient.category || ""}
                    </h6>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center my-5">
              <p className="text-muted fs-5">
                Nessun ingrediente trovato per la lettera "{selectedLetter}".
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
