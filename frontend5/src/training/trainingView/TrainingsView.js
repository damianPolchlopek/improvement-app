import React, {useEffect, useState} from 'react';
import REST from '../../utils/REST';
import SingleTraining from './SingleTraining';

import {
  CircularProgress,
  Container,
  List,
  Typography
} from '@mui/material';


export default function TrainingsView() {
  const [trainingNames, setTrainingNames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    REST.getAllTrainingNames()
      .then(response => {
        setTrainingNames(response.content);
        setLoading(false);
      })
      .catch(error => {
        console.error('Failed to fetch training names', error);
        setLoading(false);
      });
  }, []);

  return (
    <React.Fragment>
        <Container maxWidth="xl" sx={{ width: '70%' }}>
          <Typography variant="h4" component="div" style={{ color: 'white' }}>
            Training View
          </Typography>

          {loading ? <CircularProgress /> :
            <List>
              {trainingNames.map((trainingName) => (
                <SingleTraining key={trainingName} trainingName={trainingName} />
              ))}
            </List>}
        </Container>
    </React.Fragment>
  );
}
