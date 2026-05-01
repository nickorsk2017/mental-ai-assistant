import { useEffect } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { getActiveSession } from '@common/shared/services';
import { useAuthenticationStore } from '@common/shared/stores/useAuthStore';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';

setupIonicReact();

export function App(): React.JSX.Element {
  const currentUser = useAuthenticationStore((state) => state.currentUser);
  const isSessionInitialized = useAuthenticationStore((state) => state.isSessionInitialized);
  const setCurrentUser = useAuthenticationStore((state) => state.setCurrentUser);
  const clearCurrentUser = useAuthenticationStore((state) => state.clearCurrentUser);
  const markSessionInitialized = useAuthenticationStore((state) => state.markSessionInitialized);

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
      <IonReactRouter>
        <IonRouterOutlet>
          <Route
            exact
            path="/auth"
            render={() => {
              if (!isSessionInitialized) {return null;}

              if (currentUser) {return <Redirect to="/dashboard" />;}

              return <AuthPage />;
            }}
          />
          <Route
            exact
            path="/dashboard"
            render={() => {
              if (!isSessionInitialized) {return null;}

              if (!currentUser) {return <Redirect to="/auth" />;}

              return <DashboardPage />;
            }}
          />
          <Route
            exact
            path="/"
            render={() => {
              if (!isSessionInitialized) {return null;}

              return <Redirect to={currentUser ? '/dashboard' : '/auth'} />;
            }}
          />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
}
