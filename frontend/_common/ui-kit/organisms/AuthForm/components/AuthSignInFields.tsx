'use client';

import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthentication } from '@common/shared/hooks';
import { signInValidationSchema } from '@common/shared/schemas/auth.zod';
import Button from '../../../atoms/Button/Button';
import TextInput from '../../../molecules/TextInput/TextInput';

interface SignInFormValues {
  emailAddress: string;
  password: string;
}

const initialSignInFormValues: SignInFormValues = { emailAddress: '', password: '' };

export const AuthSignInFields = React.memo(function AuthSignInFields() {
  const signInForm = useForm<SignInFormValues>({
    resolver: zodResolver(signInValidationSchema),
    defaultValues: initialSignInFormValues,
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  const { login, isAuthenticating, authenticationError } = useAuthentication();
  const formValues = signInForm.watch();
  const { errors, isSubmitted } = signInForm.formState;

  const handleFormFieldChange = useCallback(
    (fieldName: keyof SignInFormValues, value: string) => {
      signInForm.setValue(fieldName, value, { shouldValidate: isSubmitted });
    },
    [signInForm],
  );

  const handleSignInSubmit = signInForm.handleSubmit(async (values) => {
    await login({ email: values.emailAddress, password: values.password });
  });

  return (
    <form onSubmit={handleSignInSubmit} className="flex flex-col gap-4">
      {authenticationError ? <div className="bg-calm-error-light text-calm-error rounded-xl p-4 text-sm">{authenticationError}</div> : null}
      <TextInput
        value={formValues.emailAddress}
        onChange={(value: string) => handleFormFieldChange('emailAddress', value)}
        placeholder="Your e-mail"
        autoComplete="email"
        errorMessage={errors.emailAddress?.message as string}
      />
      <TextInput
        value={formValues.password}
        onChange={(value: string) => handleFormFieldChange('password', value)}
        placeholder="Password"
        type="password"
        autoComplete="current-password"
        errorMessage={errors.password?.message as string}
      />
      <div className="absolute bottom-0 left-0 right-0 md:static py-4 px-10 md:px-0">
        <Button onClick={() => handleSignInSubmit()} isLoading={isAuthenticating}>
          {isAuthenticating ? 'Loading...' : 'Login'}
        </Button>
      </div>
    </form>
  );
});
