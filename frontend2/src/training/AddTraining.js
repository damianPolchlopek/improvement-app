import React, { useEffect, useState } from "react";
import './AddTraining.css';
import REST from '../utils/REST';

function submitFun(values) {
  console.log('Submit Training');
  console.log(values);
}

function getExerciseNames() {
  console.log('GetExerciseNames');
  REST.getExerciseNames().then(response => {
    return response.entity;
  });
}

function AddTraining(props) {
  const [exercises, setExercises] = useState(0);
  const [exerciseNames, setExerciseNames] = useState(0);
  const [exercisePlaces, setExercisePlaces] = useState(0);
  const [exerciseProgresses, setExerciseProgresses] = useState(0);
  const [exerciseTypes, setExerciseTypes] = useState(0);
  const [isSimpleForm, setIsSimpleForm] = useState(false);

  useEffect(() => {
    REST.getExerciseNames().then(response => {
      setExerciseNames(response.entity);
    });

    REST.getExercisePlaces().then(response => {
      setExercisePlaces(response.entity);
    });

    REST.getExerciseProgresses().then(response => {
      setExerciseProgresses(response.entity);
    });

    REST.getExerciseTypes().then(response => {
      setExerciseTypes(response.entity);
    });

  }, []);

  return (
    <React.Fragment>
        <h2>Choose training type to add </h2>
        <form onSubmit={(data) => submitFun(data)}>
          <select name="type">
            <option value="A">Siłowy A</option>
            <option value="B">Siłowy B</option>
            <option value="C">Hipertroficzny C</option>
            <option value="D">Hipertroficzny D</option>
          </select>

          <button type='submit'>Submit</button>
        </form>

        <div>
          <input type='checkbox' onClick={() => {setIsSimpleForm(!isSimpleForm)}}/>
          <label>Enable a more accurate form</label>
        </div>

        <h3 className="text-center">Training Schema</h3>
        

    </React.Fragment>
  );
}

export default AddTraining;