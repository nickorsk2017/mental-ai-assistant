import { create } from 'zustand';

interface AuthenticationStoreState {
  currentUser: Entity.User | null;
  isAuthenticated: boolean;
  isSessionInitialized: boolean;
  setCurrentUser: (user: Entity.User | null) => void;
  clearCurrentUser: () => void;
  markSessionInitialized: () => void;
}

export const useAuthenticationStore = create<AuthenticationStoreState>((setState) => ({
  currentUser: null,
  isAuthenticated: false,
  isSessionInitialized: false,
  setCurrentUser: (user) =>
    setState({
      currentUser: user,
      isAuthenticated: Boolean(user),
    }),
  clearCurrentUser: () =>
    setState({
      currentUser: null,
      isAuthenticated: false,
    }),
  markSessionInitialized: () =>
    setState({ isSessionInitialized: true }),
}));
