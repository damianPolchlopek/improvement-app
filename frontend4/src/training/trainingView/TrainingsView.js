import React, { useState, useEffect } from 'react';
import REST from '../../utils/REST';

import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import SingleTraining from './SingleTraining';

export default function TrainingsView() {
  const [trainingNames, setTrainingNames] = useState(null);
    
  useEffect(() => {
    REST.getAllTrainingNames().then(response => {
      setTrainingNames(response.entity);
    });
  }, []);

  return (
    <React.Fragment>
      {trainingNames ? 

      <div className='training-list'>
        <Typography variant="h4" component="div" style={{color: 'white'}}>
          TrainingView
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
        
      </div> : null} 
    </React.Fragment>
  );
  
}
