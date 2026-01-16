export default function PromptResults({ data, primaryBrand }) {
  return (
    <div className="space-y-4">
      {data.results.map((r, i) => (
        <div key={i} className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">{r.prompt}</h3>

          <div className="mb-2">
            {r.mentions.map(m => (
              <span
                key={m.brand}
                className={`inline-block px-2 py-1 mr-2 rounded text-sm ${
                  m.mentioned
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {m.brand}
              </span>
            ))}
          </div>

          <p className="text-gray-600 text-sm whitespace-pre-wrap">
            {primaryBrand
              ? r.text.split(
                  new RegExp(
                    `(${primaryBrand.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
                    "gi"
                  )
                ).map((part, idx) =>
                  part.toLowerCase() === primaryBrand.toLowerCase()
                    ? (
                      <mark
                        key={idx}
                        className="bg-yellow-200 rounded px-1"
                      >
                        {part}
                      </mark>
                    )
                    : part
                )
              : r.text}
          </p>
        </div>
      ))}
    </div>
  );
}
