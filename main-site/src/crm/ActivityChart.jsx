export default function ActivityChart({ data }) {
  // data is { "2026-W04": 3, "2026-W05": 7, ... }
  const weeks = Object.keys(data).sort();
  const values = weeks.map((w) => data[w]);
  const max = Math.max(...values, 1);

  if (weeks.length === 0) {
    return (
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
        <h3 className="text-white text-sm font-semibold mb-4">
          Weekly Activity
        </h3>
        <p className="text-slate-500 text-sm text-center py-8">
          No outreach events yet. Log your first event to see activity here.
        </p>
      </div>
    );
  }

  const barW = 30;
  const gap = 8;
  const svgW = weeks.length * (barW + gap);
  const svgH = 120;
  const chartH = 90;

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
      <h3 className="text-white text-sm font-semibold mb-4">
        Weekly Activity
      </h3>
      <svg viewBox={`0 0 ${Math.max(svgW, 200)} ${svgH}`} className="w-full">
        {weeks.map((week, i) => {
          const v = data[week];
          const barH = Math.max((v / max) * chartH, 2);
          const x = i * (barW + gap);
          const y = chartH - barH;
          return (
            <g key={week}>
              <rect
                x={x}
                y={y}
                width={barW}
                height={barH}
                rx={3}
                fill="#14b8a6"
                opacity={0.7}
              />
              <text
                x={x + barW / 2}
                y={y - 4}
                textAnchor="middle"
                fill="#e2e8f0"
                fontSize="10"
                fontWeight="bold"
              >
                {v}
              </text>
              <text
                x={x + barW / 2}
                y={svgH - 2}
                textAnchor="middle"
                fill="#64748b"
                fontSize="8"
              >
                {week.split('-')[1]}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
