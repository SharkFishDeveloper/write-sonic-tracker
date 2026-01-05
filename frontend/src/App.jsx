import { useState } from "react";
import InputForm from "./components/InputForm";
import Metrics from "./components/Metrics";
import Leaderboard from "./components/Leaderboard";
import PromptResults from "./components/PromptResults";
import TopSources from "./components/TopSources";

export default function App() {
  const [primaryBrand, setPrimaryBrand] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  async function runTracker(category, brands) {
  setLoading(true);

  try {
    const res = await fetch("https://write-sonic-tracker.onrender.com/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category, brands })
    });

    const text = await res.text(); // 👈 read raw response first

    if (!res.ok) {
      console.error("Server error:", text);
      throw new Error("Backend failed");
    }

    let json;
    try {
      json = JSON.parse(text);
    } catch {
      console.error("Not JSON:", text);
      throw new Error("Invalid JSON response");
    }

    setData(json);
  } catch (err) {
    alert(err.message);
  } finally {
    setLoading(false);
  }
}

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">
        AI Visibility Tracker
      </h1>

      <InputForm
        onSubmit={runTracker}
        primaryBrand={primaryBrand}
        setPrimaryBrand={setPrimaryBrand}
      />

      {loading && <p className="mt-4">Analyzing AI responses…</p>}
      {data && (
        <>
          <TopSources sources={data.topSources} />
          <Metrics data={data} primaryBrand={primaryBrand}/>
          <Leaderboard data={data} primaryBrand={primaryBrand} />
          <PromptResults data={data} primaryBrand={primaryBrand}  />
        </>
      )}
    </div>
  );
}
