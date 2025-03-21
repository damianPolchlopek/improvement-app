import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';

import Cookies from 'universal-cookie';
import LanguageSwitcher from '../language/LanguageSwitcher';
import HeaderDesktop from './HeaderDesktop';
import HeaderMobile from './HeaderMobile';

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
} from '../utils/URLHelper';

const pages = ['Training', 'Food', 'Finance', 'Other', 'Projects'];
const subPages = {
  Training: [
    { name: 'View', path: TrainingViewUrl },
    { name: 'Exercises', path: ExerciseViewUrl },
    { name: 'Maximum', path: MaximumExerciseViewUrl },
    { name: 'Add', path: TrainingAddUrl },
    { name: 'Statistics', path: TrainingStatisticUrl },
  ],
  Food: [
    { name: 'View', path: FoodViewUrl },
    { name: 'Add', path: FoodAddUrl },
    { name: 'Statistics', path: CalculateIngredientsUrl },
    { name: 'Products', path: FoodProductUrl },
  ],
  Finance: [
    { name: 'View', path: FinanceViewUrl },
    { name: 'Information', path: FinanceConfigUrl },
  ],
  Other: [
    { name: 'Shopping', path: ShoppingViewUrl },
    { name: 'Weekly', path: WeeklyViewUrl },
    { name: 'Daily', path: DailyViewUrl },
  ],
  Projects: [
    { name: 'Timer Challenge', path: TimerChallengeUrl },
    { name: 'Vacations', path: HolidayPickerUrl },
  ],
};

const settings = ['Profile', 'Settings', 'Logout'];

function ResponsiveAppBar({onDrawerToggle}) {
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };


  const handleLogout = () => {
    console.log('User logged out');
    new Cookies().remove('authorization');
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          
          <HeaderMobile
            onDrawerToggle={onDrawerToggle}
          />
          <HeaderDesktop
            pages={pages}
            subPages={subPages}
          />
          
          <LanguageSwitcher />

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="D" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem
                  key={setting}
                  onClick={
                    setting === 'Logout' ? handleLogout : handleCloseUserMenu
                  }
                >
                  <Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;