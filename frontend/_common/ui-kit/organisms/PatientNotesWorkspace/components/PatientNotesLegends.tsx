'use client';

import React from 'react';

import { usePatientMoodPresentation } from '../../../../hooks';

type MoodLegendRow = readonly [Entity.PatientNoteMoodBand, string, string];

const moodLegendRows: MoodLegendRow[] = [
  ['depression', 'Depression', '<= 4'],
  ['normal', 'Normal', '5-7'],
  ['euphoria', 'Euphoria', '>= 8'],
];

export default React.memo(function PatientNotesLegends() {
  const { resolveMoodDotClasses } = usePatientMoodPresentation();

  return (
    <div className="flex flex-wrap gap-3">
      {moodLegendRows.map(([band, label, scoreRange]) => (
        <div
          key={band}
          className="flex items-center gap-2 rounded-full border border-calm-border/55 bg-calm-surface/80 px-4 py-2 text-sm font-medium text-calm-text"
        >
          <span className={`h-2.5 w-2.5 rounded-full ${resolveMoodDotClasses(band)}`} />
          <span>{label}</span>
          <span className="text-calm-muted">{scoreRange}</span>
        </div>
      ))}
    </div>
  );
});
