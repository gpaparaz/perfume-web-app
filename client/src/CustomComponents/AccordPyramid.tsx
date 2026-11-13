import { useMemo } from "react";
import type { AccordDetail } from "../types";
import { colorForAccord } from "../utils/accordColor";

interface AccordPyramidProps {
  accords: AccordDetail[];
  title?: string;
  maxItems?: number;
}

const MAX_WIDTH = 100; // % - bar of the strongest rank
const MIN_WIDTH = 30; // % - bar of the weakest rank shown

export default function AccordPyramid({
  accords,
  title = "Main Accords",
  maxItems = 10,
}: AccordPyramidProps) {
  const { sortedAccords, widthByRank } = useMemo(() => {
    const sorted = [...accords]
      .sort((a, b) => a.rank - b.rank)
      .slice(0, maxItems);

    // Group by rank: tied accords get the same width. The width is based
    // on the group's POSITION among the distinct ranks present, not on the
    // raw rank value - so a gap in the numbering (e.g. 8 is missing)
    // doesn't produce an unnatural jump in bar width.
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
    <div className="accord-scale">
      <h4 className="eyebrow mb-3">{title}</h4>
      <ul className="list-unstyled m-0">
        {sortedAccords.map((accord) => (
          <li key={accord.id} className="accord-row">
            <span className="accord-name">{accord.name.toLowerCase()}</span>
            <span className="accord-track" aria-hidden="true">
              <span
                className="accord-fill"
                style={{
                  width: `${widthByRank.get(accord.rank)}%`,
                  backgroundColor: colorForAccord(accord.name),
                }}
              />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
