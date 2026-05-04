import { Capacitor } from '@capacitor/core';
import { useEffect } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { getActiveSession } from '@common/shared/services';
import { useAuthenticationStore } from '@common/shared/stores/useAuthStore';
import { AuthorWelcomeModal } from '@common/shared/ui-kit';
import { registerMobileBackendClient } from '@common/shared/utils';
import { createCapacitorMobileBackendClient } from './libs/CapacitorMobileBackendClient';
import { TabsLayout } from './features/patient-panel/TabsLayout';
import { AuthPage } from './pages/AuthPage';

setupIonicReact();

export function App(): React.JSX.Element {
  const currentUser = useAuthenticationStore((state) => state.currentUser);
  const isSessionInitialized = useAuthenticationStore((state) => state.isSessionInitialized);
  const setCurrentUser = useAuthenticationStore((state) => state.setCurrentUser);
  const clearCurrentUser = useAuthenticationStore((state) => state.clearCurrentUser);
  const markSessionInitialized = useAuthenticationStore((state) => state.markSessionInitialized);

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      registerMobileBackendClient(createCapacitorMobileBackendClient());
    } else {
      registerMobileBackendClient();
    }

    return () => {
      registerMobileBackendClient();
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function initializeSession() {
      const activeSessionResponse = await getActiveSession();

      if (!isMounted) {return;}

      if (activeSessionResponse.success && activeSessionResponse.data?.user) {
        setCurrentUser(activeSessionResponse.data.user);
      } else {
        clearCurrentUser();
      }

      markSessionInitialized();
    }

    void initializeSession();

    return () => {
      isMounted = false;
    };
  }, [clearCurrentUser, markSessionInitialized, setCurrentUser]);

  return (
    <IonApp>
      <AuthorWelcomeModal userId={currentUser?.id ?? null} />
      <IonReactRouter>
        <IonRouterOutlet>
          <Route
            exact
            path="/auth"
            render={() => {
              if (!isSessionInitialized) {return null;}

              if (currentUser) {return <Redirect to="/patient-panel/chat" />;}

              return <AuthPage />;
            }}
          />
          <Route
            path="/patient-panel"
            render={() => {
              if (!isSessionInitialized) {return null;}

              if (!currentUser) {return <Redirect to="/auth" />;}

              return <TabsLayout />;
            }}
          />
          <Route
            exact
            path="/dashboard"
            render={() => {
              if (!isSessionInitialized) {return null;}

              if (!currentUser) {return <Redirect to="/auth" />;}

              return <Redirect to="/patient-panel/chat" />;
            }}
          />
          <Route
            exact
            path="/"
            render={() => {
              if (!isSessionInitialized) {return null;}

              return <Redirect to={currentUser ? '/patient-panel/chat' : '/auth'} />;
            }}
          />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
}
