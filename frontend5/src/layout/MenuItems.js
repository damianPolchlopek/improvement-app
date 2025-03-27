import {
    TrainingViewUrl,
    ExerciseViewUrl,
    MaximumExerciseViewUrl,
    TrainingAddUrl,
    TrainingStatisticUrl,
    FoodViewUrl,
    FoodAddUrl,
    CalculateIngredientsUrl,
    FoodProductUrl,
    FinanceViewUrl,
    FinanceConfigUrl,
    ShoppingViewUrl,
    WeeklyViewUrl,
    DailyViewUrl,
    TimerChallengeUrl,
    HolidayPickerUrl,
    HomeViewUrl
  } from '../utils/URLHelper';

  import {
    FitnessCenter as FitnessCenterIcon,
    Restaurant as RestaurantIcon,
    Inventory as InventoryIcon,
    ShoppingBag as ShoppingBagIcon,
    Home as HomeIcon,
    Add as AddIcon,
    Visibility as VisibilityIcon,
    ShowChart as ShowChartIcon,
    CalendarToday as CalendarTodayIcon,
    AttachMoney as AttachMoneyIcon,
  } from '@mui/icons-material';
    
 export const MENU_ITEMS = ( t ) => [
    {
      category: t('menu.home'),
      icon: <HomeIcon />,
      subPages: [
        { name: t('menu.view'),  path: HomeViewUrl, icon: <VisibilityIcon /> },
      ],
    },
    {
      category: t('menu.training'),
      icon: <FitnessCenterIcon />,
      subPages: [
        { name: t('menu.view'), path: TrainingViewUrl, icon: <VisibilityIcon /> },
        { name: t('menu.exercises'), path: ExerciseViewUrl, icon: <VisibilityIcon /> },
        { name: t('menu.maximum'), path: MaximumExerciseViewUrl, icon: <VisibilityIcon /> },
        { name: t('menu.add'), path: TrainingAddUrl, icon: <AddIcon /> },
        { name: t('menu.statistic'), path: TrainingStatisticUrl, icon: <ShowChartIcon /> },
      ],
    },
    {
      category: t('menu.food'),
      icon: <RestaurantIcon />,
      subPages: [
        { name: t('menu.view'), path: FoodViewUrl, icon: <VisibilityIcon /> },
        { name: t('menu.add'), path: FoodAddUrl, icon: <AddIcon /> },
        { name: t('menu.statistic'), path: CalculateIngredientsUrl, icon: <ShowChartIcon /> },
        { name: t('menu.product'), path: FoodProductUrl, icon: <InventoryIcon /> },
      ],
    },
    {
      category: t('menu.finance'),
      icon: <AttachMoneyIcon />,
      subPages: [
        { name: t('menu.view'), path: FinanceViewUrl, icon: <VisibilityIcon /> },
        { name: t('menu.information'), path: FinanceConfigUrl, icon: <InventoryIcon /> },
      ],
    },
    {
      category: t('menu.other'),
      icon: <CalendarTodayIcon />,
      subPages: [
        { name: t('menu.shopping'), path: ShoppingViewUrl, icon: <ShoppingBagIcon /> },
        { name: t('menu.weekly'), path: WeeklyViewUrl, icon: <VisibilityIcon /> },
        { name: t('menu.daily'), path: DailyViewUrl, icon: <VisibilityIcon /> },
      ],
    },
    {
      category: t('menu.projects'),
      icon: <CalendarTodayIcon />,
      subPages: [
        { name: t('menu.timerChallenge'), path: TimerChallengeUrl, icon: <VisibilityIcon /> },
        { name: t('menu.vacations'), path: HolidayPickerUrl, icon: <VisibilityIcon /> },
      ],
    },
  ];
