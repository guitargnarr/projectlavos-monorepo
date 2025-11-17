import PropTypes from 'prop-types';

export default function ProgressBar({ completed, total }) {
  const percentage = Math.round((completed / total) * 100);

  return (
    <div className="mb-6 bg-gray-800 rounded-lg p-4 border border-gray-700">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-300 font-medium">
          Overall Progress: {completed}/{total} lessons completed
        </span>
        <span className="text-sm font-semibold text-green-400">
          {percentage}%
        </span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2.5">
        <div
          className="bg-gradient-to-r from-green-500 to-emerald-400 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

ProgressBar.propTypes = {
  completed: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
};
