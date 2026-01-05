export default function   TopSources({ sources }) {
  return (
    <div className="bg-white p-4 rounded shadow mb-6">
      <h2 className="text-xl font-semibold mb-3">
        Top Referenced Sources (Heuristic)
      </h2>

      {sources.map((source) => (
        <div key={source.domain} className="flex justify-between">
          <span>{source.domain}</span>
          <span className="font-bold">{source.count}</span>
        </div>
      ))}
    </div>
  );
}
