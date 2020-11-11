import React from 'react';

import './RegisterPanel.css';

const RegisterPanel = () => {
      return (
        <div class="container login-container">
          <div class="col-md-6 login-form-1">
            <h3>Register Form</h3>
            <form>
                <div className="form-group row">
                    <label className="col-sm-3 col-form-label position-static" htmlFor='name'>Name: </label>
                    <input 
                        className="col-sm-9 form-control position-static" 
                        type="text" 
                        placeholder="Your Username" 
                    />
                </div>

                <div className="form-group row">
                    <label className="col-sm-3 col-form-label position-static" htmlFor='email'>Email: </label>
                    <input 
                        className="col-sm-9 form-control position-static" 
                        type="text" 
                        placeholder="Your Email" 
                     />
                </div>

                <div className="form-group row">
                    <label className="col-sm-3 col-form-label position-static" htmlFor='password'>Password: </label>
                    <input 
                        className="col-sm-9 form-control position-static" 
                        type="text" 
                        placeholder="Your Password" 
                    />
                </div>

                <div className="form-group row">
                    <label className="col-sm-3 col-form-label position-static" htmlFor='password2'>Password: </label>
                    <input 
                        className="col-sm-9 form-control position-static" 
                        type="text" 
                        placeholder="Repeat password" 
                    />
                </div>
                
                <div className="form-group text-center">
                    <input type="submit" className="btnSubmit" value="Register" />
                </div>
            </form>
          </div>
        </div>

      );
  }
  
export default RegisterPanel;