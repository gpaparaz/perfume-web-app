import { Link } from "react-router-dom";
import AlphabetFilter from "../CustomComponents/AlphabetFilter";
import { useIngredients } from "../hooks/useIngredients";
import { noteImage } from "../utils/noteImage";

export default function IngredientsPresenter() {
  const { ingredients, selectedLetter, loading, error, toggleLetter } =
    useIngredients();

  return (
    <div className="container">
      <h1 className="page-title text-center">Raw Materials Glossary</h1>

      <AlphabetFilter
        activeLetter={selectedLetter}
        onLetterSelect={toggleLetter}
      />

      {loading && (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {error && <div className="alert alert-danger text-center">{error}</div>}

      {!loading && !error && (
        <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-3 mt-3">
          {ingredients.length > 0 ? (
            ingredients.map((ingredient) => (
              <div className="col" key={ingredient.id}>
                <Link
                  to={`/ingredient/${ingredient.id}`}
                  className="ingredient-card"
                >
                  <div className="photo-plate">
                    {ingredient.imageUrl && (
                      <img
                        src={noteImage(ingredient.imageUrl, "thumb")}
                        alt=""
                        loading="lazy"
                      />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="name">{ingredient.name}</div>
                    <div className="meta">
                      {[ingredient.category, ingredient.typicalVolatility]
                        .filter(Boolean)
                        .join(" · ")}
                    </div>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <div className="col-12 text-center my-5">
              <p className="text-muted fs-5">
                No ingredients found for letter "{selectedLetter}".
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
