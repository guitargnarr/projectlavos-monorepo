export default function StatCard({ label, value, sub, color = 'teal' }) {
  const colors = {
    teal: 'from-teal-500/20 to-teal-600/10 border-teal-500/30',
    orange: 'from-orange-500/20 to-orange-600/10 border-orange-500/30',
    blue: 'from-blue-500/20 to-blue-600/10 border-blue-500/30',
    green: 'from-green-500/20 to-green-600/10 border-green-500/30',
  };
  const textColors = {
    teal: 'text-teal-400',
    orange: 'text-orange-400',
    blue: 'text-blue-400',
    green: 'text-green-400',
  };

  return (
    <div
      className={`bg-gradient-to-br ${colors[color]} border rounded-xl p-5`}
    >
      <p className="text-slate-400 text-sm mb-1">{label}</p>
      <p className={`text-3xl font-bold ${textColors[color]}`}>{value}</p>
      {sub && <p className="text-slate-500 text-xs mt-1">{sub}</p>}
    </div>
  );
}
