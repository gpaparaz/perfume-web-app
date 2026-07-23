import { useNavigate } from "react-router-dom";
import { useBrands } from "../hooks/useBrands";

export default function BrandPresenter() {
  const { allBrands, loading, error } = useBrands();
  const navigate = useNavigate();

  console.log(allBrands);

  return (
    <>
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
          {allBrands.length > 0 ? (
            allBrands.map((perfume) => {
              // Generiamo ID univoci per ogni Brand
              const collapseId = `collapse-brand-${perfume.id}`;
              const headerId = `heading-brand-${perfume.id}`;

              return (
                <div
                  key={perfume.id}
                  className="accordion"
                  id="accordionExample"
                >
                  <div className="accordion-item">
                    <h2 className="accordion-header" id={headerId}>
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#${collapseId}`}
                        aria-expanded="false"
                        aria-controls={collapseId}
                      >
                        {perfume.name}
                      </button>
                    </h2>
                    <div
                      id={collapseId}
                      className="accordion-collapse collapse"
                    >
                      <div className="accordion-body">
                        {perfume.perfumes.map((fragrance) => (
                          <div
                            className="col"
                            key={fragrance.id}
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                              navigate(`/fragrances/${perfume.id}`)
                            }
                          >
                            <div className="card h-100 shadow-sm">
                              <h4>{fragrance.title}</h4>
                              <div className="card-body">
                                <h5 className="card-title text-capitalize">
                                  {fragrance.title}
                                </h5>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div>No brands found</div>
          )}
        </div>
      )}
    </>
  );
}
