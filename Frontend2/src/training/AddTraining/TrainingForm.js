import React, { useEffect, useState } from "react";
import REST from '../../utils/REST';

export default function TrainingForm(props) {
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
          <table>
            <thead>
              <tr>
                <th hidden={props.isSimpleForm}>#</th>
                <th hidden={props.isSimpleForm}>Type</th>
                <th hidden={props.isSimpleForm}>Place</th>
                <th>Name</th>
                <th>Reps</th>
                <th>Weight</th>
                <th>Progress</th>
                <th hidden={props.isSimpleForm}>Options</th>
              </tr>
            </thead>
            <tbody>
              {exercises ? exercises.map((exercise, index) => (
                <tr key={index}>
                  <td hidden={props.isSimpleForm}>{index}</td>
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
                    <button>Add</button>
                    <button>Remove</button>
                  </td>

                </tr>
              )) : null}
            </tbody>
          </table>

        </form>
        <button onClick={() => props.submitFunction(exercises)}>Submit</button>
      </div>
    )
}