import React, { useEffect, useState } from "react";
import './AddTraining.css';
import REST from '../../utils/REST';

function AddTraining(props) {
  var exercisess = [{name: 'aaa', reps: '1/1/1', place: 'Siłownia'}, 
                    {name: 'sss', place: 'Dom'}];
  const [exercises, setExercises] = useState(exercisess);
  const [exerciseNames, setExerciseNames] = useState(0);
  const [exercisePlaces, setExercisePlaces] = useState(0);
  const [exerciseProgresses, setExerciseProgresses] = useState(0);
  const [exerciseTypes, setExerciseTypes] = useState(0);
  const [isSimpleForm, setIsSimpleForm] = useState(true);

  const [trainingType, setTrainingType] = useState('A');

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

  }, [exercises]);

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

      <div>
        <h3>Training Schema</h3>
        <form onSubmit={() => {console.log(exercises)}}>
          <table>
            <thead>
              <tr>
                <th hidden={isSimpleForm}>#</th>
                <th hidden={isSimpleForm}>Type</th>
                <th hidden={isSimpleForm}>Place</th>
                <th>Name</th>
                <th>Reps</th>
                <th>Weight</th>
                <th>Progress</th>
                <th hidden={isSimpleForm}>Options</th>
              </tr>
            </thead>
            <tbody>
              {exercises ? exercises.map((exercise, index) => (
                <tr key={index}>
                  <td hidden={isSimpleForm}>{index}</td>
                  <td hidden={isSimpleForm}>
                    <select name='type' defaultValue={exercises[index].type}>
                      {exerciseTypes ? exerciseTypes.map(exerciseType => {
                        return(
                          <option key={exerciseType.type} value={exerciseType.type}>
                            {exerciseType.type}
                          </option>
                        );
                      }) : null}
                    </select>
                  </td>
                  <td hidden={isSimpleForm}>
                    <select name='place' defaultValue={exercises[index].place}>
                      {exercisePlaces ? exercisePlaces.map(exercisePlace => {
                        return(
                          <option key={exercisePlace.place} value={exercisePlace.place}>
                            {exercisePlace.place}
                          </option>
                        );
                      }) : null}
                    </select>
                  </td>
                  <td>
                    <select name='name' defaultValue={exercises[index].name}>
                      {exerciseNames ? exerciseNames.map(exerciseName => {
                        return(
                          <option key={exerciseName.name} value={exerciseName.name}>
                            {exerciseName.name}
                          </option>
                        );
                      }) : null}
                    </select>
                  </td>
                  <td><input name={`exercises[${index}].reps`} defaultValue={exercises[index].reps}/></td>
                  <td><input name={`exercises[${index}].weight`} defaultValue={exercises[index].weight}/></td>
                  <td>
                    <select name='progress' defaultValue={exercises[index].progress}>
                      {exerciseProgresses ? exerciseProgresses.map(exerciseProgress => {
                        return(
                          <option key={exerciseProgress.progress} value={exerciseProgress.progress}>
                            {exerciseProgress.progress}
                          </option>
                        );
                      }) : null}
                    </select>
                  </td>
                  <td>
                    <button onClick={() => addTraining(exercises)}>Add</button>
                    <button>Remove</button>
                  </td>

                </tr>
              )) : null}
            </tbody>
          </table>

        </form>
        <button onClick={() => addTraining(exercises)}>Submit</button>
      </div>

        {/* <button onClick={() => console.log(exercises)}>Show Exercises</button> */}
        
    </div>
  );
}

export default AddTraining;