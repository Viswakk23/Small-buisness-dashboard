import { useMemo, useState } from "react";

// columns: [{ key, label, render?(row), sortable?, searchable? }]
export default function DataTable({ columns, rows, placeholder = "Search", onRowClick }) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState({ key: null, dir: 1 });

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    let out = q
      ? rows.filter((r) =>
          columns.some((c) => c.searchable !== false && String(r[c.key]).toLowerCase().includes(q)))
      : rows;
    if (sort.key) {
      out = [...out].sort((a, b) => {
        const x = a[sort.key], y = b[sort.key];
        return (typeof x === "number" ? x - y : String(x).localeCompare(String(y))) * sort.dir;
      });
    }
    return out;
  }, [rows, columns, query, sort]);

  const toggle = (key) =>
    setSort((s) => (s.key === key ? { key, dir: -s.dir } : { key, dir: 1 }));

  return (
    <>
      <input className="search" type="search" placeholder={placeholder} value={query}
        onChange={(e) => setQuery(e.target.value)} aria-label={placeholder} />
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              {columns.map((c) => (
                <th key={c.key} aria-sort={sort.key === c.key ? (sort.dir === 1 ? "ascending" : "descending") : "none"}>
                  {c.sortable === false ? c.label : (
                    <button className="th-btn" onClick={() => toggle(c.key)}>
                      {c.label}{sort.key === c.key ? (sort.dir === 1 ? " ▲" : " ▼") : ""}
                    </button>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map((r) => (
              <tr key={r.id}
                className={onRowClick ? "clickable" : undefined}
                tabIndex={onRowClick ? 0 : undefined}
                onClick={onRowClick ? () => onRowClick(r) : undefined}
                onKeyDown={onRowClick ? (e) => e.key === "Enter" && onRowClick(r) : undefined}>
                {columns.map((c) => <td key={c.key}>{c.render ? c.render(r) : r[c.key]}</td>)}
              </tr>
            ))}
            {visible.length === 0 && (
              <tr><td colSpan={columns.length} className="empty">Nothing matches "{query}". Try a different word.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}