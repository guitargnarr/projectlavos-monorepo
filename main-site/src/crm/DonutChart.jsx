export default function DonutChart({ data, title }) {
  const entries = Object.entries(data).filter(([, v]) => v > 0);
  const total = entries.reduce((sum, [, v]) => sum + v, 0);
  if (total === 0) {
    return (
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
        <h3 className="text-white text-sm font-semibold mb-4">{title}</h3>
        <p className="text-slate-500 text-sm text-center py-8">No data yet</p>
      </div>
    );
  }

  const palette = [
    '#14b8a6', '#f97316', '#3b82f6', '#22c55e',
    '#a855f7', '#ef4444', '#eab308', '#06b6d4',
    '#ec4899', '#8b5cf6', '#10b981', '#f59e0b',
  ];

  const cx = 80;
  const cy = 80;
  const r = 60;
  const innerR = 38;
  let startAngle = -90;

  const arcs = entries.map(([label, value], i) => {
    const angle = (value / total) * 360;
    const endAngle = startAngle + angle;
    const start = toXY(cx, cy, r, startAngle);
    const end = toXY(cx, cy, r, endAngle);
    const innerStart = toXY(cx, cy, innerR, endAngle);
    const innerEnd = toXY(cx, cy, innerR, startAngle);
    const largeArc = angle > 180 ? 1 : 0;
    const d = [
      `M ${start.x} ${start.y}`,
      `A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`,
      `L ${innerStart.x} ${innerStart.y}`,
      `A ${innerR} ${innerR} 0 ${largeArc} 0 ${innerEnd.x} ${innerEnd.y}`,
      'Z',
    ].join(' ');
    startAngle = endAngle;
    return { d, color: palette[i % palette.length], label, value };
  });

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
      <h3 className="text-white text-sm font-semibold mb-4">{title}</h3>
      <div className="flex items-start gap-4">
        <svg viewBox="0 0 160 160" className="w-32 h-32 shrink-0">
          {arcs.map((arc, i) => (
            <path key={i} d={arc.d} fill={arc.color} opacity={0.85} />
          ))}
          <text
            x={cx}
            y={cy - 4}
            textAnchor="middle"
            fill="#e2e8f0"
            fontSize="18"
            fontWeight="bold"
          >
            {total}
          </text>
          <text
            x={cx}
            y={cy + 12}
            textAnchor="middle"
            fill="#94a3b8"
            fontSize="9"
          >
            total
          </text>
        </svg>
        <div className="flex flex-col gap-1.5 text-xs min-w-0">
          {arcs.map((arc, i) => (
            <div key={i} className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: arc.color }}
              />
              <span className="text-slate-400 truncate">{arc.label}</span>
              <span className="text-slate-300 font-medium ml-auto">
                {arc.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function toXY(cx, cy, r, angleDeg) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}
