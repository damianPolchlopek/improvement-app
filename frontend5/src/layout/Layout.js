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
import MealView from '../food/foodView/MealView.js';
import FoodStatisticView from "../food/FoodStatisticView";
import FoodAddView from "../food/FoodAddView";
import ProductView from '../food/ProductView.js';
import WeeklyAdd from '../weekly/WeeklyAdd';
import WeeklyListView from '../weekly/WeeklyListView.js';

import {
  HomeViewUrl, 
  TrainingViewUrl, 
  TrainingAddUrl, 
  TrainingStatisticUrl,
  FoodViewUrl,
  FoodAddUrl,
  FoodStatisticUrl,
  ShoppingViewUrl,
  ShoppingAddUrl,
  FoodProductUrl,
  WeeklyAddUrl,
  WeeklyViewUrl
} from "../utils/URLHelper";


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
            <Route path={HomeViewUrl} exact component={HomeView} />
            
            <Route path={TrainingViewUrl} exact component={TrainingsView} />
            <Route path={TrainingAddUrl} exact component={AddTraining} />
            <Route path={TrainingStatisticUrl} exact component={TrainingStatistic} />

            <Route path={FoodViewUrl} exact component={MealView} />
            <Route path={FoodAddUrl} exact component={FoodAddView} />
            <Route path={FoodStatisticUrl} exact component={FoodStatisticView} />
            <Route path={FoodProductUrl} exact component={ProductView} />

            <Route path={ShoppingViewUrl} exact component={ShoppingListView} />
            <Route path={ShoppingAddUrl} exact component={AddShopping} />

            <Route path={WeeklyViewUrl} exact component={WeeklyListView} />
            <Route path={WeeklyAddUrl} exact component={WeeklyAdd} />
          </BrowserRouter>
        </Box>
      </Box>
    </Box>
  );
}