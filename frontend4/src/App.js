import {BrowserRouter, Route} from "react-router-dom";
import './App.css';

import Layout from "./navigation/Layout";
import HomeView from "./home/HomeView";
import LoginView from "./login/LoginView";
import AddTraining from "./training/trainingForm/AddTraining";
import TrainingsView from "./training/trainingView/TrainingsView";
import ShoppingListView from "./shopping/ShoppingListView";
import FoodView from "./food/FoodView";

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
    <CssBaseline />
    <div className="App">
      <Layout>
        <BrowserRouter>
          <Route path="/" exact component={HomeView} />
          <Route path="/add-training" exact component={AddTraining} />
          <Route path="/view-training" exact component={TrainingsView} />
          <Route path="/shopping-list" exact component={ShoppingListView} />
          <Route path="/login-panel" exact component={LoginView} />
          <Route path="/food-view" exact component={FoodView} />
        </BrowserRouter>
      </Layout>
    </div>
    </ThemeProvider>
  );
}

export default App;
