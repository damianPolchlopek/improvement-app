import React from 'react';
import { useTranslation } from 'react-i18next';

import {
  Box,
  Card,
  CardContent,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs, 
  Typography,
  useTheme,
  Chip,
  Paper
} from '@mui/material';

import { 
  Restaurant, 
  Info, 
  Kitchen, 
  MenuBook,
  LocalFireDepartment,
  FitnessCenter,
  Grain,
  Opacity
} from '@mui/icons-material';

import TabPanel from '../component/TabPanel';

export default function SingleMeal({ meal }) {
  const [tabIndex, setTabIndex] = React.useState(0);
  const { t } = useTranslation();
  const theme = useTheme();

  const handleTabIndexChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const tabs = [
    { label: t('food.summary'), icon: <Info /> },
    { label: t('food.products'), icon: <Kitchen /> },
    { label: t('food.recipes'), icon: <MenuBook /> }
  ];

  const nutritionData = [
    { 
      icon: <LocalFireDepartment sx={{ color: '#ff5722' }} />, 
      label: t('food.kcal'), 
      value: meal.kcal,
      color: '#ff5722'
    },
    { 
      icon: <FitnessCenter sx={{ color: '#2196f3' }} />, 
      label: t('food.protein'), 
      value: meal.protein,
      color: '#2196f3'
    },
    { 
      icon: <Grain sx={{ color: '#ff9800' }} />, 
      label: t('food.carbs'), 
      value: meal.carbohydrates,
      color: '#ff9800'
    },
    { 
      icon: <Opacity sx={{ color: '#4caf50' }} />, 
      label: t('food.fat'), 
      value: meal.fat,
      color: '#4caf50'
    }
  ];

  return (
    <Card elevation={6} sx={{
      borderRadius: 3,
      overflow: 'hidden',
      height: '100%',
      transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 30px rgba(0,0,0,0.2)'
      }
    }}>
      {/* Header with meal name */}
      <Box sx={{
        p: 3,
        background: theme.palette.card.header,
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: 2
      }}>
        <Restaurant sx={{ fontSize: 28 }} />
        <Typography variant="h6" fontWeight="600">
          {meal.name}
        </Typography>
      </Box>

      {/* Tabs */}
      <Tabs
        value={tabIndex}
        onChange={handleTabIndexChange}
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          '& .MuiTab-root': {
            minHeight: 64,
            fontWeight: 500
          }
        }}
      >
        {tabs.map((tab, index) => (
          <Tab 
            key={index} 
            label={tab.label}
            icon={tab.icon}
            iconPosition="start"
            sx={{
              '&.Mui-selected': {
                fontWeight: 600
              }
            }}
          />
        ))}
      </Tabs>

      <CardContent sx={{ p: 3 }}>
        <TabPanel value={tabIndex} index={0}>
          {/* Nutrition Cards Grid */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" fontWeight="600" gutterBottom>
              Wartości Odżywcze
            </Typography>
            <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={2} mb={3}>
              {nutritionData.map((item, index) => (
                <Paper key={index} elevation={2} sx={{
                  p: 2,
                  borderRadius: 2,
                  textAlign: 'center',
                  background: `linear-gradient(45deg, ${item.color}20, ${item.color}10)`,
                  border: `1px solid ${item.color}30`
                }}>
                  <Box display="flex" alignItems="center" justifyContent="center" gap={1} mb={1}>
                    {item.icon}
                    <Typography variant="body2" fontWeight="500" color="text.secondary">
                      {item.label}
                    </Typography>
                  </Box>
                  <Typography variant="h6" fontWeight="600" color={item.color}>
                    {item.value}
                  </Typography>
                </Paper>
              ))}
            </Box>
          </Box>

          {/* Additional Info */}
          <Box>
            <Typography variant="h6" fontWeight="600" gutterBottom>
              Szczegóły
            </Typography>
            <TableContainer component={Paper} elevation={1} sx={{ borderRadius: 2 }}>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell variant="head" sx={{ fontWeight: 600 }}>
                      {t('food.portionAmount')}
                    </TableCell>
                    <TableCell>
                      <Chip label={meal.portionAmount} color="primary" variant="outlined" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell variant="head" sx={{ fontWeight: 600 }}>
                      {t('food.url')}
                    </TableCell>
                    <TableCell>
                      {meal.url ? (
                        <Typography 
                          component="a" 
                          href={meal.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          sx={{ 
                            color: 'primary.main',
                            textDecoration: 'none',
                            '&:hover': {
                              textDecoration: 'underline'
                            }
                          }}
                        >
                          Zobacz przepis
                        </Typography>
                      ) : (
                        <Typography color="text.secondary">
                          Brak linku
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </TabPanel>

        <TabPanel value={tabIndex} index={1}>
          {meal.ingredients?.length > 0 ? (
            <Box>
              <Typography variant="h6" fontWeight="600" gutterBottom>
                Składniki ({meal.ingredients.length})
              </Typography>
              <TableContainer component={Paper} elevation={1} sx={{ borderRadius: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>{t('food.name')}</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>{t('food.amount')}</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>{t('food.unit')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {meal.ingredients?.map((ingredient, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          '&:last-child td, &:last-child th': { border: 0 },
                          '&:hover': { backgroundColor: 'blue' }
                        }}
                      >
                        <TableCell sx={{ fontWeight: 500 }}>{ingredient.name}</TableCell>
                        <TableCell>
                          <Chip 
                            label={ingredient.amount} 
                            size="small" 
                            color="primary" 
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={ingredient.unit} 
                            size="small" 
                            color="secondary" 
                            variant="outlined"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          ) : (
            <Box textAlign="center" py={4}>
              <Kitchen sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                {t('food.noProducts')}
              </Typography>
            </Box>
          )}
        </TabPanel>

        <TabPanel value={tabIndex} index={2}>
          {meal.recipe?.length > 0 ? (
            <Box>
              <Typography variant="h6" fontWeight="600" gutterBottom>
                Sposób Przygotowania
              </Typography>
              <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
                {meal.recipe.map((recipeRow, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Typography 
                      variant="body1" 
                    >
                      {recipeRow}
                    </Typography>
                  </Box>
                ))}
              </Paper>
            </Box>
          ) : (
            <Box textAlign="center" py={4}>
              <MenuBook sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                {t('food.noRecipes')}
              </Typography>
            </Box>
          )}
        </TabPanel>
      </CardContent>
    </Card>
  );
}