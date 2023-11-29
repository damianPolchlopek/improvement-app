import React, { useState, useEffect } from 'react';
import REST from '../../utils/REST';

import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import SingleTraining from './SingleTraining';
import Container from '@mui/material/Container';

export default function TrainingsView() {
  const [trainingNames, setTrainingNames] = useState(null);
    
  useEffect(() => {
    REST.getAllTrainingNames().then(response => {
      console.log(response)
      setTrainingNames(response.content);
    });
  }, []);

  return (
    <React.Fragment>
      {trainingNames ? 

      <Container maxWidth="xl" sx={{ width: '70%'}}>
        <Typography variant="h4" component="div" style={{color: 'white'}}>
          Training View
        </Typography>

        <List>
          {trainingNames.map((trainingName) => {
            return (
              <SingleTraining 
                  key={trainingName}
                  trainingName={trainingName}
                />
            );
          })}
        </List>
        
      </Container> : null} 
    </React.Fragment>
  );
  
}
