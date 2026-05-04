import React, { useCallback } from 'react';
import { IonHeader, IonToolbar, useIonRouter } from '@ionic/react';
import { useAuthentication } from '@common/shared/hooks';
import { Button } from '@common/shared/ui-kit';
import { cx } from '@common/shared/utils';

interface PageHeaderProperties {
  title: string;
}

const roundedPageHeaderClassNames = cx(
  'mx-auto flex w-full max-w-7xl items-center justify-between gap-4 rounded-[28px]',
  'border border-calm-border/60 bg-transparent px-5 py-3 shadow-none backdrop-blur-xl',
  'transition-all duration-300',
);

export function PageHeader({
  title,
}: PageHeaderProperties): React.JSX.Element {
  const ionRouter = useIonRouter();
  const { logout, isAuthenticating } = useAuthentication();

  const handleSignOut = useCallback(async () => {
    const didSignOut = await logout();

    if (didSignOut) {
      ionRouter.push('/auth', 'root', 'replace');
    }
  }, [logout, ionRouter]);

  return (
    <IonHeader className="ion-no-border  !shadow-none bg-surface [--border-width:0] [--box-shadow:none]">
      <IonToolbar className="mt-[10px] min-h-0 !border-none !bg-transparent !shadow-none !backdrop-blur-none [--background:transparent] [--border-width:0] [--box-shadow:none] px-4 pb-3 pt-[calc(1rem+var(--ion-safe-area-top,0px))]">
        <div className={roundedPageHeaderClassNames}>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-calm-primary">Mental Health</p>
            <p className="truncate text-sm text-calm-muted">{title}</p>
          </div>
          <Button
            type="button"
            aria-busy={isAuthenticating}
            disabled={isAuthenticating}
            variant="primary"
            size="small"
            onClick={() => void handleSignOut()}
            wide={false}
            rounded
          >
            Log out
          </Button>
        </div>
      </IonToolbar>
    </IonHeader>
  );
}
