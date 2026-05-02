import React from 'react';

import PatientPlaceholderWorkspace from '../../../shared/features/dashboard/components/PatientPlaceholderWorkspace';

export default function DashboardNotesPage() {
  return (
    <PatientPlaceholderWorkspace
      sectionHeading="My notes"
      sectionDescription="Your entries and filters will appear here. This section currently shows layout only."
    />
  );
}
