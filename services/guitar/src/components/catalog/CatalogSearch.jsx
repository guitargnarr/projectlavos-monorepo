import PropTypes from 'prop-types';

export default function CatalogSearch({ value, onChange }) {
  return (
    <div className="catalog-search-wrapper">
      <input
        type="text"
        placeholder="Search by title, tags, difficulty, tier..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="catalog-search-input"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="catalog-search-clear"
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
