import React, {useEffect, useState} from 'react';
import REST from '../../utils/REST';
import SingleTraining from './SingleTraining';

import {
  Container,
  List,
  Typography
} from '@mui/material';


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

        <Container maxWidth="xl" sx={{width: '70%'}}>
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
