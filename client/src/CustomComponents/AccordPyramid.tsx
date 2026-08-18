import { useMemo } from "react";

interface AccordPyramidProps {
  accords: AccordDetail[];
  title?: string;
  maxItems?: number;
}

const MAX_WIDTH = 100; // % - barra del rank più forte
const MIN_WIDTH = 30; // % - barra del rank più debole mostrato

// Colore deterministico per nome accordo: non è la palette reale di
// Fragrantica (non pubblica), ma garantisce che lo stesso accordo abbia
// sempre lo stesso colore in tutta l'app, senza dover mantenere a mano
// una mappa per ognuno dei ~98 accordi nel DB.
function colorForAccord(name: string): string {
  let hash = 0;
  const normalized = name.toLowerCase();
  for (let i = 0; i < normalized.length; i++) {
    hash = normalized.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 45%, 38%)`;
}

export default function AccordPyramid({
  accords,
  title = "Accordi Principali",
  maxItems = 10,
}: AccordPyramidProps) {
  const { sortedAccords, widthByRank } = useMemo(() => {
    const sorted = [...accords]
      .sort((a, b) => a.rank - b.rank)
      .slice(0, maxItems);

    // Raggruppiamo per rank: accordi a pari merito ottengono la stessa
    // larghezza. La larghezza è calcolata sulla POSIZIONE del gruppo tra
    // i rank unici presenti, non sul valore grezzo di rank - così un
    // salto nella numerazione (es. manca l'8) non produce un salto
    // innaturale nella larghezza delle barre.
    const uniqueRanks = [...new Set(sorted.map((a) => a.rank))];
    const widthMap = new Map<number, number>();
    uniqueRanks.forEach((rank, i) => {
      const width =
        uniqueRanks.length === 1
          ? MAX_WIDTH
          : MAX_WIDTH -
            (i / (uniqueRanks.length - 1)) * (MAX_WIDTH - MIN_WIDTH);
      widthMap.set(rank, width);
    });

    return { sortedAccords: sorted, widthByRank: widthMap };
  }, [accords, maxItems]);

  if (sortedAccords.length === 0) return null;

  return (
    <div>
      <h4 className=" mb-4">{title}</h4>
      <div className="d-flex flex-column gap-2">
        {sortedAccords.map((accord) => (
          <div
            key={accord.id}
            className="text-white text-center py-2 fw-semibold text-capitalize"
            style={{
              width: `${widthByRank.get(accord.rank)}%`,
              backgroundColor: colorForAccord(accord.name),
              borderRadius: "0 999px 999px 0",
            }}
          >
            {accord.name.toLowerCase()}
          </div>
        ))}
      </div>
    </div>
  );
}
