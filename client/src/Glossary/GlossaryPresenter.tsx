import { useState } from "react";
import AlphabetFilter from "../CustomComponents/AlphabetFilter";

export default function GlossaryPresenter() {
  const [selectedLetter, setSelectedLetter] = useState<string>("");

  return (
    <div className="container">
      <h2 className="mb-3">Raw Materials Glossary</h2>
      <p className="text-muted">
        Filter ingredients and olfactory families by letter:
      </p>

      <AlphabetFilter
        activeLetter={selectedLetter}
        onLetterSelect={setSelectedLetter}
      />

      <div className="mt-4">
        {selectedLetter ? (
          <p>
            Showing materials starting with: <strong>{selectedLetter}</strong>
          </p>
        ) : (
          <p>Showing all ingredients.</p>
        )}
        {/* Qui sotto mapperemo la lista dei componenti estratti da Première Peau */}
      </div>
    </div>
  );
}
