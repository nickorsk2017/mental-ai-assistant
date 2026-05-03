'use client';

import React, { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSignUp } from '@common/shared/hooks';
import { signUpWithEmailAndPassword } from '@common/shared/services';
import { signUpValidationSchema } from '@common/shared/schemas/auth.zod';
import Button from '../../../atoms/Button/Button';
import TextInput from '../../../molecules/TextInput/TextInput';

interface SignUpFormValues {
  displayName: string;
  emailAddress: string;
  password: string;
  confirmPassword: string;
}

const initialSignUpFormValues: SignUpFormValues = {
  displayName: '',
  emailAddress: '',
  password: '',
  confirmPassword: '',
};

interface AuthSignUpFieldsProps {
  onSignedUp?: () => void;
}

export const AuthSignUpFields = React.memo(function AuthSignUpFields({ onSignedUp }: AuthSignUpFieldsProps) {
  const signUpForm = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpValidationSchema),
    defaultValues: initialSignUpFormValues,
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });
  const signUpServiceClient = useMemo(() => ({ signUp: signUpWithEmailAndPassword }), []);
  const { signUp } = useSignUp(signUpServiceClient);
  const { errors, isSubmitted } = signUpForm.formState;
  const formValues = signUpForm.watch();

  const handleFieldChange = useCallback(
    (fieldName: keyof SignUpFormValues, value: string) => {
      signUpForm.setValue(fieldName, value, { shouldValidate: isSubmitted });
    },
    [isSubmitted, signUpForm],
  );

  const handleSignUpSubmit = signUpForm.handleSubmit(async (values) => {
    const signUpResponse = await signUp(values);
    if (signUpResponse.success) {
      signUpForm.reset(initialSignUpFormValues);
      onSignedUp?.();
    }
  });

  const fields: Array<{ name: keyof SignUpFormValues; placeholder: string; type?: 'password' }> = [
    { name: 'displayName', placeholder: 'Display name' },
    { name: 'emailAddress', placeholder: 'Email address' },
    { name: 'password', placeholder: 'Password', type: 'password' },
    { name: 'confirmPassword', placeholder: 'Confirm password', type: 'password' },
  ];

  return (
    <form onSubmit={handleSignUpSubmit} className="flex min-h-0 flex-1 flex-col gap-4 py-2">
      {fields.map((field) => (
        <div key={field.name} className="flex flex-col gap-1">
          <TextInput
            value={formValues[field.name]}
            onChange={(value) => handleFieldChange(field.name, value)}
            placeholder={field.placeholder}
            type={field.type ?? 'text'}
            errorMessage={isSubmitted ? (errors[field.name]?.message as string) : undefined}
            autoFocus={field.name === 'displayName'}
          />
        </div>
      ))}
      <Button type="submit" variant="black" className="mt-auto">
        Create Account
      </Button>
    </form>
  );
});
