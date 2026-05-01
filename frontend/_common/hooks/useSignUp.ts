import { useCallback } from 'react';

interface SignUpServiceClient {
  signUp: (
    emailAddress: string,
    password: string,
    displayName: string,
  ) => Promise<{ success: boolean; data: unknown; error: string | null }>;
}

interface SignUpFormValues {
  emailAddress: string;
  password: string;
  displayName: string;
}

export function useSignUp(signUpServiceClient: SignUpServiceClient) {
  const signUp = useCallback(
    async (formValues: SignUpFormValues) => {
      return signUpServiceClient.signUp(
        formValues.emailAddress,
        formValues.password,
        formValues.displayName,
      );
    },
    [signUpServiceClient],
  );

  return { signUp };
}
