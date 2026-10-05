import { useState } from "react";

export default function BarChart({ items, labelKey, valueKey, format }) {
  const [hover, setHover] = useState(null);
  const max = Math.max(...items.map((i) => i[valueKey]));
  const shown = hover ?? items[items.length - 1];
  return (
    <>
      <p className="readout">
        <strong>{shown[labelKey]}</strong> {format(shown[valueKey])}
      </p>
      <div className="chart" role="img" aria-label="Bar chart of monthly sales">
        {items.map((i) => (
          <button
            key={i[labelKey]}
            className={"bar-col" + (shown === i ? " on" : "")}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
            onFocus={() => setHover(i)}
            onBlur={() => setHover(null)}
          >
            <div className="bar" style={{ height: `${(i[valueKey] / max) * 100}%` }} />
            <span className="bar-label">{i[labelKey]}</span>
          </button>
        ))}
      </div>
    </>
  );
}