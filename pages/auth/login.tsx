import React, { useState } from 'react';
import NextLink from 'next/link';
import { AuthLayout } from '../../components/layouts';
import { Box, Button, Chip, Grid, Link, TextField, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { validations } from '../../utils';
import { tesloApi } from '../../api';
import { ErrorOutlined } from '@mui/icons-material';

type FormData = {
    email: string,
    password: string,
};

const LoginPage = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
    const [showError, setShowError] = useState(false);

    const onLoginUser = async ({ email, password }: FormData) => {
        try {
            const { data } = await tesloApi.post('/user/login', { email, password });
            const { token, user } = data;
            console.log({ token, user });
        } catch (error) {
            setShowError(true);
            setTimeout(() => {
                setShowError(false);
            }, 3000);
        }

        // todo: navigate to previous screen or home
    };

    return (
        <AuthLayout title='Ingresar'>
            <form onSubmit={handleSubmit(onLoginUser)} noValidate>
                <Box sx={{ width: 350, pading: '10px 20px' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant='h1' component='h1'>
                                Sign in
                            </Typography>
                            <Chip className='fadeIn'
                                  sx={{ display: showError ? 'flex' : 'none', justifyContent: 'flex-start' }}
                                  label='Bad credentials'
                                  color='error'
                                  icon={<ErrorOutlined />}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                type='email'
                                label='Email'
                                variant='filled'
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
                                label='Password'
                                type='password'
                                variant='filled'
                                fullWidth
                                {...register('password', {
                                    required: 'This field is required',
                                    minLength: { value: 6, message: 'Password must contain at least 6 characters' },
                                })}
                                error={!!errors.password}
                                helperText={errors.password?.message}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Button
                                type='submit'
                                color='secondary'
                                className='circular-btn'
                                size='large'
                                fullWidth
                            >
                                Login
                            </Button>
                        </Grid>
                        <Grid item xs={12} display='flex' justifyContent={'end'}>
                            <NextLink href={'/auth/register'} passHref>
                                <Link underline='always'>Don't have an account yet?</Link>
                            </NextLink>
                        </Grid>
                    </Grid>
                </Box>
            </form>
        </AuthLayout>
    );
};

export default LoginPage;
