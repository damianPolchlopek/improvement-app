import React, { useEffect, useState } from "react";
import './AddTrainingView.css';
import REST from '../../utils/REST';
import TrainingForm from './TrainingForm';

function AddTrainingView(props) {
  var exercisess = [{name: 'aaa', reps: '1/1/1', place: 'Siłownia'}, 
                    {name: 'sss', place: 'Dom'}];
  const [exercises, setExercises] = useState(exercisess);
  const [isSimpleForm, setIsSimpleForm] = useState(true);
  const [trainingType, setTrainingType] = useState('A');

  function loadLastTraining() {
    setExercises([]);

    REST.getTrainingByType(trainingType).then(response => {
      setExercises(response.entity);
    });
  }

  function addTraining(){
    REST.addTraining(exercises).then(response => {
      props.history.push('/add-training')
      window.location.reload(false)
    });
  }

  return (
    <div>
      <div>
        <h2>Choose training type to add </h2>
        <form>
          <select name="type" onChange={(e => setTrainingType(e.target.value))}>
            <option value="A">Siłowy A</option>
            <option value="B">Siłowy B</option>
            <option value="C">Hipertroficzny C</option>
            <option value="D">Hipertroficzny D</option>
          </select>
        </form>

        <button onClick={() => loadLastTraining()}>Load last training</button>
      </div>
       
      <div>
        <input type='checkbox' onClick={() => {setIsSimpleForm(!isSimpleForm)}}/>
        <label>Enable a more accurate form</label>
      </div>

      <TrainingForm
        isSimpleForm={isSimpleForm}
        exercises={exercises}
        submitFunction={addTraining}
      />
        
    </div>
  );
}

export default AddTrainingView;