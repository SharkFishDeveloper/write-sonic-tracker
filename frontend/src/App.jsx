import { useState } from "react";
import InputForm from "./components/InputForm";
import Metrics from "./components/Metrics";
import Leaderboard from "./components/Leaderboard";
import PromptResults from "./components/PromptResults";
import TopSources from "./components/TopSources";
import { API } from "./config/backend";

export default function App() {
  const [primaryBrand, setPrimaryBrand] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function runTracker(category, brands) {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const res = await fetch(API.run, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, brands })
      });

      // Get raw text first to handle non-JSON error responses (like 502/504)
      const text = await res.text();
      let payload;
      
      try {
        payload = JSON.parse(text);
      } catch {
        payload = null;
      }

      // If the response is not 200-299
      if (!res.ok) {
        // Specifically look for the 'error' key from our Express rate-limiter or validation
        const errorMessage = payload?.error || text || "Backend request failed";
        throw new Error(errorMessage);
      }

      // Safety check for empty or malformed successful responses
      if (!payload || !payload.results) {
        throw new Error("Received empty data from server");
      }

      setData(payload);
    } catch (err) {
      console.error("Tracker Error:", err);
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <header className="max-w-6xl mx-auto mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">
          AI Visibility Tracker
        </h1>
        <p className="text-gray-600">Analyze how AI models perceive and rank brands.</p>
      </header>

      <main className="max-w-6xl mx-auto">
        <InputForm
          onSubmit={runTracker}
          primaryBrand={primaryBrand}
          setPrimaryBrand={setPrimaryBrand}
          isLoading={loading}
        />

        {/* Status Indicators */}
        {loading && (
          <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mr-3"></div>
            <p className="text-lg font-medium text-gray-700">Analyzing AI responses (this may take 10-15s)...</p>
          </div>
        )}

        {error && (
          <div className="mt-4 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-sm">
            <p className="font-bold">Analysis Failed</p>
            <p>{error}</p>
          </div>
        )}

        {/* Results Dashboard */}
        {data && !loading && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <Metrics data={data} primaryBrand={primaryBrand} />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <PromptResults data={data} primaryBrand={primaryBrand} />
              </div>
              
              <div className="space-y-8">
                <Leaderboard data={data} primaryBrand={primaryBrand} />
                <TopSources sources={data.topSources} />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}