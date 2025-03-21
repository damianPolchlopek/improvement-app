import * as React from 'react';
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';

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

import Logo from './Logo';
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
  FoodProductUrl,
  ShoppingViewUrl,
  WeeklyViewUrl,
  DailyViewUrl,
  FinanceConfigUrl,
  FinanceViewUrl,
  TimerChallengeUrl,
  HolidayPickerUrl
} from "../utils/URLHelper";

import { useTranslation } from 'react-i18next';

const categories = (t) => [
  {
    id: t('menu.home'),
    icon: <HomeIcon />,
    children: [
      { id: t('menu.view'), icon: <VisibilityIcon />, href: HomeViewUrl },
    ],
  },
  {
    id: t('menu.training'),
    icon: <FitnessCenterIcon />,
    children: [
      { id: t('menu.view'), icon: <VisibilityIcon />, href: TrainingViewUrl },
      { id: t('menu.exercises'), icon: <VisibilityIcon />, href: ExerciseViewUrl },
      { id: t('menu.maximum'), icon: <VisibilityIcon />, href: MaximumExerciseViewUrl },
      { id: t('menu.add'), icon: <AddIcon />, href: TrainingAddUrl },
      { id: t('menu.statistic'), icon: <ShowChartIcon />, href: TrainingStatisticUrl },
    ],
  },
  {
    id: t('menu.food'),
    icon: <RestaurantIcon />,
    children: [
      { id: t('menu.view'), icon: <VisibilityIcon />, href: FoodViewUrl },
      { id: t('menu.add'), icon: <AddIcon />, href: FoodAddUrl },
      { id: t('menu.statistic'), icon: <ShowChartIcon />, href: CalculateIngredientsUrl },
      { id: t('menu.product'), icon: <InventoryIcon />, href: FoodProductUrl },
    ],
  },
  {
    id: t('menu.finance'),
    icon: <AttachMoneyIcon />,
    children: [
      { id: t('menu.view'), icon: <VisibilityIcon />, href: FinanceViewUrl },
      { id: t('menu.information'), icon: <InventoryIcon />, href: FinanceConfigUrl },
    ],
  },
  {
    id: t('menu.shopping'),
    icon: <ShoppingBagIcon />,
    children: [
      { id: t('menu.view'), icon: <VisibilityIcon />, href: ShoppingViewUrl },
    ],
  },
  {
    id: t('menu.other'),
    icon: <CalendarTodayIcon />,
    children: [
      { id: t('menu.weekly'), icon: <VisibilityIcon />, href: WeeklyViewUrl },
      { id: t('menu.daily'), icon: <VisibilityIcon />, href: DailyViewUrl },
    ],
  },
  {
    id: t('menu.projects'),
    icon: <CalendarTodayIcon />,
    children: [
      { id: t('menu.ticTacTao'), icon: <VisibilityIcon />, href: WeeklyViewUrl },
      { id: t('menu.timerChallenge'), icon: <VisibilityIcon />, href: TimerChallengeUrl },
      { id: t('menu.management'), icon: <VisibilityIcon />, href: DailyViewUrl },
      { id: t('menu.vacations (effect)'), icon: <VisibilityIcon />, href: HolidayPickerUrl },
    ],
  },
];

const category = { 
  py: 2, 
  px: 3, 
  color: 'rgba(255, 255, 255, 0.7)',
}

const item = {
  py: '2px',
  px: 3,
  color: 'rgba(255, 255, 255, 0.7)',
  '&:hover, &:focus': {
    bgcolor: 'rgba(255, 255, 255, 0.08)',
  },
};

export default function DrawerComponent(props) {
  const { t } = useTranslation();

  return (
    <Drawer {...props}>
      <List disablePadding>
        <ListItem sx={{ ...item, px: 8, py: 2, fontSize: 22, color: '#fff' }}>
          <Logo />
        </ListItem>
        {categories(t).map(({ id, children, icon }) => (
          <Box key={id} sx={{ bgcolor: '#101F33' }}>
            <ListItem sx={{...category}}>
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText sx={{ color: '#fff' }}>{id}</ListItemText>
            </ListItem>
            {children.map(({ id: childId, icon, active, href }) => (
              <ListItem disablePadding key={childId}>
                <ListItemButton selected={active} sx={item} href={href}>
                  <ListItemIcon>{icon}</ListItemIcon>
                  <ListItemText>{childId}</ListItemText>
                </ListItemButton>
              </ListItem>
            ))}
            <Divider sx={{ mt: 2 }} />
          </Box>
        ))}
      </List>
    </Drawer>
  );
}

