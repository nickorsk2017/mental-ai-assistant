import React from 'react';

import PatientPlaceholderWorkspace from '../../../shared/features/dashboard/components/PatientPlaceholderWorkspace';

export default function DashboardAnalysisPage() {
  return (
    <PatientPlaceholderWorkspace
      sectionHeading="Analysis"
      sectionDescription="Mood summaries and trends based on your data will appear here. Only the shell is available for now."
    />
  );
}
