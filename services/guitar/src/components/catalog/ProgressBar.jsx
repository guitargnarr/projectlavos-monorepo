import PropTypes from 'prop-types';

export default function ProgressBar({ completed, total }) {
  const percentage = Math.round((completed / total) * 100);

  return (
    <div className="catalog-progress-panel">
      <div className="catalog-progress-header">
        <span className="catalog-progress-text">
          Overall Progress: {completed}/{total} lessons completed
        </span>
        <span className="catalog-progress-percent">
          {percentage}%
        </span>
      </div>
      <div className="catalog-progress-track">
        <div
          className="catalog-progress-fill"
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
