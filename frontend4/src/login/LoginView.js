import React, {useState} from "react";
import Cookies from 'universal-cookie';
import REST from '../utils/REST';

function LoginView(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  function submitForm(){
    var user = {
        username: username,
        password: password
    }

    REST.loginUser(user).then(res => {
        console.log(res);
        const accessToken = res.accessToken;
        const tokenType = res.tokenType;
        var authorization = tokenType + ' ' + accessToken
        const cookies = new Cookies();
        cookies.set('authorization', authorization);
        cookies.set('role', res.roles[0]);

        props.history.push('/')
        window.location.reload(false)
    });
  }

  return (
    <div>
      <form>
        <div>
          <label>Login:</label>
          <input 
            type='text'
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}/>
        </div>
        
        <div>
          <label>Password:</label>
          <input
            type='password' 
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}/>
        </div>
      </form>
        <button onClick={() => submitForm()}>Submit</button>
    </div>
  );
}

export default LoginView;
