import React, { Component } from 'react';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const initialValues = {
  exercises: ['']
};

const onSubmit = values => {
  console.log('[AddTraining] submit: ' + values.exercises[0].name);
  // axios.post('qqq', values)
  // .then(res => {
  //     console.log('Result POST: ' + res);
  // })
};

const validationSchema = Yup.object({
  exercises: Yup.string().required('Required')
});

class AddTrainingSchema extends Component {

  constructor(props) {
    super(props);

    this.state = {
      exercises: []
    };
}

  render () {
    return (

      <div>
        {( this.state.exercises != null ) && 
        <div>

          <br/>

            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={onSubmit}
            >
              <Form>
                <div>
                  <h3 className="text-center">Training Schema</h3>
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
                              <th scope="col">Name</th>
                              <th scope="col">Series</th>
                              <th scope="col">Repeat</th>
                              <th scope="col">Options</th>
                            </tr>
                          </thead>
                          <tbody>
                            
                          {exercises.map((singleExercise, index) => (
                            <tr>
                              <th scope="row">{index}</th>
                              <td><Field className="form-control" name={`exercises[${index}].name`} /></td>
                              <td><Field className="form-control" name={`exercises[${index}].series`} /></td>
                              <td><Field className="form-control" name={`exercises[${index}].repeat`} /></td>
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

                <button className="col-sm-6 form-control btn btn-success " type='submit'>Submit</button>
              </Form>
            </Formik>
        </div>}
      </div>
    );
  }
}

export default AddTrainingSchema;
