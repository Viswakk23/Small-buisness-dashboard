import { useState } from "react";

export default function AddProductForm({ onAdd }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!name.trim() || Number(price) <= 0 || stock === "" || Number(stock) < 0)
      return setError("Enter a name, a price above 0 and a stock count.");
    onAdd({ name: name.trim(), price: Number(price), stock: Number(stock) });
    setName(""); setPrice(""); setStock(""); setError("");
  };

  return (
    <form className="form product-form" onSubmit={submit}>
      <input placeholder="Product name" value={name} onChange={(e) => setName(e.target.value)} />
      <input type="number" min="1" placeholder="Price in ₹" value={price} onChange={(e) => setPrice(e.target.value)} />
      <input type="number" min="0" placeholder="Stock" value={stock} onChange={(e) => setStock(e.target.value)} />
      <button className="primary" type="submit">Add product</button>
      {error && <p className="error" role="alert">{error}</p>}
    </form>
  );
}