export default function TopSources({ sources }) {
  return (
    <div className="bg-white p-4 rounded shadow mb-6">
      <h2 className="text-xl font-semibold mb-3">
        Top Referenced Sources
      </h2>

      {sources.map((s) => (
        <div key={s.domain} className="flex justify-between">
          <span>{s.domain}</span>
          <span className="font-bold">{s.count}</span>
        </div>
      ))}
    </div>
  );
}
