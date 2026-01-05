import { useState } from "react";

export default function InputForm({ onSubmit,primaryBrand,setPrimaryBrand }) {
  const [category, setCategory] = useState("");
  const [brands, setBrands] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const brandList = brands.split(",").map(b => b.trim());
    onSubmit(category, brandList);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded shadow mb-6"
    >
      <div className="mb-3">
        <label className="block font-medium">Category</label>
        <input
          className="border w-full p-2 rounded"
          placeholder="CRM software"
          value={category}
          onChange={e => setCategory(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label className="block font-medium">Brands (comma separated)</label>
        <input
          className="border w-full p-2 rounded"
          placeholder="Salesforce, HubSpot, Pipedrive"
          value={brands}
          onChange={e => setBrands(e.target.value)}
          required
        />
        <select
          className="border w-full p-2 rounded mt-3"
          value={primaryBrand}
          onChange={(e) => setPrimaryBrand(e.target.value)}
        >
          <option value="">Select Primary Brand</option>
          {brands.split(",").map((b) => {
            const brand = b.trim();
            return (
              <option key={brand} value={brand}>
                {brand}
              </option>
            );
          })}
        </select>
      </div>

      <button className="bg-black text-white px-4 py-2 rounded">
        Run Visibility Check
      </button>
    </form>
  );
}
