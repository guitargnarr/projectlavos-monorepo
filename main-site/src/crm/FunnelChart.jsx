export default function FunnelChart({ data }) {
  const stages = [
    { key: 'prospect', label: 'Prospect', color: '#94a3b8' },
    { key: 'contacted', label: 'Contacted', color: '#14b8a6' },
    { key: 'responded', label: 'Responded', color: '#2dd4bf' },
    { key: 'meeting', label: 'Meeting', color: '#f97316' },
    { key: 'closed', label: 'Closed', color: '#22c55e' },
    { key: 'lost', label: 'Lost', color: '#ef4444' },
  ];

  const max = Math.max(...stages.map((s) => data[s.key] || 0), 1);
  const svgW = 300;
  const svgH = stages.length * 44;

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
      <h3 className="text-white text-sm font-semibold mb-4">Pipeline Funnel</h3>
      <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full">
        {stages.map((stage, i) => {
          const count = data[stage.key] || 0;
          const barW = Math.max((count / max) * (svgW - 100), 4);
          const y = i * 44;
          return (
            <g key={stage.key}>
              <rect
                x={(svgW - 100 - barW) / 2 + 50}
                y={y + 4}
                width={barW}
                height={28}
                rx={4}
                fill={stage.color}
                opacity={0.8}
              />
              <text
                x={8}
                y={y + 22}
                fill="#94a3b8"
                fontSize="11"
                dominantBaseline="middle"
              >
                {stage.label}
              </text>
              <text
                x={svgW - 8}
                y={y + 22}
                fill="#e2e8f0"
                fontSize="12"
                fontWeight="bold"
                textAnchor="end"
                dominantBaseline="middle"
              >
                {count}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
