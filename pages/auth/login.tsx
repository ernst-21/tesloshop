import React, { useEffect, useMemo, useState } from 'react';
import { GetServerSideProps } from 'next';
import NextLink from 'next/link';
import { AuthLayout } from '../../components/layouts';
import {
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  Link,
  TextField,
  Typography,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { validations } from '../../utils';
import { ErrorOutlined } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { getSession, signIn, getProviders } from 'next-auth/react';

type FormData = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const [showError, setShowError] = useState(false);
  const [providers, setProviders] = useState<any>({});

  useEffect(() => {
    getProviders().then((prov) => setProviders(prov));
  }, []);

  const destination = useMemo(() => {
    return router.query.p?.toString() || '/';
  }, [router]);

  const onLoginUser = async ({ email, password }: FormData) => {
    setShowError(false);

    // const isValidLogin = await loginUser(email, password);

    // if (!isValidLogin) {
    //   setShowError(true);
    //   setTimeout(() => {
    //     setShowError(false);
    //   }, 3000);
    //   return;
    // }

    // await router.replace(destination);
    await signIn('credentials', { email, password });
  };

  return (
    <AuthLayout title="Signin">
      <form onSubmit={handleSubmit(onLoginUser)} noValidate>
        <Box sx={{ width: 350, pading: '10px 20px' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h1" component="h1">
                Sign in
              </Typography>
              <Chip
                className="fadeIn"
                sx={{
                  display: showError ? 'flex' : 'none',
                  justifyContent: 'flex-start',
                }}
                label="Bad credentials"
                color="error"
                icon={<ErrorOutlined />}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                type="email"
                label="Email"
                variant="filled"
                fullWidth
                {...register('email', {
                  required: 'This field is required',
                  validate: validations.isEmail,
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Password"
                type="password"
                variant="filled"
                fullWidth
                {...register('password', {
                  required: 'This field is required',
                  minLength: {
                    value: 6,
                    message: 'Password must contain at least 6 characters',
                  },
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                color="secondary"
                className="circular-btn"
                size="large"
                fullWidth
              >
                Login
              </Button>
            </Grid>
            <Grid item xs={12} display="flex" justifyContent={'end'}>
              <NextLink href={`/auth/register?p=${destination}`} passHref>
                <Link underline="always">Don&apos;t have an account yet?</Link>
              </NextLink>
            </Grid>
            <Grid
              item
              xs={12}
              display="flex"
              flexDirection="column"
              justifyContent={'end'}
            >
              <Divider sx={{ mb: 2, width: '100%' }} />
              {Object.values(providers).map((prov: any) => {
                if (prov.id === 'credentials') return <div key={prov.id}></div>;

                return (
                  <Button
                    key={prov.id}
                    fullWidth
                    variant="outlined"
                    color="primary"
                    sx={{ mb: 1 }}
                    onClick={() => signIn(prov.id)}
                  >
                    {prov.name}
                  </Button>
                );
              })}
            </Grid>
          </Grid>
        </Box>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
}) => {
  const { p = '/' } = query;

  const session = await getSession({ req });

  if (session) {
    return {
      redirect: {
        destination: p.toString(),
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
