import * as React from 'react';
import PropTypes from 'prop-types';

import {AppBar, Avatar, Grid, IconButton, Link, Toolbar,} from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';
import deepOrange from '@mui/material/colors/deepOrange';

import Cookies from 'universal-cookie';
import LanguageSwitcher from '../language/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

const lightColor = 'rgba(255, 255, 255, 0.7)';

export default function Header(props) {
  const {onDrawerToggle} = props;
  const { t } = useTranslation();

  return (
    <React.Fragment>
      <AppBar color="secondary" position="sticky" elevation={0}>
        <Toolbar>
          <Grid container spacing={1} alignItems="center">
            <Grid sx={{display: {sm: 'none', xs: 'block'}}} item>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={onDrawerToggle}
                edge="start"
              >
                <MenuIcon/>
              </IconButton>
            </Grid>
            <Grid item xs/>
            <Grid item>
              <Link
                href="/"
                variant="body2"
                sx={{
                  textDecoration: 'none',
                  color: lightColor,
                  '&:hover': {
                    color: 'common.white',
                  },
                }}
                onClick={() => new Cookies().remove('authorization')}
              >
                {t('header.logout')}
              </Link>
            </Grid>
            <Grid item>
              <IconButton color="inherit" sx={{p: 0.5}}>
                <Avatar alt="My Avatar" sx={{bgcolor: deepOrange[500]}}>D</Avatar>
              </IconButton>
            </Grid>
            <Grid item>
            <LanguageSwitcher />
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
}

Header.propTypes = {
  onDrawerToggle: PropTypes.func.isRequired,
};