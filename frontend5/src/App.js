import './App.css';

import Layout from './layout/Layout';
import LoginView from './login/LoginView';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import './language/i18n.js';

import HomeView from './home/HomeView';
import AddTrainingView from "./training/trainingForm/AddTrainingView";
import TrainingsView from "./training/trainingView/TrainingsView";
import ExerciseView from './training/exerciseView/ExerciseView';
import MaximumExerciseView from './training/maximumTrainingView/MaximumExerciseView';
import TrainingStatistic from './training/trainingStatistic/TrainingStatistics';
import ShoppingListView from "./shopping/ShoppingListView";
import MealView from './food/foodView/MealView';
import AddDietDayView from "./food/addDietDay/AddDietDayView";
import DietStatisticView from "./food/statistic/DietStatisticView";
import ProductView from './food/ProductView/ProductView.jsx';
import WeeklyListView from './other/weekly/WeeklyListView';
import DailyView from './other/daily/DailyView';
import FinanceView from './finance/view/FinanceView';
import FinanceInformation from './finance/FinanceInformation';
import SignUpView from './login/SignUpView';
import TimerChallengeMain from './projects/timerChallenge/TimerChallengeMain';
import HolidayPickerMain from './projects/holidayPicker/HolidayPickerMain';

import ErrorPage from './layout/ErrorPage';
import {action as logoutAction} from './login/Logout.js';
import {action as loginAction} from './login/LoginView.jsx';

import {
  Training, 
  Exercises,
  Maximum, 
  Food,
  Add,
  Statistics,
  Shopping,
  Products,
  Weekly,
  Daily,
  Other,
  SignUpUrl,
  TimerChallenge,
  HolidayPicker,
  LoginUrl,
  LogoutUrl,
  Finance,
  View,
  Information,
  Projects,
} from "./utils/URLHelper";

import { 
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";

import { tokenLoader } from './login/Authentication.js';
import { loader as trainingAddLoader } from './training/trainingForm/TrainingForm.jsx';
import { action as addTarainingAction } from './training/trainingForm/TrainingForm.jsx';
import { loader as statisticLoader } from './training/trainingStatistic/TrainingStatistics.jsx';
import { Box } from '@mui/material';

let theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
    background: {
      default: '#121212',
      paper: '#1d1d1d',
    },
  },
  typography: {
    h5: {
      fontWeight: 500,
      fontSize: 26,
      letterSpacing: 0.5,
    },
    fontFamily: 'Roboto, sans-serif',
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiTab: {
      defaultProps: {
        disableRipple: true,
      },
    },
  },
  mixins: {
    toolbar: {
      minHeight: 48,
    },
  },
});

theme = {
  ...theme,
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1d1d1d',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
        contained: {
          boxShadow: 'none',
          '&:active': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          marginLeft: theme.spacing(1),
        },
        indicator: {
          height: 3,
          borderTopLeftRadius: 3,
          borderTopRightRadius: 3,
          backgroundColor: theme.palette.primary.main,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          margin: '0 16px',
          minWidth: 0,
          padding: 0,
          [theme.breakpoints.up('md')]: {
            padding: 0,
            minWidth: 0,
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          padding: theme.spacing(1),
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: 4,
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255,255,255,0.15)',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            color: theme.palette.primary.main,
          },
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          fontSize: 14,
          fontWeight: theme.typography.fontWeightMedium,
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: 'inherit',
          minWidth: 'auto',
          marginRight: theme.spacing(2),
          '& svg': {
            fontSize: 20,
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          width: 32,
          height: 32,
        },
      },
    },
  },
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout theme={theme} />,
    errorElement: <ErrorPage />,
    loader: tokenLoader,
    children: [
      { index: true, element: <HomeView /> },
      { 
        path: Training, 
        children: 
        [
          { path: View, element: <TrainingsView /> },
          { path: Exercises, element: <ExerciseView /> },
          { path: Maximum, element: <MaximumExerciseView /> },
          { path: Add, element: <AddTrainingView />, loader: trainingAddLoader, action: addTarainingAction },
          { path: Statistics, element: <TrainingStatistic />, loader: statisticLoader },    
        ]
      },
      { 
        path: Food, children: 
        [
          { path: View, element: <MealView /> },
          { path: Add, element: <AddDietDayView /> },
          { path: Statistics, element: <DietStatisticView /> },
          { path: Products, element: <ProductView /> },
        ]
      },
      { 
        path: Other, 
        children: [
          { path: Shopping, element: <ShoppingListView /> },
          { path: Weekly, element: <WeeklyListView /> },
          { path: Daily, element: <DailyView /> },
        ]
      },
      {
        path: Finance, 
        children: [
          { path: View, element: <FinanceView /> },
          { path: Information, element: <FinanceInformation /> }
        ]
      },
      {
        path: Projects,
        children: [
          { path: TimerChallenge, element: <TimerChallengeMain /> },
          { path: HolidayPicker, element: <HolidayPickerMain /> },
        ]
      },
      { path: SignUpUrl, element: <SignUpView /> },
      { path: LoginUrl, element: <LoginView />, action: loginAction},
      { path: LogoutUrl, action: logoutAction},
    ]
  }
]);

function App() {

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline/>
        <Box className="App">
          <RouterProvider router={router} />
          {/* <RouterProvider router={router} /> */}
        </Box>
      </ThemeProvider>
    </>
  );
}

export default App;
