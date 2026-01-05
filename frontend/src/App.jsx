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
    const res = await fetch("http://localhost:4000/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category, brands })
    });

    const json = await res.json();
    setData(json);
    setLoading(false);
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
