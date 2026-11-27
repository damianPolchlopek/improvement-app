import React, { Suspense, lazy } from 'react';
import { Navigate } from 'react-router-dom';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import './App.css';

import { ThemeProvider } from '@mui/material/styles';
import theme from './theme.js';
import { Box } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';

import './language/i18n.js';
import { tokenLoader } from './login/Authentication.js';
import { action as logoutAction } from './login/Logout.js';
import { action as loginAction } from './login/LoginView.jsx';
import { queryClient } from './utils/REST.js';

import SnackbarProvider from './component/snackbar/SnackbarProvider.jsx';
import PageLoader from './component/loader/PageLoader.jsx';

import {
  TRAINING,
  EXERCISES,
  MAXIMUM,
  FOOD,
  ADD,
  STATISTICS,
  TEMPLATES,
  SHOPPING,
  PRODUCTS,
  WEEKLY,
  DAILY,
  OTHER,
  AUDIT,
  SignUpUrl,
  LoginUrl,
  LogoutUrl,
  FINANCE,
  VIEW,
  INFORMATION,
  LIVE,
  VerifyEmailUrl,
  OAuth2CallbackUrl,
} from './utils/URLHelper';

// Lazy-loaded components
const PublicLayout = lazy(() => import('./layout/PublicLayout.jsx'));
const Layout = lazy(() => import('./layout/Layout'));
const LoginView = lazy(() => import('./login/LoginView'));
const HomeView = lazy(() => import('./home/HomeView.jsx'));
const AddTrainingView = lazy(() => import('./training/trainingForm/AddTrainingView.jsx'));
const TrainingsView = lazy(() => import('./training/trainingView/TrainingsView.jsx'));
const ExerciseView = lazy(() => import('./training/exerciseView/ExerciseView.jsx'));
const MaximumExerciseView = lazy(
  () => import('./training/maximumTrainingView/MaximumExerciseView.jsx')
);
const TrainingStatistic = lazy(() => import('./training/trainingStatistic/TrainingStatistics.jsx'));
const TrainingTemplatesView = lazy(
  () => import('./training/trainingTemplates/TrainingTemplatesView.jsx')
);
const ShoppingListView = lazy(() => import('./shopping/ShoppingListPage.jsx'));
const MealView = lazy(() => import('./food/foodView/MealView.jsx'));
const AddDietDayView = lazy(() => import('./food/addDietDay/AddDietDayView.jsx'));
const EditDietDayView = lazy(() => import('./food/editDietSummaryView/EditDietDayView.jsx'));
const DietStatisticView = lazy(() => import('./food/statistic/DietStatisticView.jsx'));
const ProductView = lazy(() => import('./food/ProductView/ProductView.jsx'));
const WeeklyRecordView = lazy(() => import('./other/weekly/WeeklyRecordsView.jsx'));
const DailyView = lazy(() => import('./other/daily/DailyView'));
const FinanceView = lazy(() => import('./finance/view/FinanceView.jsx'));
const FinanceInformation = lazy(() => import('./finance/FinanceInformation.jsx'));
const LiveMarketView = lazy(() => import('./finance/live/LiveMarketView.jsx'));
const SignUpView = lazy(() => import('./login/SignUpView'));
const ErrorPage = lazy(() => import('./layout/ErrorPage'));
const EmailVerification = lazy(() => import('./login/EmailVerification.jsx'));
const OAuth2CallbackPage = lazy(() => import('./login/OAuth2CallbackPage.jsx'));
const DietAuditSelectorPage = lazy(() => import('./audit/components/DietAuditSelectorPage.jsx'));
const DietAuditPage = lazy(() => import('./audit/components/DietAuditPage.jsx'));

// Granice Suspense dla stron są w Layout/PublicLayout (wokół <Outlet/>), więc trasy
// nie muszą się opakowywać same, a ładowanie strony nie ukrywa nagłówka ani menu.
// ErrorPage jest leniwy i renderuje się poza layoutem → potrzebuje własnej granicy.
const errorElement = (
  <Suspense fallback={<PageLoader />}>
    <ErrorPage />
  </Suspense>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    // Nieznany adres poza /app trafia tutaj zamiast na domyślny ekran React Router.
    errorElement,
    children: [
      {
        index: true,
        element: <Navigate to="/app/" replace />,
      },
      {
        path: LoginUrl,
        element: <LoginView />,
        action: loginAction,
      },
      {
        path: SignUpUrl,
        element: <SignUpView />,
      },
      {
        path: LogoutUrl,
        action: logoutAction,
      },
      {
        path: VerifyEmailUrl,
        element: <EmailVerification />,
      },
      {
        path: OAuth2CallbackUrl,
        element: <OAuth2CallbackPage />,
      },
    ],
  },
  {
    path: '/app',
    element: <Layout theme={theme} />,
    errorElement,
    loader: tokenLoader,
    children: [
      { index: true, element: <HomeView /> },
      {
        path: TRAINING,
        children: [
          {
            path: VIEW,
            element: <TrainingsView />,
          },
          {
            path: EXERCISES,
            element: <ExerciseView />,
          },
          {
            path: MAXIMUM,
            element: <MaximumExerciseView />,
          },
          {
            path: ADD,
            element: <AddTrainingView />,
            loader: () =>
              import('./training/trainingForm/TrainingForm.jsx').then((module) => module.loader()),
          },
          {
            path: STATISTICS,
            element: <TrainingStatistic />,
            loader: () =>
              import('./training/trainingStatistic/TrainingStatistics.jsx').then((module) =>
                module.loader()
              ),
          },
          {
            path: TEMPLATES,
            element: <TrainingTemplatesView />,
          },
        ],
      },
      {
        path: FOOD,
        children: [
          {
            path: VIEW,
            element: <MealView />,
          },
          {
            path: ADD,
            element: <AddDietDayView />,
          },
          {
            path: ':id/edit',
            element: <EditDietDayView />,
            loader: ({ params }) =>
              import('./food/editDietSummaryView/EditDietDayView.jsx').then((module) =>
                module.loader({ params })
              ),
          },
          {
            path: STATISTICS,
            element: <DietStatisticView />,
          },
          {
            path: PRODUCTS,
            element: <ProductView />,
          },
        ],
      },
      {
        path: OTHER,
        children: [
          {
            path: DAILY,
            element: <DailyView />,
          },
          {
            path: WEEKLY,
            element: <WeeklyRecordView />,
          },
          {
            path: SHOPPING,
            element: <ShoppingListView />,
          },
        ],
      },
      {
        path: FINANCE,
        children: [
          {
            path: VIEW,
            element: <FinanceView />,
          },
          {
            path: INFORMATION,
            element: <FinanceInformation />,
          },
          {
            path: LIVE,
            element: <LiveMarketView />,
          },
        ],
      },
      {
        path: AUDIT,
        children: [
          {
            path: '',
            element: <DietAuditSelectorPage />,
          },
          {
            path: ':dietSummaryId',
            element: <DietAuditPage />,
          },
        ],
      },
    ],
  },
]);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <QueryClientProvider client={queryClient}>
        <SnackbarProvider>
          <Box className="App">
            {/* Layout i PublicLayout są leniwe — ta granica obsługuje ich pierwsze ładowanie */}
            <Suspense fallback={<PageLoader />}>
              <RouterProvider router={router} />
            </Suspense>
          </Box>
        </SnackbarProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
