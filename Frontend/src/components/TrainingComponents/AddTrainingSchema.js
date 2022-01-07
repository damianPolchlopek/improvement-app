import React, { Component } from 'react';
import { Formik, Form, Field, FieldArray } from 'formik';
import axios from 'axios';

const originName = 'http://localhost:8080/exercise/';

class AddTrainingSchema extends Component {

  constructor(props) {
    super(props);

    this.state = {
      exerciseNames: [],
      exerciseProgresses: [],
      exercisePlaces: [],
      exerciseTypes: [],
      isSimpleForm: true
    };
  }

  componentDidMount(){
    this.getExerciseNames();
    this.getExercisePlaces();
    this.getExerciseProgresses();
    this.getExerciseTypes();
  }

  getExerciseNames = () => {
    const getExerciseName = originName + 'getExerciseNames';
    axios.get(getExerciseName)
    .then(response => {
        this.setState({exerciseNames: response.data.entity});
    })
  }

  getExerciseProgresses = () => {
    const getExerciseProgresses = originName + 'getExerciseProgresses';
    axios.get(getExerciseProgresses)
    .then(response => {
        this.setState({exerciseProgresses: response.data.entity});
    })
  }

  getExercisePlaces = () => {
    const getExercisePlaces = originName + 'getExercisePlaces';
    axios.get(getExercisePlaces)
    .then(response => {
        this.setState({exercisePlaces: response.data.entity});
    })
  }

  getExerciseTypes = () => {
    const getExerciseTypes = originName + 'getExerciseTypes';
    axios.get(getExerciseTypes)
    .then(response => {
        this.setState({exerciseTypes: response.data.entity});
    })
  }

  initialValuesExercisesType = {
    type: "A"
  }

  onSubmitExercisesType = values => {
    const getLastExercisesWithType = originName + 'getLastTypeTraining/' + values.type;
    axios.get(getLastExercisesWithType)
    .then(response => {
        this.initialValues.exercises = response.data.entity;
        this.setState({isUpdated: true});
    })

  }

  initialValues = {
    exercises: [
      {
        exerciseType: "",
        exercisePlace: "",
        name: "Test",
        reps: "1/1/1/1",
        weight: "1/1/1/1",
        progress: ""
      }
    ]
  };

  onSubmit = values => {
    const addExercisesUrl = originName + 'addTraining';
    axios.post(addExercisesUrl, values.exercises)
    .then(res => {
        console.log('Result POST: ');
        console.log(res);
    })
  };

  changeFormViewFunction = () => {
    var oppositeValue = !this.state.isSimpleForm;
    this.setState({isSimpleForm: oppositeValue})
  }

  render () {
    return (

        <div>
          <br/>
          <h2>Choose training type to add </h2>

          <Formik
            initialValues={this.initialValuesExercisesType}
            onSubmit={this.onSubmitExercisesType}
          >
            <Form>
              <div className="form-group">
                <Field as="select" className="form-control form-control-lg" name="type">
                  <option value="A">Siłowy A</option>
                  <option value="B">Siłowy B</option>
                  <option value="C">Hipertroficzny C</option>
                  <option value="D">Hipertroficzny D</option>
                </Field>
              </div>
            
            <button className="form-control form-control-lg" type='submit'>Load last Training</button>

            </Form>

          </Formik>

      
          <br/>     
          <div className="form-check form-switch">
            <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" 
                    onClick={() => this.changeFormViewFunction()}/>
            <label className="form-check-label" htmlFor="flexSwitchCheckDefault">
              <h4>Enable a more accurate form</h4>
            </label>
          </div>

          <h3 className="text-center">Training Schema</h3>
      
          <Formik
              enableReinitialize={true}
              initialValues={this.initialValues}
              onSubmit={this.onSubmit}
            >
              <Form>
                <div>
                  <br/>
  
                  <FieldArray name='exercises'>
                    {(fieldArrayProps) => {
                      const { push, remove, form } = fieldArrayProps;
                      const { values } = form
                      const { exercises } = values
                      return <div>

                      <table className="table">
                        <thead className="thead-light">
                          <tr>
                            <th scope="col" hidden={this.state.isSimpleForm}>#</th>
                            <th scope="col" hidden={this.state.isSimpleForm}>Type</th>
                            <th scope="col" hidden={this.state.isSimpleForm}>Place</th>
                            <th scope="col">Name</th>
                            <th scope="col">Reps</th>
                            <th scope="col">Weight</th>
                            <th scope="col">Progress</th>
                            <th scope="col" hidden={this.state.isSimpleForm}>Options</th>
                          </tr>
                        </thead>

                        <tbody>

                          {exercises.map((singleExercise, index) => (
                          <tr>
                            <th scope="row" hidden={this.state.isSimpleForm}>{index}</th>

                            <td hidden={this.state.isSimpleForm}>
                              <Field className="form-control" 
                                name={`exercises[${index}].exerciseType`} 
                                as="select"
                                value={exercises[index].exerciseType}
                              >
                                {this.state.exerciseTypes.map(exerciseType => {
                                  return(
                                  <option key={exerciseType.type} value={exerciseType.type}>
                                    {exerciseType.type}
                                  </option>
                                  );
                                })}
                              </Field>
                            </td>

                            <td hidden={this.state.isSimpleForm}>
                              <Field className="form-control" 
                                name={`exercises[${index}].exercisePlace`}
                                as="select"
                                value={exercises[index].exercisePlace}
                              >
                                {this.state.exercisePlaces.map(exercisePlace => {
                                  return(
                                  <option key={exercisePlace.place} value={exercisePlace.place}>
                                    {exercisePlace.place}
                                  </option>
                                  );
                                })}
                              </Field>
                            
                            </td>
                            <td>
                              <Field className="form-control" 
                                name={`exercises[${index}].name`} 
                                as="select"
                                value={exercises[index].name}
                              >
                                {this.state.exerciseNames.map(exerciseName => {
                                  return(
                                  <option key={exerciseName.name} value={exerciseName.name}>
                                    {exerciseName.name}
                                  </option>
                                  );
                                })}
                              </Field>
                            
                            </td>

                            <td><Field className="form-control" name={`exercises[${index}].reps`} /></td>
                            <td><Field className="form-control" name={`exercises[${index}].weight`} /></td>

                            <td>
                              <Field className="form-control" 
                                name={`exercises[${index}].progress`} 
                                as="select"
                                value={exercises[index].progress}
                              >
                                {this.state.exerciseProgresses.map(progress => {
                                  return(
                                  <option key={progress.progress} value={progress.progress}>
                                    {progress.progress}
                                  </option>
                                  );
                                  
                                })}

                              </Field>
                            </td>

                            <td hidden={this.state.isSimpleForm}>
                              <button className="btn btn-success" type='button' onClick={() => push('')}>
                                Add
                              </button>
                              {index > 0 && (
                                <button className="btn btn-danger" type='button' onClick={() => remove(index)}> 
                                Delete
                                </button>
                              )}  
                            </td>
                          </tr>
                          ))}

                        </tbody>
                      </table>  

                      </div>
                    }}
                    </FieldArray>
                </div>

                <button className="col-sm-6 form-control btn btn-success " 
                        type='submit'>Submit</button>
              </Form>
            </Formik>

        
      </div>
    );
  }
}

export default AddTrainingSchema;
