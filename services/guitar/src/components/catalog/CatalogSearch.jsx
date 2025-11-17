import PropTypes from 'prop-types';

export default function CatalogSearch({ value, onChange }) {
  return (
    <div className="relative w-full md:w-96">
      <input
        type="text"
        placeholder="Search by title, tags, difficulty, tier..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 pr-10 text-base bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-green-500 transition-colors"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
          aria-label="Clear search"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

CatalogSearch.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
