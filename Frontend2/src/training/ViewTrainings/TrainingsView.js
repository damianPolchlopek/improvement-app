import React, { useState, useEffect } from 'react';
import REST from '../../utils/REST';
import SingleTraining from './SingleTraining';
import './TrainingsView.css';

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
        <h2>TrainingView</h2>
          {trainingNames.map(trainingName => {
            return <SingleTraining 
                key={trainingName}
                trainingName={trainingName}
                />
            })}

      </div> : null}
    </React.Fragment>
  );
  
}
