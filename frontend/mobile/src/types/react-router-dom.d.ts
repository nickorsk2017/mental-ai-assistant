import type { ReactNode } from 'react';

declare module 'react-router-dom' {
  export interface BrowserRouterProps {
    children?: ReactNode;
  }
}
