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
  TrainingAddUrl, 
  TrainingStatisticUrl,
  TrainingInformationUrl,
  FoodViewUrl,
  FoodAddUrl,
  FoodStatisticUrl,
  FoodProductUrl,
  ShoppingViewUrl,
  WeeklyViewUrl,
  DailyViewUrl,
  FinanceConfigUrl,
  FinanceViewUrl
} from "../utils/URLHelper";

const categories = [
  {
    id: 'Home',
    icon: <HomeIcon />,
    children: [
      { id: 'View', icon: <VisibilityIcon />, href: HomeViewUrl },
    ],
  },
  {
    id: 'Training',
    icon: <FitnessCenterIcon />,
    children: [
      { id: 'View', icon: <VisibilityIcon />, href: TrainingViewUrl },
      { id: 'Add', icon: <AddIcon />, href: TrainingAddUrl },
      { id: 'Statistic', icon: <ShowChartIcon />, href: TrainingStatisticUrl },
      { id: 'Information', icon: <InventoryIcon />, href: TrainingInformationUrl },
    ],
  },
  {
    id: 'Food',
    icon: <RestaurantIcon />,
    children: [
      { id: 'View', icon: <VisibilityIcon />, href: FoodViewUrl },
      { id: 'Add', icon: <AddIcon />, href: FoodAddUrl },
      { id: 'Statistic', icon: <ShowChartIcon />, href: FoodStatisticUrl },
      { id: 'Product', icon: <InventoryIcon />, href: FoodProductUrl },
    ],
  },
  {
    id: 'Finance',
    icon: <AttachMoneyIcon />,
    children: [
      { id: 'View', icon: <VisibilityIcon />, href: FinanceViewUrl },
      { id: 'Information', icon: <InventoryIcon />, href: FinanceConfigUrl },
    ],
  },
  {
    id: 'Shopping',
    icon: <ShoppingBagIcon />,
    children: [
      { id: 'View', icon: <VisibilityIcon />, href: ShoppingViewUrl },
    ],
  },
  {
    id: 'Other',
    icon: <CalendarTodayIcon />,
    children: [
      { id: 'Weekly', icon: <VisibilityIcon />, href: WeeklyViewUrl },
      { id: 'Daily', icon: <VisibilityIcon />, href: DailyViewUrl },
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

export default function TrainingNavigation(props) {
  const { ...other } = props;

  return (
    <Drawer variant="permanent" {...other}>
      <List disablePadding>
        <ListItem sx={{ ...item, px: 8, py: 2, fontSize: 22, color: '#fff' }}>
          <Logo />

        </ListItem>
        {categories.map(({ id, children, icon }) => (
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

