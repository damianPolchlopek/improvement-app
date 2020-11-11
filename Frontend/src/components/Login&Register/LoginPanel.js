import React from 'react';

import './LoginPanel.css';

const btnStyle = {
    width: '50%',
    borderRadius: 'rem',
    padding: '1.5%',
    border: 'none',
    cursor: 'pointer'
};

const LoginPanel = () => {
      return (
          <div className="container login-container">
            <div className="col-md-6 login-form-1">
                <h3>Login Form</h3>
                <form>
                    <div className="form-group">
                        <input type="text" className="form-control" placeholder="Your Username *" value="" />
                    </div>
                    <div className="form-group">
                        <input type="password" className="form-control" placeholder="Your Password *" value="" />
                    </div>
                    <div className="form-group">
                        <input type="submit" className="btnSubmit" value="Login" />
                    </div>
                    <div className="form-group text-center">
                        <a href="#" className="ForgetPwd" value="Login">Forget Password?</a>
                    </div>
                </form>
            </div>
          </div>
      );
  }
  
export default LoginPanel;