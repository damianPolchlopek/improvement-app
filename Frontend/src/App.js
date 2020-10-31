import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import Layout from './components/NavigationComponents/Layout';

import DietView from './components/DietComponents/DietView';
import HomeView from './components/HomeComponents/HomeView';
import AddTrainingSchema from './components/TrainingComponents/AddTrainingSchema';
import AddMealSchema from './components/DietComponents/AddMealSchema';

class App extends Component {
  render () {
    return (
      <div class="container">
          <Layout>
            <Switch>
              <Route path="/diet" component={AddMealSchema} />
              <Route path="/training" component={AddTrainingSchema} />
              {/* <Route path="/settings" component={Settings} /> */}
              <Route path="/" exact component={HomeView} />
            </Switch> 
          </Layout>
      </div>
    );
  }
}

export default App;
