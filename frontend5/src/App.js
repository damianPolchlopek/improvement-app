import React, { Suspense, lazy } from 'react';
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { QueryClientProvider } from '@tanstack/react-query';
import './App.css';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';

import './language/i18n.js';
import { tokenLoader } from './login/Authentication.js';
import {action as logoutAction} from './login/Logout.js';
import {action as loginAction} from './login/LoginView.jsx';
import { queryClient } from './utils/REST.js';

import SnackbarProvider from './component/SnackbarProvider.jsx';
import { MealSelectionProvider } from './context/MealSelectionContext.js';

import {
  TRAINING, 
  EXERCISES,
  MAXIMUM, 
  FOOD,
  ADD,
  STATISTICS,
  SHOPPING,
  PRODUCTS,
  WEEKLY,
  DAILY,
  OTHER,
  SignUpUrl,
  TimerChallenge,
  HolidayPicker,
  LoginUrl,
  LogoutUrl,
  FINANCE,
  VIEW,
  INFORMATION,
  PROJECTS,
  VerifyEmailUrl
} from "./utils/URLHelper";

// Lazy-loaded components
const PublicLayout = lazy(() => import('./layout/PublicLayout.jsx'));
const Layout = lazy(() => import('./layout/Layout'));
const LoginView = lazy(() => import('./login/LoginView'));
const HomeView = lazy(() => import('./home/HomeView.jsx'));
const AddTrainingView = lazy(() => import("./training/trainingForm/AddTrainingView.jsx"));
const TrainingsView = lazy(() => import("./training/trainingView/TrainingsView.jsx"));
const ExerciseView = lazy(() => import('./training/exerciseView/ExerciseView.jsx'));
const MaximumExerciseView = lazy(() => import('./training/maximumTrainingView/MaximumExerciseView.jsx'));
const TrainingStatistic = lazy(() => import('./training/trainingStatistic/TrainingStatistics.jsx'));
const ShoppingListView = lazy(() => import("./shopping/ShoppingListView.jsx"));
const MealView = lazy(() => import('./food/foodView/MealView.jsx'));
const AddDietDayView = lazy(() => import("./food/addDietDay/AddDietDayView.jsx"));
const EditDietDayView = lazy(() => import("./food/editDietSummaryView/EditDietDayView.jsx"));
const DietStatisticView = lazy(() => import("./food/statistic/DietStatisticView.jsx"));
const ProductView = lazy(() => import('./food/ProductView/ProductView.jsx'));
const WeeklyListView = lazy(() => import('./other/weekly/WeeklyListView'));
const DailyView = lazy(() => import('./other/daily/DailyView'));
const FinanceView = lazy(() => import('./finance/view/FinanceView.jsx'));
const FinanceInformation = lazy(() => import('./finance/FinanceInformation.jsx'));
const SignUpView = lazy(() => import('./login/SignUpView'));
const TimerChallengeMain = lazy(() => import('./projects/timerChallenge/TimerChallengeMain'));
const HolidayPickerMain = lazy(() => import('./projects/holidayPicker/HolidayPickerMain'));
const ErrorPage = lazy(() => import('./layout/ErrorPage'));
const EmailVerification = lazy(() => import('./login/EmailVerification.jsx'));

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

const suspenseFallback = <p></p>;

const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      {
        path: LoginUrl,
        element: <LoginView />,
        action: loginAction,
      },
      {
        path: SignUpUrl,
        element: <Suspense fallback={suspenseFallback}><SignUpView /></Suspense>,
      },
      { 
        path: LogoutUrl, 
        action: logoutAction
      },
      {
        path: VerifyEmailUrl,
        element: <Suspense fallback={suspenseFallback}><EmailVerification /></Suspense>,
      }
    ]
  },
  {
    path: '/app',
    element: <Suspense fallback={suspenseFallback}><Layout theme={theme} /></Suspense>,
    errorElement: <ErrorPage />,
    loader: tokenLoader,
    children: [
      { index: true, element: <HomeView /> },
      { 
        path: TRAINING, 
        children: 
        [
          { 
            path: VIEW, 
            element: <Suspense fallback={suspenseFallback}><TrainingsView /></Suspense> 
          },
          { path: EXERCISES, element: <Suspense fallback={suspenseFallback}><ExerciseView /></Suspense> },
          { path: MAXIMUM, element: <Suspense fallback={suspenseFallback}><MaximumExerciseView /></Suspense> },
          { 
            path: ADD, 
            element: <Suspense fallback={suspenseFallback}><AddTrainingView /></Suspense>, 
            loader: () => import('./training/trainingForm/TrainingForm.jsx').then((module) => module.loader()),
          },
          { 
            path: STATISTICS, 
            element: <Suspense fallback={suspenseFallback}><TrainingStatistic /></Suspense>, 
            loader: () => import('./training/trainingStatistic/TrainingStatistics.jsx').then((module) => module.loader()), 
          },    
        ]
      },
      { 
        path: FOOD, 
        children: [
          { 
            path: VIEW, 
            element: <Suspense fallback={suspenseFallback}><MealView /></Suspense> 
          },
          { 
            path: ADD, 
            element: <Suspense fallback={suspenseFallback}><AddDietDayView /></Suspense> 
          },
          { 
            path: ':id/edit', 
            element: <Suspense fallback={suspenseFallback}><EditDietDayView /></Suspense>,
            loader: ({ params }) => import('./food/editDietSummaryView/EditDietDayView.jsx').then((module) => module.loader({ params })),
          },
          { 
            path: STATISTICS, 
            element: <Suspense fallback={suspenseFallback}><DietStatisticView /></Suspense> 
          },
          { 
            path: PRODUCTS, 
            element: <Suspense fallback={suspenseFallback}><ProductView /></Suspense> 
          },
        ]
      },
      { 
        path: OTHER, 
        children: [
          { path: SHOPPING, element: <Suspense fallback={suspenseFallback}><ShoppingListView /></Suspense> },
          { path: WEEKLY, element: <Suspense fallback={suspenseFallback}><WeeklyListView /></Suspense> },
          { path: DAILY, element: <Suspense fallback={suspenseFallback}><DailyView /></Suspense> },
        ]
      },
      {
        path: FINANCE, 
        children: [
          { path: VIEW, element: <Suspense fallback={suspenseFallback}><FinanceView /></Suspense> },
          { path: INFORMATION, element: <Suspense fallback={suspenseFallback}><FinanceInformation /></Suspense> }
        ]
      },
      {
        path: PROJECTS,
        children: [
          { path: TimerChallenge, element: <Suspense fallback={suspenseFallback}><TimerChallengeMain /></Suspense> },
          { path: HolidayPicker, element: <Suspense fallback={suspenseFallback}><HolidayPickerMain /></Suspense> },
        ]
      }
    ]
  }
]);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      
      <QueryClientProvider client={queryClient}>
      <SnackbarProvider>
      <MealSelectionProvider>
      
        <Box className="App">
          <RouterProvider router={router} />
        </Box>

      </MealSelectionProvider>
      </SnackbarProvider>
      </QueryClientProvider>

    </ThemeProvider>
  );
}


export default App;
