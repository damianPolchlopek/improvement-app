import React, { useEffect, useState } from "react";
import REST from '../../utils/REST';
import "./TrainingFormSmallScreen.css";

export default function TrainingFormSmallScreen(props) {
    var exercisess = [{name: 'aaa', reps: '1/1/1', place: 'Siłownia'}, 
                    {name: 'sss', place: 'Dom'}];
    const [exercises, setExercises] = useState(exercisess);
    const [exerciseNames, setExerciseNames] = useState(0);
    const [exercisePlaces, setExercisePlaces] = useState(0);
    const [exerciseProgresses, setExerciseProgresses] = useState(0);
    const [exerciseTypes, setExerciseTypes] = useState(0);

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

    useEffect(() => {
      setExercises(props.exercises)
    });

    return(
      <div>
        <h3>Training Schema</h3>
        <form>
          {exercises ? exercises.map((exercise, index) => (
            <table>
              <tr>
                <th hidden={props.isSimpleForm}>#</th>
                <td hidden={props.isSimpleForm}>{index}</td>
              </tr>
              <tr>
                <th hidden={props.isSimpleForm}>Type</th>
                <td hidden={props.isSimpleForm}>
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
              </tr>
              <tr>
                <th hidden={props.isSimpleForm}>Place</th>
                <td hidden={props.isSimpleForm}>
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
              </tr>
              <tr>
                <th>Name</th>
                <td>
                  <select name='name' defaultValue={exercises[index].name} className="select">
                    {exerciseNames ? exerciseNames.map(exerciseName => {
                      return(
                        <option key={exerciseName.name} value={exerciseName.name}>
                          {exerciseName.name}
                        </option>
                      );
                    }) : null}
                  </select>
                </td>
              </tr>
              <tr>
                <th>Reps</th>
                <td><input name={`exercises[${index}].reps`} defaultValue={exercises[index].reps}/></td>
              </tr>
              <tr>
                <th>Weight</th>
                <td><input name={`exercises[${index}].weight`} defaultValue={exercises[index].weight}/></td>
              </tr>
              <tr>
                <th>Progress</th>
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
              </tr>
              <tr>
                <th hidden={props.isSimpleForm}>Options</th>
                <td>
                  <button>Add</button>
                  <button>Remove</button>
                </td>
              </tr>
            </table>
          )) : null}
          
        </form>
        <button onClick={() => props.submitFunction(exercises)}>Submit</button>
      </div>
    )
}