import React, {Component} from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Cookies from 'universal-cookie';

import axios from 'axios';
import TextError from './TextError';
// import 'font-awesome/css/font-awesome.min.css';
import Constants from '../Constants';

const originName = Constants.BASE_URL;

const initialValues = {
  username: '',
  password: '',
};

const validationSchema = Yup.object({
  username: Yup.string().required('Username Required'),
  password: Yup.string().required('Password Required')
});

class LoginPanel extends Component {


    render(){
    
        return(
            <div className="container text-center">
                <h1>Sign In</h1>
    
                <Formik 
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={values => {
                        console.log('Submit: ', values)
                    
                        const loginUrl = originName + 'api/auth/signin';
                        axios.post(loginUrl, values)
                        .then(res => {
                    
                        console.log(res.data);
                            const accessToken = res.data.accessToken;
                            const tokenType = res.data.tokenType;
                            var authorization = tokenType + ' ' + accessToken
                            const cookies = new Cookies();
                            cookies.set('authorization', authorization);
                            cookies.set('role', res.data.roles[0]);
                            this.props.history.push('/')
                            window.location.reload(false)
                        })
                    
                    }}
                >
    
                    <Form className="w-50 mx-auto">
                        <div className="form-group input-group">
                                <div class="input-group-prepend">
                                    <span className="input-group-text"> <i className="fa fa-user"></i> </span>
                                </div>
                                <Field 
                                className="form-control"
                                type='text' 
                                id='username' 
                                name='username' 
                                placeholder="Username"
                                />
                            <ErrorMessage name='name' component={TextError}/>
                        </div>
    
                        <div className="form-group input-group">
                            <div class="input-group-prepend">
                                <span class="input-group-text"> <i class="fa fa-lock"></i> </span>
                            </div>
                            <Field 
                                className="form-control"
                                type='password' 
                                id='password' 
                                name='password' 
                                placeholder="Password"
                            />
                            <ErrorMessage name='name' component={TextError}/>
                        </div>
    
                        <button className="btn btn-primary btn-block" type='submit'>Submit</button>
                    </Form>
    
                </Formik>
            </div>
            
        );
    }
    
    };
    
    export default LoginPanel;