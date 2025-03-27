import './App.css';

import Layout from './layout/Layout.jsx';
import LoginView from './login/LoginView';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import Cookies from 'universal-cookie';
import jwt_decode from 'jwt-decode';
import './language/i18n.js';

import HomeView from './home/HomeView';
import AddTrainingView from "./training/trainingForm/AddTrainingView";
import TrainingsView from "./training/trainingView/TrainingsView";
import ExerciseView from './training/exerciseView/ExerciseView';
import MaximumExerciseView from './training/maximumTrainingView/MaximumExerciseView.js';
import TrainingStatistic from './training/trainingStatistic/TrainingStatistics';
import ShoppingListView from "./shopping/ShoppingListView";
import MealView from './food/foodView/MealView.js';
import AddDietDayView from "./food/addDietDay/AddDietDayView";
import DietStatisticView from "./food/statistic/DietStatisticView";
import ProductView from './food/ProductView/ProductView.js';
import WeeklyListView from './other/weekly/WeeklyListView.js';
import DailyView from './other/daily/DailyView.js';
import FinanceView from './finance/view/FinanceView.js';
import FinanceConfig from './finance/FinanceConfig.js';
import SignUpView from './login/SignUpView.jsx';
import TimerChallengeMain from './projects/timerChallenge/TimerChallengeMain.jsx';
import HolidayPickerMain from './projects/holidayPicker/HolidayPickerMain.jsx';

import ErrorPage from './layout/ErrorPage.jsx';

import {
  HomeViewUrl, 
  TrainingViewUrl, 
  ExerciseViewUrl,
  MaximumExerciseViewUrl,
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
  FinanceViewUrl,
  SignUpUrl,
  TimerChallengeUrl,
  HolidayPickerUrl,
} from "./utils/URLHelper";

import { 
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";

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
    children: [
      { path: HomeViewUrl, element: <HomeView /> },
      { path: TrainingViewUrl, element: <TrainingsView /> },
      { path: ExerciseViewUrl, element: <ExerciseView /> },
      { path: MaximumExerciseViewUrl, element: <MaximumExerciseView /> },
      { path: TrainingAddUrl, element: <AddTrainingView /> },
      { path: TrainingStatisticUrl, element: <TrainingStatistic /> },
      { path: FoodViewUrl, element: <MealView /> },
      { path: FoodAddUrl, element: <AddDietDayView /> },
      { path: CalculateIngredientsUrl, element: <DietStatisticView /> },
      { path: FoodProductUrl, element: <ProductView /> },
      { path: ShoppingViewUrl, element: <ShoppingListView /> },
      { path: WeeklyViewUrl, element: <WeeklyListView /> },
      { path: DailyViewUrl, element: <DailyView /> },
      { path: FinanceViewUrl, element: <FinanceView /> },
      { path: FinanceConfigUrl, element: <FinanceConfig /> },
      { path: SignUpUrl, element: <SignUpView /> },
      { path: TimerChallengeUrl, element: <TimerChallengeMain /> },
      { path: HolidayPickerUrl, element: <HolidayPickerMain /> },

      // {
      //   path: 'auth',
      //   element: <AuthenticationPage />,
      //   action: authAction
      // },
    ]
  }
]);


const checkTokenExpirationMiddleware = () => {
  const cookies = new Cookies();
  const token = cookies.get('authorization');

  if (token === undefined) {
    return false;
  }

  if (jwt_decode(token).exp < Date.now() / 1000) {
    cookies.remove('authorization');
    return false;
  }

  return true;
};


function App() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline/>
        <Box className="App">
          {checkTokenExpirationMiddleware() ? <RouterProvider router={router} /> : <LoginView/>}
        </Box>
      </ThemeProvider>
    </>
  );
}

export default App;
