import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ListRowRenderer } from "react-virtualized";
import {
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
  List,
  WindowScroller,
} from "react-virtualized";
import AlphabetFilter from "../CustomComponents/AlphabetFilter";
import { useBrands } from "../hooks/useBrands";

const cache = new CellMeasurerCache({
  fixedWidth: true,
  defaultHeight: 90,
});

export default function BrandPresenter() {
  const { allBrands, loading, error, selectedLetter, setSelectedLetter } =
    useBrands();
  const navigate = useNavigate();
  const listRef = useRef<List>(null);

  const scrollElement = useMemo(
    () => document.getElementById("root") ?? undefined,
    []
  );

  // Explicit state for the open accordion: replaces data-bs-toggle, which
  // would change the DOM without React (and therefore CellMeasurer)
  // noticing.
  const [expandedBrandId, setExpandedBrandId] = useState<number | null>(null);

  // Tracks the index of the currently expanded row (not just the brand
  // id) so its cache can be invalidated when it collapses as a side effect
  // - a ref rather than state because it must not trigger renders, it's
  // only needed inside toggleBrand.
  const expandedIndexRef = useRef<number | null>(null);

  const toggleBrand = useCallback((index: number, brandId: number) => {
    const wasThisOpen = expandedIndexRef.current === index;
    const previousIndex = expandedIndexRef.current;

    setExpandedBrandId(wasThisOpen ? null : brandId);

    // The clicked row changes state (opens or closes): invalidate it.
    cache.clear(index, 0);
    listRef.current?.recomputeRowHeights(index);

    // The previously open row (if different) collapses as a side effect,
    // since this is a one-at-a-time accordion: without invalidating it too,
    // the List keeps reserving its old expanded height.
    if (previousIndex !== null && previousIndex !== index) {
      cache.clear(previousIndex, 0);
      listRef.current?.recomputeRowHeights(previousIndex);
    }

    expandedIndexRef.current = wasThisOpen ? null : index;
  }, []);

  // Whenever the filtered dataset changes (e.g. a different letter), the
  // cache must be dropped: it's indexed by position (rowIndex), not by
  // content, so otherwise the height measured for the brand that USED TO
  // sit at index N would be applied to the different brand now at that
  // index. The open accordion is reset too, since it makes no sense to keep
  // it "expanded" for a brand that may no longer be visible with this
  // filter.
  useEffect(() => {
    cache.clearAll();
    setExpandedBrandId(null);
    expandedIndexRef.current = null;
    listRef.current?.recomputeRowHeights();
  }, [allBrands]);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    function handleResize() {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        cache.clearAll();
        listRef.current?.recomputeRowHeights();
      }, 150);
    }
    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const rowRenderer: ListRowRenderer = ({ index, key, parent, style }) => {
    const brand = allBrands[index];
    const isExpanded = expandedBrandId === brand.id;

    return (
      <CellMeasurer
        cache={cache}
        columnIndex={0}
        key={key}
        parent={parent}
        rowIndex={index}
      >
        {({ registerChild }) => (
          <div
            ref={registerChild as React.Ref<HTMLDivElement>}
            style={style}
            className="px-2 pb-3"
          >
            <div className="accordion">
              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button
                    className={`accordion-button ${
                      isExpanded ? "" : "collapsed"
                    }`}
                    type="button"
                    onClick={() => toggleBrand(index, brand.id)}
                    aria-expanded={isExpanded}
                  >
                    {brand.name}
                  </button>
                </h2>

                {isExpanded && (
                  <div className="accordion-collapse collapse show">
                    <div className="accordion-body d-flex flex-wrap gap-3">
                      {brand.perfumes.map((perfume) => (
                        <div
                          key={perfume.id}
                          style={{ cursor: "pointer", width: "220px" }}
                          onClick={() => navigate(`/perfumes/${perfume.id}`)}
                        >
                          <div className="card h-100 shadow-sm d-flex flex-row">
                            <img
                              style={{
                                width: "50px",
                                height: "50px",
                                objectFit: "cover",
                              }}
                              src={perfume.imageUrl}
                              alt=""
                            />
                            <div>
                              <h5 className="mb-0">{perfume.title}</h5>
                              <div className="card-body py-1">
                                <span>{perfume.releaseYear}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </CellMeasurer>
    );
  };

  return (
    <div className="container">
      {loading && (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {error && <div className="alert alert-danger text-center">{error}</div>}

      {!loading && !error && (
        <>
          <AlphabetFilter
            activeLetter={selectedLetter}
            onLetterSelect={setSelectedLetter}
          />

          {allBrands.length > 0 ? (
            <WindowScroller scrollElement={scrollElement}>
              {({ height, isScrolling, onChildScroll, scrollTop }) => (
                <AutoSizer disableHeight>
                  {({ width }) => (
                    <List
                      ref={listRef}
                      autoHeight
                      height={height}
                      isScrolling={isScrolling}
                      onScroll={onChildScroll}
                      scrollTop={scrollTop}
                      width={width}
                      rowCount={allBrands.length}
                      rowHeight={cache.rowHeight}
                      rowRenderer={rowRenderer}
                      overscanRowCount={5}
                    />
                  )}
                </AutoSizer>
              )}
            </WindowScroller>
          ) : (
            <div>No brands found</div>
          )}
        </>
      )}
    </div>
  );
}
