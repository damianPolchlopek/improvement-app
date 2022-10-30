import React from 'react';
import {BrowserRouter, Route} from "react-router-dom";
import './App.css';

import HomeView from './home/HomeView';
import Layout from './navigation/Layout';
import AddTrainingView from "./training/AddTraining/AddTrainingView";
import TrainingsView from "./training/ViewTrainings/TrainingsView";
import LoginView from "./login/LoginView";
import ShoppingListView from "./shopping/ShoppingListView";
import ProductView from "./food/ProductView";
import Test from './test/NestedList';

function App() {
  return (
    <div className="App">

      <Layout>
        <BrowserRouter>
            <Route path="/" exact component={HomeView} />
            <Route path="/add-training" exact component={AddTrainingView} />
            <Route path="/view-training" exact component={TrainingsView} />
            <Route path="/shopping-list" exact component={ShoppingListView} />
            <Route path="/product-list" exact component={ProductView} />
            <Route path="/login-panel" exact component={LoginView} />
            <Route path="/test" exact component={Test} />
        </BrowserRouter>
      </Layout>

    </div>
  );
}

export default App;
