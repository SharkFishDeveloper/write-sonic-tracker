export default function Metrics({ data, primaryBrand }) {
  const primary = data.visibility.find(
    (b) => b.brand === primaryBrand
  );

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <Metric title="Prompts Tracked" value={data.promptsTracked} />
      <Metric title="Avg AI Visibility %" value={data.averageVisibility} />
      <Metric
        title="Your Brand Visibility"
        value={primary ? `${primary.visibilityPercent}%` : "—"}
      />
    </div>
  );
}

function Metric({ title, value }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
