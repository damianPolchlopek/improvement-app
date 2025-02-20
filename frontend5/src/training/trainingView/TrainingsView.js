import React, {useEffect, useState} from 'react';
import REST from '../../utils/REST';
import SingleTraining from './SingleTraining';
import { useTranslation } from 'react-i18next';

import {
  CircularProgress,
  Container,
  List,
  Typography
} from '@mui/material';


export default function TrainingsView() {
  const [trainingNames, setTrainingNames] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

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
            {t('messages.trainingView')}
          </Typography>

          {loading ? <CircularProgress /> :
            <List>
              {trainingNames.map((training) => (
                <SingleTraining key={training.id} trainingName={training} />
              ))}
            </List>}
        </Container>
    </React.Fragment>
  );
}
