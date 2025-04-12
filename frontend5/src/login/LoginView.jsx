import React from 'react';
import REST from '../utils/REST';
import { useTranslation } from 'react-i18next';

import {
  Button,
  Typography
} from '@mui/material';

import Grid from '@mui/material/Unstable_Grid2';

import { useInput } from './hooks/useInput';
import Input from './Input';
import CenteredContainer from '../component/CenteredContainer';
import StyledPaper from '../component/StyledPaper';
import { redirect, Form } from 'react-router-dom';

import jwt_decode from 'jwt-decode';

export default function LoginView() {
  const { t } = useTranslation();

  const {
    value: enteredUsername,
    handleInputChange: handleUsernameChange,
    handleInputBlur: handleUsernameBlur,
    hasError: usernameIsInvalid,
  } = useInput('', (value) => value.trim() !== '');

  const {
    value: enteredPassword,
    handleInputChange: handlePasswordChange,
    handleInputBlur: handlePasswordBlur,
    hasError: passwordIsInvalid,
  } = useInput('', (value) => value.trim() !== '');

  

  return (
    <CenteredContainer>
      <StyledPaper>
        <Form method="post">
          <Grid container spacing={4}>
            <Grid xs={12}>
              <Typography
                variant="h5"
                component="div"
              >
                {t('login.loginPanel')}
              </Typography>
            </Grid>

            <Grid xs={12}>
              <Input
                label={t('login.username')}
                id="username"
                name="username"
                onBlur={handleUsernameBlur}
                onChange={handleUsernameChange}
                value={enteredUsername}
                error={usernameIsInvalid && 'Please enter a valid username!'}
              />
            </Grid>

            <Grid xs={12}>
              <Input
                label={t('login.password')}
                id="password"
                name="password"
                type="password"
                onBlur={handlePasswordBlur}
                onChange={handlePasswordChange}
                value={enteredPassword}
                error={passwordIsInvalid && 'Please enter a valid password!'}
              />
            </Grid>

            <Grid xs={12}>
              <Button 
                variant="contained" 
                sx={{width: '25vh'}} 
                type='submit'
              >
                {t('login.submit')}
              </Button>
            </Grid>
          </Grid>
        </Form>
      </StyledPaper>
    </CenteredContainer>
  );
}

export async function action({ request }) {
  const data = await request.formData();

  const userDetails = {
    username: data.get('username'),
    password: data.get('password')
  };

  try {
    const res = await REST.loginUser(userDetails);

    const accessToken = res.token;
    const tokenType = res.type;
    const authorization = `${tokenType} ${accessToken}`;

    localStorage.setItem('authorization', authorization);
    localStorage.setItem('role', res.roles);

    const { exp } = jwt_decode(authorization)
    localStorage.setItem('expiration', exp);

    return redirect("/");
  } catch (err) {
    console.error("Login failed:", err);
    return null; // lub return json({ error: "Invalid login" }, { status: 401 });
  }
}