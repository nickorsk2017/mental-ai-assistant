import React, { useCallback } from 'react';
import { IonHeader, IonToolbar, useIonRouter } from '@ionic/react';
import { useAuthentication } from '@common/shared/hooks';
import { Button } from '@common/shared/ui-kit';
import { cx } from '@common/shared/utils';

interface PageHeaderProperties {
  title: string;
}

const roundedPageHeaderChromeClassNames = cx(
  'mx-auto flex w-full max-w-7xl items-center justify-between gap-4 rounded-[28px]',
  'border border-calm-border/60 bg-calm-surface/20 px-5 py-3 shadow-subtle backdrop-blur-md',
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
    <IonHeader translucent className="ion-no-border">
      <IonToolbar className="mt-[10px] min-h-0 [--background:transparent] [--border-width:0] bg-transparent px-4 pb-3 pt-[calc(1rem+var(--ion-safe-area-top,0px))]">
        <div className={roundedPageHeaderChromeClassNames}>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-calm-second">Serene</p>
            <p className="truncate text-sm text-calm-muted">{title}</p>
          </div>
          <Button
            type="button"
            aria-busy={isAuthenticating}
            disabled={isAuthenticating}
            variant="secondary"
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
