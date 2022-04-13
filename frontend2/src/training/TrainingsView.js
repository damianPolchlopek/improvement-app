import React, { useState, useEffect } from 'react';
import REST from '../utils/REST';
import SingleTraining from './SingleTraining';
import './TrainingsView.css';

export default function TrainingsView() {

  const [trainingNames, setTrainingNames] = useState(null);
    
  useEffect(() => {
    REST.getAllTrainingNames().then(response => {
      setTrainingNames(response.entity);
    });
  }, []);

  function deleteTraining(trainingName) {
    console.log("Delete training: ");
    console.log(trainingName)
  }

  function updateTraining(trainingName) {
      console.log("Update training: ");
      console.log(trainingName)
  }

  return (
    <div className='training-list-container'>
      {trainingNames ? 
      <div className='training-list'>
        <h2>TrainingView</h2>
          {trainingNames.map(trainingName => {
            return <SingleTraining 
                key={trainingName}
                trainingName={trainingName}
                
                deleteTraining={deleteTraining}
                updateTraining={updateTraining}
                />
            })}

      </div> : null}
    </div>
  );
  
}
