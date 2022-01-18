import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import Layout from './components/NavigationComponents/Layout';

import LoginPanel from './components/Login&Register/LoginPanel';
import HomeView from './components/HomeComponents/HomeView';
import AddTrainingSchema from './components/TrainingComponents/AddTrainingSchema';
import PrintoutTraining from './components/TrainingComponents/PrintoutTraining';
import AddMealSchema from './components/DietComponents/AddMealSchema';

class App extends Component {

  render () {
    return (
      <div className="container">
          <Layout>
            <Switch>
              <Route path="/diet" component={AddMealSchema} />
              <Route path="/training" component={AddTrainingSchema} />
              <Route path="/printout-training" component={PrintoutTraining} />
              <Route path="/login-panel" component={LoginPanel} />
              <Route path="/" exact component={HomeView} />
            </Switch> 
          </Layout>
      </div>
    );
  }
}

export default App;
