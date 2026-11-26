import {
  TrainingViewUrl,
  ExerciseViewUrl,
  MaximumExerciseViewUrl,
  TrainingAddUrl,
  TrainingStatisticUrl,
  TrainingTemplatesUrl,
  FoodViewUrl,
  FoodAddUrl,
  CalculateIngredientsUrl,
  FoodProductUrl,
  FinanceViewUrl,
  FinanceConfigUrl,
  FinanceLiveUrl,
  ShoppingViewUrl,
  WeeklyViewUrl,
  DailyViewUrl,
  HomeViewUrl,
  AuditFoodUrl,
  APP,
  TRAINING,
  FOOD,
  FINANCE,
  OTHER,
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
  ListAlt as ListAltIcon,
  CalendarToday as CalendarTodayIcon,
  AttachMoney as AttachMoneyIcon,
  Sensors as SensorsIcon,
} from '@mui/icons-material';

// `basePath` służy do wykrycia aktywnego modułu w toolbarze (prefiks ścieżki),
// `quickAction` wyciąga podstronę na prawą stronę paska podnawigacji.
export const MENU_ITEMS = (t) => [
  {
    category: t('menu.home'),
    basePath: HomeViewUrl,
    exact: true,
    icon: <HomeIcon />,
    subPages: [{ name: t('menu.view'), path: HomeViewUrl, icon: <VisibilityIcon /> }],
  },
  {
    category: t('menu.training'),
    basePath: `${APP}/${TRAINING}`,
    icon: <FitnessCenterIcon />,
    subPages: [
      { name: t('menu.view'), path: TrainingViewUrl, icon: <VisibilityIcon /> },
      { name: t('menu.exercises'), path: ExerciseViewUrl, icon: <VisibilityIcon /> },
      { name: t('menu.maximum'), path: MaximumExerciseViewUrl, icon: <VisibilityIcon /> },
      { name: t('menu.templates'), path: TrainingTemplatesUrl, icon: <ListAltIcon /> },
      { name: t('menu.add'), path: TrainingAddUrl, icon: <AddIcon />, quickAction: true },
      { name: t('menu.statistic'), path: TrainingStatisticUrl, icon: <ShowChartIcon /> },
    ],
  },
  {
    category: t('menu.food'),
    basePath: `${APP}/${FOOD}`,
    icon: <RestaurantIcon />,
    subPages: [
      { name: t('menu.view'), path: FoodViewUrl, icon: <VisibilityIcon /> },
      { name: t('menu.add'), path: FoodAddUrl, icon: <AddIcon />, quickAction: true },
      { name: t('menu.statistic'), path: CalculateIngredientsUrl, icon: <ShowChartIcon /> },
      { name: t('menu.product'), path: FoodProductUrl, icon: <InventoryIcon /> },
    ],
  },
  {
    category: t('menu.finance'),
    basePath: `${APP}/${FINANCE}`,
    icon: <AttachMoneyIcon />,
    subPages: [
      { name: t('menu.view'), path: FinanceViewUrl, icon: <VisibilityIcon /> },
      { name: t('menu.live'), path: FinanceLiveUrl, icon: <SensorsIcon /> },
      { name: t('menu.information'), path: FinanceConfigUrl, icon: <InventoryIcon /> },
    ],
  },
  {
    category: t('menu.other'),
    basePath: `${APP}/${OTHER}`,
    icon: <CalendarTodayIcon />,
    subPages: [
      { name: t('menu.shopping'), path: ShoppingViewUrl, icon: <ShoppingBagIcon /> },
      { name: t('menu.weekly'), path: WeeklyViewUrl, icon: <VisibilityIcon /> },
      { name: t('menu.daily'), path: DailyViewUrl, icon: <VisibilityIcon /> },
    ],
  },
  {
    category: t('menu.audit'),
    basePath: AuditFoodUrl,
    icon: <CalendarTodayIcon />,
    subPages: [{ name: t('menu.food'), path: AuditFoodUrl, icon: <VisibilityIcon /> }],
  },
];

const normalize = (path) => (path.length > 1 ? path.replace(/\/+$/, '') : path);

export const isPathActive = (pathname, path, exact = false) => {
  const current = normalize(pathname);
  const target = normalize(path);
  return exact ? current === target : current === target || current.startsWith(`${target}/`);
};

export const findActiveModule = (items, pathname) =>
  items.find(({ basePath, exact }) => isPathActive(pathname, basePath, exact));
