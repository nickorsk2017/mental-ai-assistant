import React from 'react';
import { IonContent, IonPage, useIonRouter } from '@ionic/react';
import { DashboardOrganism } from '@common/shared/ui-kit';

export function DashboardPage(): React.JSX.Element {
  const ionRouter = useIonRouter();

  return (
    <IonPage>
      <IonContent fullscreen>
        <DashboardOrganism onSignedOut={() => ionRouter.push('/auth', 'root', 'replace')} />
      </IonContent>
    </IonPage>
  );
}
