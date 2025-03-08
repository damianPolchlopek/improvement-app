import React from 'react';
import Cookies from 'universal-cookie';
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

  const submitLoginReq = () => {
    if (usernameIsInvalid || passwordIsInvalid) {
      return;
    }

    const userDetails = {
      username: enteredUsername,
      password: enteredPassword
    }

    REST.loginUser(userDetails).then(res => {
      const accessToken = res.token;
      const tokenType = res.type;
      const authorization = tokenType + ' ' + accessToken;

      const cookies = new Cookies();
      cookies.set('authorization', authorization);
      cookies.set('role', res.roles);

      window.location.reload()
    });
  }

  return (
    <CenteredContainer>
      <StyledPaper>
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
              onClick={submitLoginReq}
            >
              {t('login.submit')}
            </Button>
          </Grid>

        </Grid>
      </StyledPaper>
    </CenteredContainer>
  );
}
