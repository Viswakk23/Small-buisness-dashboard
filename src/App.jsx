import { useEffect, useState } from "react";
import { data as fallback } from "../api/_data.js";
import Panel from "./components/Panel.jsx";
import StatCard from "./components/StatCard.jsx";
import BarChart from "./components/BarChart.jsx";
import DataTable from "./components/DataTable.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Modal from "./components/Modal.jsx";
import AddCustomerForm from "./components/AddCustomerForm.jsx";
import AddProductForm from "./components/AddProductForm.jsx";

const rupees = (n) => "₹" + n.toLocaleString("en-IN");

export default function App() {
  const [sales, setSales] = useState(fallback.sales);
  const [customers, setCustomers] = useState(fallback.customers);
  const [products, setProducts] = useState(fallback.products);
  const [view, setView] = useState("overview");
  const [range, setRange] = useState(6);
  const [toast, setToast] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [orderAmount, setOrderAmount] = useState("");

  useEffect(() => {
    fetch("/api/data")
      .then((r) => r.json())
      .then((d) => {
        if (d && d.sales && d.customers && d.products) {
          setSales(d.sales); setCustomers(d.customers); setProducts(d.products);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(""), 2500);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const shownSales = sales.slice(-range);
  const total = shownSales.reduce((s, m) => s + m.amount, 0);
  const last = sales[sales.length - 1].amount;
  const prev = sales[sales.length - 2].amount;
  const growth = (((last - prev) / prev) * 100).toFixed(1);
  const lowStock = products.filter((p) => p.stock < 10);
  const bestSellers = [...products].sort((a, b) => b.sold - a.sold).slice(0, 5);
  const maxSold = bestSellers[0]?.sold || 1;
  const selected = customers.find((c) => c.id === selectedId);

  const addCustomer = ({ name, city }) => {
    setCustomers((c) => [{ id: Date.now(), name, city, orders: 0, spent: 0 }, ...c]);
    setToast(`${name} added`);
  };
  const addOrder = (e) => {
    e.preventDefault();
    const amount = Number(orderAmount);
    if (!amount || amount <= 0) return setToast("Enter an order amount above 0");
    setCustomers((cs) => cs.map((c) => (c.id === selectedId ? { ...c, orders: c.orders + 1, spent: c.spent + amount } : c)));
    setSales((s) => s.map((m, i) => (i === s.length - 1 ? { ...m, amount: m.amount + amount } : m)));
    setOrderAmount("");
    setToast(`Order of ${rupees(amount)} recorded`);
  };
  const removeCustomer = () => {
    setCustomers((cs) => cs.filter((c) => c.id !== selectedId));
    setToast(`${selected.name} removed`);
    setSelectedId(null);
  };
  const addProduct = (p) => {
    setProducts((ps) => [{ id: Date.now(), sold: 0, ...p }, ...ps]);
    setToast(`${p.name} added`);
  };
  const restock = (p) => {
    setProducts((ps) => ps.map((x) => (x.id === p.id ? { ...x, stock: x.stock + 10 } : x)));
    setToast(`Added 10 to ${p.name}`);
  };
  const sellOne = (p) => {
    if (p.stock <= 0) return setToast(`${p.name} is out of stock`);
    setProducts((ps) => ps.map((x) => (x.id === p.id ? { ...x, stock: x.stock - 1, sold: x.sold + 1 } : x)));
    setSales((s) => s.map((m, i) => (i === s.length - 1 ? { ...m, amount: m.amount + p.price } : m)));
    setToast(`Sold 1 ${p.name} for ${rupees(p.price)}`);
  };

  const customerCols = [
    { key: "name", label: "Name" },
    { key: "city", label: "City" },
    { key: "orders", label: "Orders" },
    { key: "spent", label: "Spent", render: (r) => rupees(r.spent) },
  ];
  const stockCell = (r) => (
    <div className="stock">
      <div className="stock-track">
        <div className={r.stock < 10 ? "stock-fill low" : "stock-fill"} style={{ width: `${Math.min(r.stock, 100)}%` }} />
      </div>
      <span>{r.stock}</span>
    </div>
  );
  const productCols = [
    { key: "name", label: "Product" },
    { key: "price", label: "Price", render: (r) => rupees(r.price) },
    { key: "sold", label: "Sold" },
    { key: "stock", label: "Stock", render: stockCell },
    {
      key: "actions", label: "Actions", sortable: false, searchable: false,
      render: (r) => (
        <div className="actions">
          <button className="small" onClick={() => sellOne(r)}>Sell 1</button>
          <button className="small ghost" onClick={() => restock(r)}>Restock +10</button>
        </div>
      ),
    },
  ];

  const titles = { overview: "Business overview", customers: "Customers", products: "Products" };
  const subtitles = {
    overview: `Best seller: ${bestSellers[0]?.name ?? "none yet"}`,
    customers: "Click a customer to record an order or see details.",
    products: "Sell or restock items. Your sales chart updates as you go.",
  };

  return (
    <div className="shell">
      <Sidebar view={view} onChange={setView} />
      <main className="app">
        <header>
          <h1>{titles[view]}</h1>
          <p>{subtitles[view]}</p>
        </header>

        {view === "overview" && (
          <>
            <div className="stats">
              <StatCard label="Sales" value={rupees(total)} note={`Last ${range} months`} />
              <StatCard label="This month" value={rupees(last)} note={`${growth}% vs last month`} tone="amber" />
              <StatCard label="Customers" value={customers.length} note="In your list" />
              <StatCard label="Low stock" value={lowStock.length} note={lowStock.map((p) => p.name).join(", ") || "All good"} tone="red" />
            </div>
            <div className="grid">
              <Panel title="Monthly sales">
                <div className="seg" role="group" aria-label="Date range">
                  {[3, 6].map((n) => (
                    <button key={n} className={range === n ? "on" : ""} onClick={() => setRange(n)}>{n} months</button>
                  ))}
                </div>
                <BarChart items={shownSales} labelKey="month" valueKey="amount" format={rupees} />
              </Panel>
              <Panel title="Top customers">
                <DataTable
                  rows={[...customers].sort((a, b) => b.spent - a.spent).slice(0, 5)}
                  columns={customerCols}
                  placeholder="Search customers"
                  onRowClick={(r) => setSelectedId(r.id)}
                />
              </Panel>
              <Panel title="Best sellers">
                <ul className="rank">
                  {bestSellers.map((p) => (
                    <li key={p.id}>
                      <div className="rank-top"><span>{p.name}</span><span>{p.sold} sold</span></div>
                      <div className="stock-track wide">
                        <div className="stock-fill" style={{ width: `${(p.sold / maxSold) * 100}%` }} />
                      </div>
                    </li>
                  ))}
                </ul>
              </Panel>
              <Panel title="Needs restocking">
                {lowStock.length === 0 ? (
                  <p className="empty">Every product has 10 or more in stock.</p>
                ) : (
                  <DataTable rows={lowStock} columns={productCols} placeholder="Search products" />
                )}
              </Panel>
            </div>
          </>
        )}

        {view === "customers" && (
          <Panel title="All customers">
            <AddCustomerForm onAdd={addCustomer} />
            <DataTable rows={customers} columns={customerCols} placeholder="Search by name or city" onRowClick={(r) => setSelectedId(r.id)} />
          </Panel>
        )}

        {view === "products" && (
          <Panel title="All products">
            <AddProductForm onAdd={addProduct} />
            <DataTable rows={products} columns={productCols} placeholder="Search products" />
          </Panel>
        )}
      </main>

      {selected && (
        <Modal title={selected.name} onClose={() => setSelectedId(null)}>
          <dl className="details">
            <div><dt>City</dt><dd>{selected.city}</dd></div>
            <div><dt>Orders</dt><dd>{selected.orders}</dd></div>
            <div><dt>Total spent</dt><dd>{rupees(selected.spent)}</dd></div>
            <div><dt>Average order</dt><dd>{selected.orders ? rupees(Math.round(selected.spent / selected.orders)) : "No orders yet"}</dd></div>
          </dl>
          <form className="order-form" onSubmit={addOrder}>
            <input type="number" min="1" placeholder="Order amount in ₹" value={orderAmount} onChange={(e) => setOrderAmount(e.target.value)} />
            <button className="primary" type="submit">Record order</button>
          </form>
          <button className="danger" onClick={removeCustomer}>Remove customer</button>
        </Modal>
      )}

      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  );
}