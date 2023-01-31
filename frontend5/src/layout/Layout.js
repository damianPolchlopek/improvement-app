import * as React from 'react';

import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Navigator from './Navigator.js';
import Header from './Header.js';

import {BrowserRouter, Route} from "react-router-dom";

import HomeView from '../home/HomeView';
import AddTraining from "../training/trainingForm/AddTraining";
import TrainingsView from "../training/trainingView/TrainingsView";
import TrainingStatistic from '../training/trainingStatistic/TrainingStatistics';
import ShoppingListView from "../shopping/ShoppingListView";
import AddShopping from '../shopping/AddShopping';
import FoodView from "../food/FoodView";


const drawerWidth = 200;

export default function Layout(props) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const isSmUp = useMediaQuery(props.theme.breakpoints.up('sm'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        {isSmUp ? null : (
          <Navigator
            PaperProps={{ style: { width: drawerWidth } }}
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
          />
        )}

        <Navigator
          PaperProps={{ style: { width: drawerWidth } }}
          sx={{ display: { sm: 'block', xs: 'none' } }}
        />
      </Box>
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Header onDrawerToggle={handleDrawerToggle} />
        <Box component="main" sx={{ flex: 1, py: 6, px: 4}}>
          <BrowserRouter>
            {/* <Content /> */}
            <Route path="/" exact component={HomeView} />
            <Route path="/add-training" exact component={AddTraining} />
            <Route path="/view-training" exact component={TrainingsView} />
            <Route path="/statistic-training" exact component={TrainingStatistic} />

            <Route path="/shopping-list" exact component={ShoppingListView} />
            <Route path="/add-shopping" exact component={AddShopping} />
            <Route path="/food-view" exact component={FoodView} />
          </BrowserRouter>
        </Box>
      </Box>
    </Box>
  );
}