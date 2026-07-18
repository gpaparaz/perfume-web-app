interface AlphabetFilterProps {
  activeLetter: string;
  onLetterSelect: (letter: string) => void;
}

export default function AlphabetFilter({
  activeLetter,
  onLetterSelect,
}: AlphabetFilterProps) {
  const alphabet = Array.from({ length: 26 }, (_, i) =>
    String.fromCharCode(65 + i)
  );

  return (
    <div className="d-flex flex-wrap gap-2 justify-content-center my-4">
      <button
        className={`btn btn-sm ${
          activeLetter === "" ? "btn-primary" : "btn-outline-primary"
        }`}
        onClick={() => onLetterSelect("")}
      >
        ALL
      </button>

      {alphabet.map((letter) => (
        <button
          key={letter}
          className={`btn btn-sm ${
            activeLetter === letter ? "btn-primary" : "btn-outline-primary"
          }`}
          onClick={() => onLetterSelect(letter)}
          style={{ width: "38px" }}
        >
          {letter}
        </button>
      ))}
    </div>
  );
}
