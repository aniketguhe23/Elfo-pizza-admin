'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import { useRouter } from 'next/navigation';
import ProjectApiList from '@/app/api/ProjectApiList';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Alert,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  Link,
  OutlinedInput,
  Stack,
  Typography,
} from '@mui/material';
import axios from 'axios';
import type { AxiosError } from 'axios';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import { paths } from '@/paths';

// import { useUser } from '@/hooks/use-user';

const schema = zod.object({
  firstName: zod.string().min(1, { message: 'First name is required' }),
  lastName: zod.string().min(1, { message: 'Last name is required' }),
  email: zod.string().min(1, { message: 'Email is required' }).email(),
  password: zod.string().min(6, { message: 'Password should be at least 6 characters' }),
});

type Values = zod.infer<typeof schema>;

const defaultValues: Values = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
};

export function SignUpForm(): React.JSX.Element {
  const router = useRouter();
  const { apiSignUp } = ProjectApiList();
  // const { _checkSession } = useUser(); // renamed with _ to suppress unused warning
  const [isPending, setIsPending] = React.useState(false);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Values>({
    defaultValues,
    resolver: zodResolver(schema),
  });

  // Explicit return type Promise<void>
  const signUpFunction = async (values: Values): Promise<void> => {
    setIsPending(true);

    try {
      const formattedValues = {
        firstname: values.firstName,
        lastname: values.lastName,
        email: values.email,
        password: values.password,
      };

      const response = await axios.post(apiSignUp, formattedValues);

      if (response.status === 201) {
        router.push('/auth/sign-in');
      } else {
        throw new Error('Signup failed');
      }
    } catch (err: unknown) {
      let message = 'Something went wrong';

      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<{ message?: string }>;
        message = axiosError.response?.data?.message ?? message;
      } else if (err instanceof Error) {
        message = err.message;
      }

      setError('root', {
        type: 'manual',
        message,
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Stack spacing={3}>
      <Stack spacing={1}>
        <Typography variant="h4">Sign up</Typography>
        <Typography color="text.secondary" variant="body2">
          Already have an account?{' '}
          <Link
            component={RouterLink}
            href={paths.auth.signIn}
            underline="hover"
            variant="subtitle2"
            sx={{
              color: '#164e63',
              '&:hover': {
                color: '#164e63',
              },
            }}
          >
            Sign in
          </Link>
        </Typography>
      </Stack>

      <form onSubmit={handleSubmit(signUpFunction)} noValidate>
        <Stack spacing={2}>
          <Controller
            control={control}
            name="firstName"
            render={({ field }) => (
              <FormControl error={Boolean(errors.firstName)} fullWidth>
                <InputLabel htmlFor="firstName-input">First name</InputLabel>
                <OutlinedInput {...field} label="First name" id="firstName-input" />
                {errors.firstName ? <FormHelperText>{errors.firstName.message}</FormHelperText> : null}
              </FormControl>
            )}
          />

          <Controller
            control={control}
            name="lastName"
            render={({ field }) => (
              <FormControl error={Boolean(errors.lastName)} fullWidth>
                <InputLabel htmlFor="lastName-input">Last name</InputLabel>
                <OutlinedInput {...field} label="Last name" id="lastName-input" />
                {errors.lastName ? <FormHelperText>{errors.lastName.message}</FormHelperText> : null}{' '}
              </FormControl>
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <FormControl error={Boolean(errors.email)} fullWidth>
                <InputLabel htmlFor="email-input">Email address</InputLabel>
                <OutlinedInput {...field} label="Email address" type="email" id="email-input" />
                {errors.email ? <FormHelperText>{errors.email.message}</FormHelperText> : null}{' '}
              </FormControl>
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <FormControl error={Boolean(errors.password)} fullWidth>
                <InputLabel htmlFor="password-input">Password</InputLabel>
                <OutlinedInput {...field} label="Password" type="password" id="password-input" />
                {errors.password ? <FormHelperText>{errors.password.message}</FormHelperText> : null}{' '}
              </FormControl>
            )}
          />

          {errors.root?.message ? <Alert severity="error">{errors.root.message}</Alert> : null}
          <Button
            disabled={isPending}
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: '#164e63',
              '&:hover': {
                backgroundColor: '#083344',
              },
            }}
          >
            {isPending ? 'Signing up...' : 'Sign up'}
          </Button>
        </Stack>
      </form>

      <Alert severity="warning">Created users are not persisted</Alert>
    </Stack>
  );
}
