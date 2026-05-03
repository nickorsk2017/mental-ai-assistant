import React from 'react';
import { IonContent, IonPage } from '@ionic/react';

import { MoodAnalysisWorkspace } from '@common/shared/ui-kit';

import { PageHeader } from '../../features/patient-panel/PageHeader';

export function PatientAnalysisPage(): React.JSX.Element {
  return (
    <IonPage>
      <PageHeader title="Analysis" />
      <IonContent fullscreen className="ion-padding bg-calm-surface">
        <MoodAnalysisWorkspace showHeading={false} />
      </IonContent>
    </IonPage>
  );
}
