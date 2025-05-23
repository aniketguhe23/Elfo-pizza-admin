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
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import { paths } from '@/paths';
import { useUser } from '@/hooks/use-user';

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
  // terms: false,
};

export function SignUpForm(): React.JSX.Element {
  const router = useRouter();
  const { api_signUp } = ProjectApiList();
  const { checkSession } = useUser();
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

 const signUpFunction = async (values: Values) => {
  setIsPending(true);


  try {
    const formattedValues = {
      firstname: values.firstName,
      lastname: values.lastName,
      email: values.email,
      password: values.password,
    };

    const response = await axios.post(api_signUp, formattedValues);

    if (response.status === 201) {
      router.push('/auth/sign-in');
    } else {
      throw new Error('Signup failed');
    }
  } catch (err: unknown) {
    const message =
      axios.isAxiosError(err) && err.response?.data?.message
        ? err.response.data.message
        : 'Something went wrong';

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

      <form onSubmit={handleSubmit(signUpFunction)}>
        <Stack spacing={2}>
          <Controller
            control={control}
            name="firstName"
            render={({ field }) => (
              <FormControl error={Boolean(errors.firstName)}>
                <InputLabel>First name</InputLabel>
                <OutlinedInput {...field} label="First name" />
                {errors.firstName && <FormHelperText>{errors.firstName.message}</FormHelperText>}
              </FormControl>
            )}
          />

          <Controller
            control={control}
            name="lastName"
            render={({ field }) => (
              <FormControl error={Boolean(errors.lastName)}>
                <InputLabel>Last name</InputLabel>
                <OutlinedInput {...field} label="Last name" />
                {errors.lastName && <FormHelperText>{errors.lastName.message}</FormHelperText>}
              </FormControl>
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <FormControl error={Boolean(errors.email)}>
                <InputLabel>Email address</InputLabel>
                <OutlinedInput {...field} label="Email address" type="email" />
                {errors.email && <FormHelperText>{errors.email.message}</FormHelperText>}
              </FormControl>
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <FormControl error={Boolean(errors.password)}>
                <InputLabel>Password</InputLabel>
                <OutlinedInput {...field} label="Password" type="password" />
                {errors.password && <FormHelperText>{errors.password.message}</FormHelperText>}
              </FormControl>
            )}
          />

          {/* <Controller
            control={control}
            name="terms"
            render={({ field }) => (
              <div>
                <FormControlLabel
                  control={<Checkbox {...field} />}
                  label={
                    <>
                      I have read the{' '}
                      <Link
                        sx={{
                          color: '#de4a1c',
                          '&:hover': { color: '#bf3e18' },
                        }}
                      >
                        terms and conditions
                      </Link>
                    </>
                  }
                />
                {errors.terms && <FormHelperText error>{errors.terms.message}</FormHelperText>}
              </div>
            )}
          /> */}

          {errors.root && <Alert color="error">{errors.root.message}</Alert>}

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
            Sign up
          </Button>
        </Stack>
      </form>

      <Alert color="warning">Created users are not persisted</Alert>
    </Stack>
  );
}
