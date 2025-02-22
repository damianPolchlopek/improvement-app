import React, { useState } from 'react';
import Cookies from 'universal-cookie';
import REST from '../utils/REST';
import { useTranslation } from 'react-i18next';

import {
  Box,
  Button,
  FormControl,
  Paper,
  TextField,
  Typography,
} from '@mui/material';

import Grid from '@mui/material/Unstable_Grid2';

export default function LoginView(props) {
  const [userDetails, setUserDetails] = useState(
    {
      username: '',
      password: ''
    }
  );
  const { t } = useTranslation();

  const handleFormChange = (event) => {
    var new_obj = userDetails;
    new_obj[event.target.name] = event.target.value
    setUserDetails(new_obj);
  }

  const submitLoginReq = () => {
    REST.loginUser(userDetails).then(res => {

      const accessToken = res.token;
      const tokenType = res.type;
      const authorization = tokenType + ' ' + accessToken;

      const cookies = new Cookies();
      cookies.set('authorization', authorization);
      cookies.set('role', res.roles);

      // props.history.push('/')
      window.location.reload()
    });
  }

  return (
    <Box sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh"
    }}
    >
      <Paper elevation={18} sx={{
        width: '70vh',
        height: '70vh',
        alignItems: "center",
        textAlign: 'center',
        display: 'flex'
      }}>
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
            <FormControl sx={{width: '30vh'}}>
              <TextField
                label={t('login.username')}
                name='username'
                placeholder='username'
                onChange={event => handleFormChange(event)}
                variant="outlined"
              />
            </FormControl>
          </Grid>

          <Grid xs={12}>
            <FormControl sx={{width: '30vh'}}>
              <TextField
                label={t('login.password')}
                name='password'
                placeholder='password'
                type='password'
                onChange={event => handleFormChange(event)}
                variant="outlined"
              />
            </FormControl>
          </Grid>

          <Grid xs={12}>
            <Button variant="contained" sx={{width: '25vh'}} onClick={submitLoginReq}>{t('login.submit')}</Button>
          </Grid>

        </Grid>
      </Paper>
    </Box>
  );
}
