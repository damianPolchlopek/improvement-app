import React, { Component } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
// import axios from 'axios';

const initialValues = {
  meal: ''
};

const onSubmit = values => {
  console.log('[AddMeal] submit: ' + values.meal.name);
  // axios.post('qqq', values)
  // .then(res => {
  //     console.log('Result POST: ' + res);
  // })
};

const validationSchema = Yup.object({
  meal: Yup.string().required('Required')
});

class AddMealSchema extends Component {
  render () {
    return (

        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
        >
            <Form>
                <div>
                    <h3 className="text-center">Meal Schema</h3>
                    <br/>
                    <table className="table">
                        <thead className="thead-light">
                            <tr>
                            <th scope="col">Name</th>
                            <th scope="col">kcal</th>
                            <th scope="col">Protein</th>
                            <th scope="col">Carbohydrates</th>
                            <th scope="col">Fat</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                            <td><Field className="form-control" name={`meal.name`} /></td>
                            <td><Field className="form-control" name={`meal.kcal`} /></td>
                            <td><Field className="form-control" name={`meal.protein`} /></td>
                            <td><Field className="form-control" name={`meal.carbohydrates`} /></td>
                            <td><Field className="form-control" name={`meal.fat`} /></td>
                            </tr>
                        </tbody>
                    </table>  
                </div>

                <button className="col-sm-6 form-control btn btn-success " type='submit'>Submit</button>
            </Form>
        </Formik>
        
    );
  }
}

export default AddMealSchema;
