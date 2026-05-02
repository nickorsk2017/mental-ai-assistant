import React from 'react';
import { IonContent, IonPage } from '@ionic/react';

import { PageHeader } from '../../features/patient-panel/PageHeader';

export function PatientAnalysisPage(): React.JSX.Element {
  return (
    <IonPage>
      <PageHeader title="Analysis" />
      <IonContent fullscreen className="ion-padding bg-calm-surface">
        <div className="mx-auto mt-8 max-w-md rounded-[28px] border border-calm-border/50 bg-calm-background/60 px-6 py-10 text-center shadow-subtle">
          <p className="text-sm leading-7 text-calm-muted">
            Mood summaries and trends will appear here. This screen is a placeholder on mobile for now.
          </p>
        </div>
      </IonContent>
    </IonPage>
  );
}
