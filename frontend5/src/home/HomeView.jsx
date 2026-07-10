import React, { useState } from 'react';
import REST from '../utils/REST';

import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { useTranslation } from 'react-i18next';
import { Box, Card, CardContent, Typography, Container, useTheme } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { FitnessCenter, Restaurant, Home as HomeIcon } from '@mui/icons-material';

import LogComponent from './LogComponent';

function HomeView() {
  const [loadingTrainingModule, setLoadingTrainingModule] = useState(false);
  const [loadingFoodModule, setLoadingFoodModule] = useState(false);
  const { t } = useTranslation();
  const theme = useTheme();

  function handleClickTrainingModule() {
    setLoadingTrainingModule(true);
    REST.initTrainingModule().then(() => {
      setLoadingTrainingModule(false);
    });
  }

  function handleClickFoodModule() {
    setLoadingFoodModule(true);
    REST.initFoodModule().then(() => {
      setLoadingFoodModule(false);
    });
  }

  return (
    <Box sx={{ py: 4, minHeight: '100vh' }}>
      <Container maxWidth="xl" sx={{ width: '90%' }}>
        {/* Header Section */}
        <Card
          elevation={2}
          sx={{
            borderRadius: 3,
            background: theme.palette.card.header,
            color: 'text.primary',
            mb: 3,
            overflow: 'hidden',
            border: theme.palette.card.border,
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <HomeIcon sx={{ fontSize: 32, color: 'success.main' }} />
              <Box>
                <Typography variant="h4" fontWeight="700" sx={{ mb: 0.5 }}>
                  {t('home.title')}
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  {t('home.subtitle')}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Module Buttons Section */}
        <Grid
          container
          spacing={3}
          sx={{
            mb: 4,
            opacity: 0,
            animation: 'fadeIn 1s ease-in-out forwards',
            '@keyframes fadeIn': {
              '0%': { opacity: 0, transform: 'translateY(20px)' },
              '100%': { opacity: 1, transform: 'translateY(0)' },
            },
          }}
        >
          <Grid size={{ xs: 12, md: 6 }}>
            <Card
              elevation={2}
              sx={{
                borderRadius: 3,
                background: theme.palette.card.header,
                border: theme.palette.card.border,
                overflow: 'hidden',
                height: '100%',
              }}
            >
              <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box display="flex" alignItems="center" gap={2} mb={3}>
                  <FitnessCenter sx={{ fontSize: 28, color: 'success.main' }} />
                  <Typography variant="h6" fontWeight="600" color="text.primary">
                    {t('home.trainingModule')}
                  </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3, flexGrow: 1 }}>
                  {t('home.trainingModuleDesc')}
                </Typography>
                <Button
                  size="large"
                  onClick={handleClickTrainingModule}
                  loading={loadingTrainingModule}
                  variant="contained"
                  fullWidth
                  sx={{
                    py: 2,
                    background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.light} 100%)`,
                    borderRadius: 2,
                    fontWeight: 600,
                    fontSize: '1.1rem',
                    textTransform: 'none',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: `linear-gradient(135deg, ${theme.palette.success.dark} 0%, ${theme.palette.success.main} 100%)`,
                      transform: 'translateY(-2px)',
                      boxShadow: `0 8px 25px ${alpha(theme.palette.success.main, 0.4)}`,
                    },
                    '&:disabled': {
                      background: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  {t('home.initTrainingModule')}
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Card
              elevation={2}
              sx={{
                borderRadius: 3,
                background: theme.palette.card.header,
                border: theme.palette.card.border,
                overflow: 'hidden',
                height: '100%',
              }}
            >
              <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box display="flex" alignItems="center" gap={2} mb={3}>
                  <Restaurant sx={{ fontSize: 28, color: 'warning.main' }} />
                  <Typography variant="h6" fontWeight="600" color="text.primary">
                    {t('home.foodModule')}
                  </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3, flexGrow: 1 }}>
                  {t('home.foodModuleDesc')}
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleClickFoodModule}
                  loading={loadingFoodModule}
                  fullWidth
                  sx={{
                    py: 2,
                    background: `linear-gradient(135deg, ${theme.palette.warning.main} 0%, ${theme.palette.warning.light} 100%)`,
                    borderRadius: 2,
                    fontWeight: 600,
                    fontSize: '1.1rem',
                    textTransform: 'none',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: `linear-gradient(135deg, ${theme.palette.warning.dark} 0%, ${theme.palette.warning.main} 100%)`,
                      transform: 'translateY(-2px)',
                      boxShadow: `0 8px 25px ${alpha(theme.palette.warning.main, 0.4)}`,
                    },
                    '&:disabled': {
                      background: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  {t('home.initFoodModule')}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Log Component Section */}
        <Box
          sx={{
            opacity: 0,
            animation: 'fadeIn 1.5s ease-in-out forwards',
            animationDelay: '0.5s',
            '@keyframes fadeIn': {
              '0%': { opacity: 0, transform: 'translateY(20px)' },
              '100%': { opacity: 1, transform: 'translateY(0)' },
            },
          }}
        >
          <LogComponent />
        </Box>
      </Container>
    </Box>
  );
}

export default HomeView;
