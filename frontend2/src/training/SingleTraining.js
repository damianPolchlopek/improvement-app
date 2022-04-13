import React, { useState } from 'react';
import './SingleTraining.css';
import REST from '../utils/REST';

export default function SingleTraining(props){
  const [exercises, setExercises] = useState(null);
  const [isClicked, setIsClicked] = useState(false);

  function handleClick() {
    setIsClicked(!isClicked);
  
    getExercisesByTrainingName(props.trainingName);
  }
  
  function getExercisesByTrainingName(trainingName) {
    trainingName = trainingName.replace(/ /g,"_");
  
    REST.getExercises(trainingName).then(response => {
      setExercises(response.entity);
    });
  }

  function getExercisesByDate(date){
    REST.getExercisesByDate(date).then(response => {
      console.log('Date: ' + date)
      console.log(response.entity)
      setExercises(response.entity);
    });
  }

  function getExercisesByName(name){
    REST.getExercisesByName(name).then(response => {
      setExercises(response.entity);
    });
  }

  return (
    <div className='single-training-container'>
      <div className='single-training-header'>
        <span   onClick={() => handleClick()}>{props.trainingName}</span>
        <button onClick={() => props.deleteTraining(props.trainingName)}>Delete</button>
        <button onClick={() => props.updateTraining(props.trainingName)}>Modify</button>
      </div>

      <table hidden={!isClicked}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Name</th>
            <th>Repetition</th>
            <th>Weight</th>
          </tr>
        </thead>
    
        <tbody>
          {exercises ? exercises.map(exercise => {
              return <tr key={exercise.name + exercise.date}>
                  <td onClick={() => {getExercisesByDate(exercise.date)}}>{exercise.date}</td>
                  <td onClick={() => {getExercisesByName(exercise.name)}}>{exercise.name}</td>
                  <td>{exercise.reps}</td>
                  <td>{exercise.weight}</td>
              </tr>
          }) : null}
        </tbody>
      </table>
    </div>
  );
}