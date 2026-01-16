export default function Leaderboard({ data, primaryBrand }) {
  return (
    <div className="bg-white p-4 rounded shadow mb-6">
      <h2 className="text-xl font-semibold mb-3">
        Brand Visibility Leaderboard
      </h2>

      {data.visibility
        .slice()
        .sort((a, b) => b.visibilityPercent - a.visibilityPercent)
        .map((b) => (
          <div
            key={b.brand}
            className={`flex justify-between py-1 ${
              b.brand === primaryBrand
                ? "bg-yellow-100 font-bold px-2 rounded"
                : ""
            }`}
          >
            <span>{b.brand}</span>
            <span>{b.visibilityPercent}%</span>
          </div>
        ))}
    </div>
  );
}
