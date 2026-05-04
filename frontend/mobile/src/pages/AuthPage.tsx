import React from 'react';
import { IonContent, IonPage } from '@ionic/react';
import { AuthForm } from '@common/shared/ui-kit';

export function AuthPage(): React.JSX.Element {
  return (
    <IonPage>
      <IonContent fullscreen className="ion-padding">
        <AuthForm className="pt-8" />
      </IonContent>
    </IonPage>
  );
}
