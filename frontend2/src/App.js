import {BrowserRouter, Route} from "react-router-dom";
import './App.css';

import HomeView from './home/HomeView';
import Layout from './navigation/Layout';
import AddTraining from "./training/AddTraining/AddTraining";
import TrainingsView from "./training/ViewTrainings/TrainingsView";

function App() {
  return (
    <div className="App">

      <Layout>
        <BrowserRouter>
            <Route path="/" exact component={HomeView} />
            <Route path="/add-training" exact component={AddTraining} />
            <Route path="/view-training" exact component={TrainingsView} />
        </BrowserRouter>
      </Layout>

    </div>
  );
}

export default App;
