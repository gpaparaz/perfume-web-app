interface AlphabetFilterProps {
  activeLetter: string;
  onLetterSelect: (letter: string) => void;
}

const ALPHABET = Array.from({ length: 26 }, (_, i) =>
  String.fromCharCode(65 + i)
);

export default function AlphabetFilter({
  activeLetter,
  onLetterSelect,
}: AlphabetFilterProps) {
  return (
    <nav className="alpha-filter" aria-label="Filter by initial">
      <button
        type="button"
        className={`alpha-btn all ${activeLetter === "" ? "active" : ""}`}
        aria-pressed={activeLetter === ""}
        onClick={() => onLetterSelect("")}
      >
        ALL
      </button>

      {ALPHABET.map((letter) => (
        <button
          key={letter}
          type="button"
          className={`alpha-btn ${activeLetter === letter ? "active" : ""}`}
          aria-pressed={activeLetter === letter}
          onClick={() => onLetterSelect(letter)}
        >
          {letter}
        </button>
      ))}
    </nav>
  );
}
