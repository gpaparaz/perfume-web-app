import { useNavigate } from "react-router-dom";
import { useBrands } from "../hooks/useBrands";

export default function BrandPresenter() {
  const { allBrands, loading, error } = useBrands();
  const navigate = useNavigate();

  console.log(allBrands);

  {
    loading && (
      <div className="text-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Caricamento...</span>
        </div>
      </div>
    );
  }

  {
    error && <div className="alert alert-danger text-center">{error}</div>;
  }

  return (
    <>
      {!loading && !error && (
        <div className="row row-cols-1 row-cols-md-3 g-4 mt-3">
          {allBrands.length > 0 ? (
            allBrands.map((perfume) => (
              <div key={perfume.id} className="accordion" id="accordionExample">
                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button
                      className="accordion-button"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseOne"
                      aria-expanded="true"
                      aria-controls="collapseOne"
                    >
                      {perfume.name}
                    </button>
                  </h2>
                  <div
                    id="collapseOne"
                    className="accordion-collapse collapse show"
                    data-bs-parent="#accordionExample"
                  >
                    <div className="accordion-body">
                      {perfume.perfumes.map((fragrance) => (
                        <div
                          className="col"
                          key={fragrance.id}
                          style={{ cursor: "pointer" }}
                          onClick={() => navigate(`/glossary/${perfume.id}`)}
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
            ))
          ) : (
            <div>No brands found</div>
          )}
        </div>
      )}
    </>
  );
}
