import {BrowserRouter, Route} from "react-router-dom";
import './App.css';

import HomeView from './home/HomeView';
import Layout from './navigation/Layout';
import AddTraining from "./training/AddTraining";
import TrainingsView from "./training/TrainingsView";

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
