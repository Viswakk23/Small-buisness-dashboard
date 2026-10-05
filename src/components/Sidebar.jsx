const items = [
  { id: "overview", label: "Overview" },
  { id: "customers", label: "Customers" },
  { id: "products", label: "Products" },
];

export default function Sidebar({ view, onChange }) {
  return (
    <aside className="sidebar">
      <div className="brand">My Business</div>
      <nav>
        {items.map((i) => (
          <button key={i.id} className={view === i.id ? "nav active" : "nav"} onClick={() => onChange(i.id)}>
            {i.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}