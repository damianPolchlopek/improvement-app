import React, { Component } from 'react';
import { Formik, Form, Field, FieldArray } from 'formik';
import axios from 'axios';

class AddTrainingSchema extends Component {

  constructor(props) {
    super(props);

    this.state = {
      
    };
  }

  initialValuesExercisesType = {
    type: "A"
  }

  onSubmitExercisesType = values => {
    console.log(values.type)
    const getLastExercisesWithType = 'http://localhost:8080/getLastTypeTraining/' + values.type;
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
    const addExercisesUrl = 'http://localhost:8080/addTraining';
    axios.post(addExercisesUrl, values.exercises)
    .then(res => {
        console.log('Result POST: ');
        console.log(res);
    })
    
  };


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
                            <th scope="col">#</th>
                            <th scope="col">Type</th>
                            <th scope="col">Place</th>
                            <th scope="col">Name</th>
                            <th scope="col">Reps</th>
                            <th scope="col">Weight</th>
                            <th scope="col">Progress</th>
                            <th scope="col">Options</th>
                          </tr>
                        </thead>

                        <tbody>


                          {exercises.map((singleExercise, index) => (
                          <tr>
                            <th scope="row">{index}</th>
                            <td><Field className="form-control" name={`exercises[${index}].exerciseType`} /></td>
                            <td><Field className="form-control" name={`exercises[${index}].exercisePlace`} /></td>
                            <td><Field className="form-control" name={`exercises[${index}].name`} /></td>
                            <td><Field className="form-control" name={`exercises[${index}].reps`} /></td>
                            <td><Field className="form-control" name={`exercises[${index}].weight`} /></td>
                            <td><Field className="form-control" name={`exercises[${index}].progress`} /></td>
                            <td>
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
