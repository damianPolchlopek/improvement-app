import * as React from 'react';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import InventoryIcon from '@mui/icons-material/Inventory';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import HomeIcon from '@mui/icons-material/Home';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ShowChartIcon from '@mui/icons-material/ShowChart';

import Logo from './Logo';
import {HomeViewUrl, 
  TrainingViewUrl, 
  TrainingAddUrl, 
  TrainingStatisticUrl,
  FoodViewUrl,
  FoodAddUrl,
  FoodStatisticUrl,
  FoodProductUrl,
  ShoppingViewUrl,
  ShoppingAddUrl
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
    id: 'Shopping',
    icon: <ShoppingBagIcon />,
    children: [
      { id: 'View', icon: <VisibilityIcon />, href: ShoppingViewUrl },
      { id: 'Add', icon: <AddIcon />, href: ShoppingAddUrl },
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

const itemCategory = {
  boxShadow: '0 -1px 0 rgb(255,255,255,0.1) inset',
  py: 2,
  px: 6,
};

export default function TrainingNavigation(props) {
  const { ...other } = props;

  return (
    <Drawer variant="permanent" {...other}>
      <List disablePadding>
        <ListItem sx={{ ...item, ...itemCategory, fontSize: 22, color: '#fff' }}>
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

