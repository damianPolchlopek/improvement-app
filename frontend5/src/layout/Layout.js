import * as React from 'react';

import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Navigator from './Navigator.js';
import Header from './Header.js';

import {BrowserRouter, Route} from "react-router-dom";

import HomeView from '../home/HomeView';
import AddTrainingView from "../training/trainingForm/AddTrainingView";
import TrainingsView from "../training/trainingView/TrainingsView";
import ExerciseView from '../training/trainingView/ExerciseView';
import TrainingStatistic from '../training/trainingStatistic/TrainingStatistics';
import ShoppingListView from "../shopping/ShoppingListView";
import MealView from '../food/foodView/MealView.js';
import AddDietDayView from "../food/addDietDay/AddDietDayView";
import DietStatisticView from "../food/statistic/DietStatisticView";
import ProductView from '../food/ProductView/ProductView.js';
import WeeklyListView from '../other/weekly/WeeklyListView.js';
import DailyView from '../other/daily/DailyView.js';
import FinanceView from '../finance/view/FinanceView.js';
import FinanceConfig from '../finance/FinanceConfig.js';

import {
  HomeViewUrl, 
  TrainingViewUrl, 
  ExerciseViewUrl,
  TrainingAddUrl, 
  TrainingStatisticUrl,
  FoodViewUrl,
  FoodAddUrl,
  CalculateIngredientsUrl,
  ShoppingViewUrl,
  FoodProductUrl,
  WeeklyViewUrl,
  DailyViewUrl,
  FinanceConfigUrl,
  FinanceViewUrl
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
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column'}}>
        <Header onDrawerToggle={handleDrawerToggle} />
        <Box component="main" sx={{ flex: 1, py: 6, px: 4}}>
       
          <BrowserRouter>
            <Route path={HomeViewUrl} exact component={HomeView} />
            
            <Route path={TrainingViewUrl} exact component={TrainingsView} />
            <Route path={ExerciseViewUrl} exact component={ExerciseView} />
            <Route path={TrainingAddUrl} exact component={AddTrainingView} />
            <Route path={TrainingStatisticUrl} exact component={TrainingStatistic} />

            <Route path={FoodViewUrl} exact component={MealView} />
            <Route path={FoodAddUrl} exact component={AddDietDayView} />
            <Route path={CalculateIngredientsUrl} exact component={DietStatisticView} />
            <Route path={FoodProductUrl} exact component={ProductView} />

            <Route path={ShoppingViewUrl} exact component={ShoppingListView} />

            <Route path={WeeklyViewUrl} exact component={WeeklyListView} />
            <Route path={DailyViewUrl} exact component={DailyView} />

            <Route path={FinanceViewUrl} exact component={FinanceView} />
            <Route path={FinanceConfigUrl} exact component={FinanceConfig} />
          </BrowserRouter>
        
        </Box>
      </Box>
    </Box>
  );
}