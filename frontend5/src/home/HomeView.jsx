import React, { useState } from 'react';
import REST from '../utils/REST';

import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Container,
  Fade,
  useTheme
} from '@mui/material';
import {
  FitnessCenter,
  Restaurant,
  Home as HomeIcon
} from '@mui/icons-material';

import LogComponent from './LogComponent';

function HomeView() {
  const [loadingTrainingModule, setLoadingTrainingModule] = useState(false);
  const [loadingFoodModule, setLoadingFoodModule] = useState(false);
  const { t } = useTranslation();
  const theme = useTheme();

  function handleClickTrainingModule() {
    setLoadingTrainingModule(true);
    REST.initTrainingModule().then(response => {
      setLoadingTrainingModule(false);
    })
  }

  function handleClickFoodModule() {
    setLoadingFoodModule(true);
    REST.initFoodModule().then(response => {
      setLoadingFoodModule(false);
    })
  }

  return (
    <Box sx={{ py: 4, minHeight: '100vh' }}>
      <Container maxWidth="xl" sx={{ width: '90%' }}>
        
        {/* Header Section */}
        <Card elevation={8} sx={{ 
          borderRadius: 4,
          background: theme.palette.card?.header || 'linear-gradient(145deg, #1a2e3d 0%, #243441 100%)',
          color: 'white',
          mb: 4,
          overflow: 'hidden',
          border: theme.palette.card?.border || '1px solid rgba(255, 255, 255, 0.1)',
        }}>
          <CardContent sx={{ p: 4 }}>
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <HomeIcon sx={{ fontSize: 40, color: '#4caf50' }} />
              <Box>
                <Typography variant="h3" fontWeight="700" sx={{ mb: 1 }}>
                  Panel Główny
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                  Zarządzaj modułami aplikacji
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Module Buttons Section */}
        <Grid container spacing={3} sx={{ 
          mb: 4,
          opacity: 0,
          animation: 'fadeIn 1s ease-in-out forwards',
          '@keyframes fadeIn': {
            '0%': { opacity: 0, transform: 'translateY(20px)' },
            '100%': { opacity: 1, transform: 'translateY(0)' }
          }
        }}>
          <Grid xs={12} md={6}>
            <Card elevation={6} sx={{ 
              borderRadius: 3,
              background: 'linear-gradient(145deg, #1a2e3d 0%, #243441 100%)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              overflow: 'hidden',
              height: '100%',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(76, 175, 80, 0.3)',
              }
            }}>
              <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box display="flex" alignItems="center" gap={2} mb={3}>
                  <FitnessCenter sx={{ fontSize: 32, color: '#4caf50' }} />
                  <Typography variant="h5" fontWeight="600" color="white">
                    Moduł Treningowy
                  </Typography>
                </Box>
                <Typography variant="body1" color="rgba(255, 255, 255, 0.8)" sx={{ mb: 3, flexGrow: 1 }}>
                  Inicjalizuj system treningowy do zarządzania ćwiczeniami i planami treningowymi
                </Typography>
                <LoadingButton
                  size="large"
                  onClick={handleClickTrainingModule}
                  loading={loadingTrainingModule}
                  variant="contained"
                  fullWidth
                  sx={{
                    py: 2,
                    background: 'linear-gradient(135deg, #4caf50 0%, #81c784 100%)',
                    borderRadius: 2,
                    fontWeight: 600,
                    fontSize: '1.1rem',
                    textTransform: 'none',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #45a049 0%, #66bb6a 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(76, 175, 80, 0.4)',
                    },
                    '&:disabled': {
                      background: 'rgba(255, 255, 255, 0.1)',
                    }
                  }}
                >
                  {t('home.initTrainingModule')}
                </LoadingButton>
              </CardContent>
            </Card>
          </Grid>

          <Grid xs={12} md={6}>
            <Card elevation={6} sx={{ 
              borderRadius: 3,
              background: 'linear-gradient(145deg, #1a2e3d 0%, #243441 100%)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              overflow: 'hidden',
              height: '100%',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(255, 152, 0, 0.3)',
              }
            }}>
              <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box display="flex" alignItems="center" gap={2} mb={3}>
                  <Restaurant sx={{ fontSize: 32, color: '#ff9800' }} />
                  <Typography variant="h5" fontWeight="600" color="white">
                    Moduł Żywieniowy
                  </Typography>
                </Box>
                <Typography variant="body1" color="rgba(255, 255, 255, 0.8)" sx={{ mb: 3, flexGrow: 1 }}>
                  Inicjalizuj system żywieniowy do zarządzania dietą i kaloriami
                </Typography>
                <LoadingButton
                  variant="contained"
                  size="large"
                  onClick={handleClickFoodModule}
                  loading={loadingFoodModule}
                  fullWidth
                  sx={{
                    py: 2,
                    background: 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)',
                    borderRadius: 2,
                    fontWeight: 600,
                    fontSize: '1.1rem',
                    textTransform: 'none',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #f57c00 0%, #ff9800 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(255, 152, 0, 0.4)',
                    },
                    '&:disabled': {
                      background: 'rgba(255, 255, 255, 0.1)',
                    }
                  }}
                >
                  {t('home.initFoodModule')}
                </LoadingButton>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Log Component Section */}
        <Box sx={{
          opacity: 0,
          animation: 'fadeIn 1.5s ease-in-out forwards',
          animationDelay: '0.5s',
          '@keyframes fadeIn': {
            '0%': { opacity: 0, transform: 'translateY(20px)' },
            '100%': { opacity: 1, transform: 'translateY(0)' }
          }
        }}>
          <LogComponent />
        </Box>

      </Container>
    </Box>
  );
}

export default HomeView;