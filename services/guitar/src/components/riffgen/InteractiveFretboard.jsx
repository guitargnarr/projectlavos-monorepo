import PropTypes from 'prop-types';
import { GuitarTheory, TUNINGS } from '../../lib/guitarTheory';

/**
 * InteractiveFretboard - Full 15-fret view with playback sync and clickable notes
 * Used by RiffGenerator for visual feedback during playback
 */
function InteractiveFretboard({
  activeNotes,
  scaleNotes,
  root,
  position,
  onNoteClick,
  isPlaying,
  tuning = 'standard'
}) {
  const fretCount = 15; // Full neck visibility
  const fretMarkers = [3, 5, 7, 9, 12]; // Standard guitar fret markers
  const doubleFretMarker = 12;

  // Use tuning-aware GuitarTheory instance
  const theory = new GuitarTheory(tuning);
  const scaleNoteNames = scaleNotes || [];

  // Get string labels from the tuning (reversed for display: high string first)
  const tuningNotes = TUNINGS[tuning] || TUNINGS.standard;
  const strings = [...tuningNotes].reverse(); // Display high to low: e, B, G, D, A, E

  // Calculate fret width percentage for responsive layout
  const fretWidthPct = 100 / fretCount;

  return (
    <div className="interactive-fretboard-container" role="img" aria-label={`Interactive fretboard showing ${root} scale`}>
      {/* Fret numbers */}
      <div className="fretboard-fret-numbers">
        <span className="fret-number-label"></span>
        {Array.from({ length: fretCount }, (_, i) => (
          <span
            key={i}
            className={`fret-number ${fretMarkers.includes(i) ? 'fret-marker-number' : ''}`}
            style={{ width: `${fretWidthPct}%` }}
          >
            {i}
          </span>
        ))}
      </div>

      {/* Fretboard body */}
      <div className="fretboard-body">
        {strings.map((stringName, stringIdx) => (
          <div key={stringName} className="fretboard-string-row">
            <span className="string-label">{stringName}</span>
            <div className="string-frets">
              {Array.from({ length: fretCount }, (_, fret) => {
                const note = theory.getNoteAtFret(5 - stringIdx, fret);
                const isActive = activeNotes.some(n => n.string === stringIdx && n.fret === fret);
                const isInScale = scaleNoteNames.includes(note);
                const isRoot = note === root;
                const hasMarker = stringIdx === 2 && fretMarkers.includes(fret) && fret !== doubleFretMarker;
                const hasDoubleMarker = (stringIdx === 1 || stringIdx === 3) && fret === doubleFretMarker;

                return (
                  <div
                    key={fret}
                    className={`fret-cell ${fret === 0 ? 'nut-fret' : ''}`}
                    style={{ width: `${fretWidthPct}%` }}
                    onClick={() => onNoteClick && onNoteClick(stringIdx, fret, note)}
                  >
                    {/* Fret marker dots */}
                    {hasMarker && <div className="fret-marker-dot" />}
                    {hasDoubleMarker && <div className="fret-marker-dot" />}

                    {/* Note dot */}
                    {isInScale && (
                      <div
                        className={`fret-note-dot ${
                          isActive
                            ? 'note-active'
                            : isRoot
                            ? 'note-root'
                            : 'note-scale'
                        }`}
                        role="button"
                        aria-label={`${note} at fret ${fret}${isActive ? ', playing' : ''}`}
                      >
                        <span className="note-label">{note}</span>
                        <span className="fret-label">{fret}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="fretboard-legend">
        <span className="legend-item">
          <span className="legend-dot root" aria-hidden="true"></span> Root
        </span>
        <span className="legend-item">
          <span className="legend-dot scale" aria-hidden="true"></span> Scale
        </span>
        <span className="legend-item">
          <span className="legend-dot active" aria-hidden="true"></span> Playing
        </span>
        {isPlaying && (
          <span className="legend-status">
            <span className="status-pulse"></span> Playing...
          </span>
        )}
      </div>
    </div>
  );
}

InteractiveFretboard.propTypes = {
  activeNotes: PropTypes.arrayOf(PropTypes.shape({
    string: PropTypes.number.isRequired,
    fret: PropTypes.number.isRequired
  })).isRequired,
  scaleNotes: PropTypes.arrayOf(PropTypes.string),
  root: PropTypes.string.isRequired,
  position: PropTypes.number,
  onNoteClick: PropTypes.func,
  isPlaying: PropTypes.bool,
  tuning: PropTypes.string
};

InteractiveFretboard.defaultProps = {
  scaleNotes: [],
  position: 1,
  onNoteClick: null,
  isPlaying: false,
  tuning: 'standard'
};

export default InteractiveFretboard;
