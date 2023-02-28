import React, { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';

import REST from '../utils/REST';

import Grid from '@mui/material/Unstable_Grid2';

import TextField from '@mui/material/TextField';
import Typography from "@mui/material/Typography";

import FormControl from "@mui/material/FormControl";

import Button from '@mui/material/Button';
import { Paper } from '@mui/material';
import Box from '@mui/material/Box';

export default function LoginView(props) {
  const [userDetails, setUserDetails] = useState(
    {
      username: '', 
      password: ''
    }
  )

  const handleFormChange = (event) => {
    var new_obj = userDetails;
    new_obj[event.target.name] = event.target.value
    setUserDetails(new_obj);
  }

  const submit = (e) => {
    e.preventDefault();
    console.log(userDetails)
  }

  const submit2 = () => {
    REST.loginUser(userDetails).then(res => {
      console.log(res);

      const accessToken = res.accessToken;
      const tokenType = res.tokenType;
      var authorization = tokenType + ' ' + accessToken
      const cookies = new Cookies();
      cookies.set('authorization', authorization);
      cookies.set('role', res.roles[0]);

      // props.history.push('/')
      window.location.reload(false)
  });
  }

  return (
    <Box sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh"}}
    >
      <Paper elevation={18} sx={{width: '70vh', 
                                height: '70vh', 
                                alignItems: "center", 
                                textAlign: 'center', 
                                display: 'flex'}}>
        <Grid container spacing={4}>
          <Grid xs={12}>
            <Typography 
              variant="h5" 
              component="div" 
            >
              Login Panel
            </Typography>
          </Grid>

          <Grid xs={12}>
            <FormControl sx={{width: '30vh'}}>
              <TextField
                label="Username"
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
                label="Password"
                name='password'
                placeholder='password'
                type='password'
                onChange={event => handleFormChange(event)}
                variant="outlined"
              />
            </FormControl>
          </Grid>

          <Grid xs={12}>
            <Button variant="contained" sx={{width: '25vh'}} onClick={submit2}>Submit</Button>
          </Grid>

        </Grid>
      </Paper>
    </Box>
  );
}
