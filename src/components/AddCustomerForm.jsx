import { useState } from "react";

export default function AddCustomerForm({ onAdd }) {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!name.trim() || !city.trim()) return setError("Enter both a name and a city.");
    onAdd({ name: name.trim(), city: city.trim() });
    setName(""); setCity(""); setError("");
  };

  return (
    <form className="form" onSubmit={submit}>
      <input placeholder="Customer name" value={name} onChange={(e) => setName(e.target.value)} />
      <input placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
      <button className="primary" type="submit">Add customer</button>
      {error && <p className="error" role="alert">{error}</p>}
    </form>
  );
}