import React from 'react';

import { resolveMoodDotClasses, type MoodBand } from '../utils/PatientMoodPresentation';

const legendItems: Array<{ band: MoodBand; label: string; range: string }> = [
  { band: 'depression', label: 'Depression', range: '<= 4' },
  { band: 'normal', label: 'Normal', range: '5-7' },
  { band: 'euphoria', label: 'Euphoria', range: '>= 8' },
];

export default function PatientMoodLegend() {
  return (
    <div className="flex flex-wrap gap-3">
      {legendItems.map((item) => (
        <div
          key={item.band}
          className="flex items-center gap-2 rounded-full border border-calm-border/55 bg-calm-surface/80 px-4 py-2 text-sm font-medium text-calm-text"
        >
          <span className={`h-2.5 w-2.5 rounded-full ${resolveMoodDotClasses(item.band)}`} />
          <span>{item.label}</span>
          <span className="text-calm-muted">{item.range}</span>
        </div>
      ))}
    </div>
  );
}
