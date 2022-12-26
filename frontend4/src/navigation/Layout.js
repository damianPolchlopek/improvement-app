import React from 'react';

import AppBar from './AppBar';
import Container from '@mui/material/Container';

export default function Layout(props) {

  return (
    <React.Fragment>
      <AppBar/>

      <Container style={{width:'10%', minHeight: '5vh'}} />

      <Container style={{width:'70%', minHeight: '90vh'}}>
        {props.children}
      </Container>
      
    </React.Fragment>
  );
}