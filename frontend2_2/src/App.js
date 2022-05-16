import {BrowserRouter, Route} from "react-router-dom";
import './App.css';

import HomeView from './home/HomeView';
import Layout from './navigation/Layout';
import AddTrainingView from "./training/AddTraining/AddTrainingView";
import TrainingsView from "./training/ViewTrainings/TrainingsView";
import LoginView from "./login/LoginView";

function App() {
  return (
    <div className="App">

      <Layout>
        <BrowserRouter>
            <Route path="/" exact component={HomeView} />
            <Route path="/add-training" exact component={AddTrainingView} />
            <Route path="/view-training" exact component={TrainingsView} />
            <Route path="/login-panel" exact component={LoginView} />
        </BrowserRouter>
      </Layout>

    </div>
  );
}

export default App;
