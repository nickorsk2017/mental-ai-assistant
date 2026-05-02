import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import {
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from '@ionic/react';
import {
  analyticsOutline,
  chatbubbleEllipsesOutline,
  documentTextOutline,
} from 'ionicons/icons';
import { patientPanelMobileTabRoutes } from '@common/shared/constants';

import { PatientAnalysisPage } from '../../pages/patient-panel/PatientAnalysisPage';
import { AssistantPage } from '../../pages/patient-panel/AssistantPage';
import { PatientNotesPage } from '../../pages/patient-panel/PatientNotesPage';

const bottomNavigationTabIonIcons = [
  chatbubbleEllipsesOutline,
  documentTextOutline,
  analyticsOutline,
] as const;

export function TabsLayout(): React.JSX.Element {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/patient-panel" render={() => <Redirect to="/patient-panel/chat" />} />
        <Route exact path="/patient-panel/chat" component={AssistantPage} />
        <Route exact path="/patient-panel/notes" component={PatientNotesPage} />
        <Route exact path="/patient-panel/analysis" component={PatientAnalysisPage} />
      </IonRouterOutlet>
      <IonTabBar
        slot="bottom"
        className="patient-panel-tab-bar border-t border-calm-border/50 bg-calm-surface/95"
      >
        {patientPanelMobileTabRoutes.map(([href, label], routeIndex) => {
          const pathSegment = href.replace('/patient-panel/', '');

          return (
            <IonTabButton key={href} tab={pathSegment} href={href} className="text-calm-text">
              <IonIcon icon={bottomNavigationTabIonIcons[routeIndex]} />
              <IonLabel className="text-xs font-medium">{label}</IonLabel>
            </IonTabButton>
          );
        })}
      </IonTabBar>
    </IonTabs>
  );
}
