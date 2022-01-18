import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import App from './App';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import Cookies from 'universal-cookie';

const app = (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

axios.interceptors.request.use(
  (req) => {
    const cookies = new Cookies();
    req.headers.common.Authorization = cookies.get('authorization');
     return req;
  },
  (err) => {
     return Promise.reject(err);
  }
);

ReactDOM.render(app, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
