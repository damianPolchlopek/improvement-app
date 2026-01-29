// features/diet-audit/components/MealChangesList.jsx

import React, { useState } from 'react';

import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Collapse,
  useTheme,
  alpha,
  Divider
} from '@mui/material';

import {
  ExpandMore as ExpandMoreIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Edit as EditIcon,
  Restaurant as RestaurantIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon
} from '@mui/icons-material';

import Grid from '@mui/material/Unstable_Grid2';

const MealChangesList = ({ changes }) => {
  const theme = useTheme();
  const [expandedMeals, setExpandedMeals] = useState(new Set());

  const toggleMeal = (mealId) => {
    setExpandedMeals(prev => {
      const newSet = new Set(prev);
      if (newSet.has(mealId)) {
        newSet.delete(mealId);
      } else {
        newSet.add(mealId);
      }
      return newSet;
    });
  };

  const hasChanges = 
    changes.mealsAdded.length > 0 ||
    changes.mealsRemoved.length > 0 ||
    changes.mealsModified.length > 0;

  if (!hasChanges) {
    return (
      <Card elevation={6} sx={{
        borderRadius: 3,
        background: 'linear-gradient(145deg, #1a2e3d 0%, #243441 100%)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        p: 6,
        textAlign: 'center'
      }}>
        <RestaurantIcon sx={{ fontSize: 64, color: 'rgba(255, 255, 255, 0.3)', mb: 2 }} />
        <Typography variant="h6" color="rgba(255, 255, 255, 0.7)">
          Brak zmian w posiłkach
        </Typography>
        <Typography variant="body2" color="rgba(255, 255, 255, 0.5)" sx={{ mt: 1 }}>
          Między tymi wersjami nie dokonano zmian w składzie posiłków
        </Typography>
      </Card>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      
      {/* Dodane posiłki */}
      {changes.mealsAdded.length > 0 && (
        <Card elevation={6} sx={{
          borderRadius: 3,
          background: 'linear-gradient(145deg, #1a2e3d 0%, #243441 100%)',
          border: '1px solid rgba(76, 175, 80, 0.3)',
        }}>
          <Box sx={{
            p: 2,
            background: 'linear-gradient(90deg, rgba(76, 175, 80, 0.2) 0%, rgba(76, 175, 80, 0.05) 100%)',
            borderBottom: '1px solid rgba(76, 175, 80, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}>
            <AddIcon sx={{ color: '#4caf50', fontSize: 28 }} />
            <Typography variant="h6" fontWeight="600" color="#4caf50">
              Dodane posiłki ({changes.mealsAdded.length})
            </Typography>
          </Box>
          
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {changes.mealsAdded.map(meal => (
                <MealCard key={meal.id} meal={meal} type="added" />
              ))}
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Usunięte posiłki */}
      {changes.mealsRemoved.length > 0 && (
        <Card elevation={6} sx={{
          borderRadius: 3,
          background: 'linear-gradient(145deg, #1a2e3d 0%, #243441 100%)',
          border: '1px solid rgba(244, 67, 54, 0.3)',
        }}>
          <Box sx={{
            p: 2,
            background: 'linear-gradient(90deg, rgba(244, 67, 54, 0.2) 0%, rgba(244, 67, 54, 0.05) 100%)',
            borderBottom: '1px solid rgba(244, 67, 54, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}>
            <RemoveIcon sx={{ color: '#f44336', fontSize: 28 }} />
            <Typography variant="h6" fontWeight="600" color="#f44336">
              Usunięte posiłki ({changes.mealsRemoved.length})
            </Typography>
          </Box>
          
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {changes.mealsRemoved.map(meal => (
                <MealCard key={meal.id} meal={meal} type="removed" />
              ))}
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Zmodyfikowane posiłki */}
      {changes.mealsModified.length > 0 && (
        <Card elevation={6} sx={{
          borderRadius: 3,
          background: 'linear-gradient(145deg, #1a2e3d 0%, #243441 100%)',
          border: '1px solid rgba(33, 150, 243, 0.3)',
        }}>
          <Box sx={{
            p: 2,
            background: 'linear-gradient(90deg, rgba(33, 150, 243, 0.2) 0%, rgba(33, 150, 243, 0.05) 100%)',
            borderBottom: '1px solid rgba(33, 150, 243, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}>
            <EditIcon sx={{ color: '#2196f3', fontSize: 28 }} />
            <Typography variant="h6" fontWeight="600" color="#2196f3">
              Zmodyfikowane posiłki ({changes.mealsModified.length})
            </Typography>
          </Box>
          
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {changes.mealsModified.map(({ meal, changes: mealChanges }) => (
                <ModifiedMealCard
                  key={meal.id}
                  meal={meal}
                  changes={mealChanges}
                  isExpanded={expandedMeals.has(meal.id)}
                  onToggle={() => toggleMeal(meal.id)}
                />
              ))}
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

// Karta dodanego/usuniętego posiłku
const MealCard = ({ meal, type }) => {
  const isAdded = type === 'added';
  const bgColor = isAdded 
    ? 'rgba(76, 175, 80, 0.1)' 
    : 'rgba(244, 67, 54, 0.1)';
  const borderColor = isAdded 
    ? 'rgba(76, 175, 80, 0.3)' 
    : 'rgba(244, 67, 54, 0.3)';
  const textColor = isAdded ? '#4caf50' : '#f44336';

  return (
    <Card elevation={2} sx={{
      borderRadius: 2,
      background: bgColor,
      border: `2px solid ${borderColor}`,
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: `0 4px 12px ${alpha(textColor, 0.3)}`,
      }
    }}>
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
          <Box flex={1}>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              {isAdded ? (
                <AddIcon sx={{ color: textColor, fontSize: 20 }} />
              ) : (
                <RemoveIcon sx={{ color: textColor, fontSize: 20 }} />
              )}
              <Typography variant="h6" fontWeight="700" color="white">
                {meal.name}
              </Typography>
            </Box>
            
            <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
              Porcja: <strong>{meal.portionMultiplier}x</strong>
            </Typography>
          </Box>

          <Box textAlign="right">
            <Typography variant="h5" fontWeight="700" sx={{ color: '#ff9800', mb: 0.5 }}>
              {meal.cachedKcal.toFixed(0)}
            </Typography>
            <Typography variant="caption" color="rgba(255, 255, 255, 0.6)">
              kcal
            </Typography>
          </Box>
        </Box>

        {/* Makroskładniki */}
        <Grid container spacing={1}>
          <Grid xs={4}>
            <Box 
              sx={{ 
                textAlign: 'center',
                py: 1,
                borderRadius: 1,
                backgroundColor: 'rgba(33, 150, 243, 0.1)',
                border: '1px solid rgba(33, 150, 243, 0.2)',
              }}
            >
              <Typography variant="caption" color="rgba(255, 255, 255, 0.6)">
                Białko
              </Typography>
              <Typography variant="body1" fontWeight="700" color="#2196f3">
                {meal.cachedProtein.toFixed(1)}g
              </Typography>
            </Box>
          </Grid>
          <Grid xs={4}>
            <Box 
              sx={{ 
                textAlign: 'center',
                py: 1,
                borderRadius: 1,
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                border: '1px solid rgba(76, 175, 80, 0.2)',
              }}
            >
              <Typography variant="caption" color="rgba(255, 255, 255, 0.6)">
                Węgle
              </Typography>
              <Typography variant="body1" fontWeight="700" color="#4caf50">
                {meal.cachedCarbohydrates.toFixed(1)}g
              </Typography>
            </Box>
          </Grid>
          <Grid xs={4}>
            <Box 
              sx={{ 
                textAlign: 'center',
                py: 1,
                borderRadius: 1,
                backgroundColor: 'rgba(253, 216, 53, 0.1)',
                border: '1px solid rgba(253, 216, 53, 0.2)',
              }}
            >
              <Typography variant="caption" color="rgba(255, 255, 255, 0.6)">
                Tłuszcze
              </Typography>
              <Typography variant="body1" fontWeight="700" color="#fdd835">
                {meal.cachedFat.toFixed(1)}g
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Składniki */}
        {meal.ingredients && meal.ingredients.length > 0 && (
          <Box sx={{ 
            mt: 2, 
            pt: 2, 
            borderTop: '1px solid rgba(255, 255, 255, 0.1)' 
          }}>
            <Typography 
              variant="caption" 
              color="rgba(255, 255, 255, 0.6)"
              sx={{ 
                mb: 1, 
                display: 'block',
                textTransform: 'uppercase',
                letterSpacing: 1,
                fontWeight: 600
              }}
            >
              Składniki ({meal.ingredients.length}):
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              {meal.ingredients.slice(0, 3).map(ing => (
                <Typography key={ing.id} variant="body2" color="rgba(255, 255, 255, 0.8)">
                  • {ing.name}: {ing.amount} {ing.unit}
                </Typography>
              ))}
              {meal.ingredients.length > 3 && (
                <Typography variant="caption" color="rgba(255, 255, 255, 0.5)">
                  ... i {meal.ingredients.length - 3} więcej
                </Typography>
              )}
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

// Karta zmodyfikowanego posiłku
const ModifiedMealCard = ({ meal, changes, isExpanded, onToggle }) => {
  const hasIngredientChanges = 
    changes.ingredientsAdded.length > 0 ||
    changes.ingredientsRemoved.length > 0 ||
    changes.ingredientsModified.length > 0;

  const totalChanges = 
    (changes.portionChanged ? 1 : 0) +
    (Object.values(changes.macrosChanged).some(v => v) ? 1 : 0) +
    (hasIngredientChanges ? 1 : 0);

  return (
    <Card elevation={2} sx={{
      borderRadius: 2,
      background: 'rgba(33, 150, 243, 0.1)',
      border: '2px solid rgba(33, 150, 243, 0.3)',
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 12px rgba(33, 150, 243, 0.3)',
      }
    }}>
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="start">
          <Box flex={1}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <EditIcon sx={{ color: '#2196f3', fontSize: 20 }} />
              <Typography variant="h6" fontWeight="700" color="white">
                {meal.name}
              </Typography>
              <Chip
                label={`${totalChanges} ${totalChanges === 1 ? 'zmiana' : 'zmiany'}`}
                size="small"
                sx={{
                  backgroundColor: 'rgba(33, 150, 243, 0.3)',
                  color: '#2196f3',
                  fontWeight: 600,
                  height: '20px',
                  fontSize: '0.7rem'
                }}
              />
            </Box>
            
            {/* Lista zmian */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {changes.portionChanged && (
                <ChangeIndicator 
                  icon={<RestaurantIcon sx={{ fontSize: 16 }} />}
                  text="Zmieniono wielkość porcji"
                  color="#2196f3"
                />
              )}
              {changes.macrosChanged.kcal && (
                <ChangeIndicator 
                  icon={<TrendingUpIcon sx={{ fontSize: 16 }} />}
                  text="Zmieniły się makroskładniki"
                  color="#ff9800"
                />
              )}
              {hasIngredientChanges && (
                <ChangeIndicator 
                  icon={<EditIcon sx={{ fontSize: 16 }} />}
                  text={`Zmiany w składnikach (${
                    changes.ingredientsAdded.length + 
                    changes.ingredientsRemoved.length +
                    changes.ingredientsModified.length
                  })`}
                  color="#4caf50"
                />
              )}
            </Box>
          </Box>

          <IconButton
            onClick={onToggle}
            sx={{
              color: '#2196f3',
              transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s ease',
              '&:hover': {
                backgroundColor: 'rgba(33, 150, 243, 0.1)',
              }
            }}
          >
            <ExpandMoreIcon />
          </IconButton>
        </Box>

        {/* Expanded details */}
        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
          <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
            
            {/* Dodane składniki */}
            {changes.ingredientsAdded.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <AddIcon sx={{ fontSize: 18, color: '#4caf50' }} />
                  <Typography variant="body2" fontWeight="600" color="#4caf50">
                    Dodane składniki:
                  </Typography>
                </Box>
                <Box sx={{ pl: 3, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  {changes.ingredientsAdded.map(ing => (
                    <Typography key={ing.id} variant="body2" color="rgba(255, 255, 255, 0.8)">
                      • {ing.name}: {ing.amount} {ing.unit}
                    </Typography>
                  ))}
                </Box>
              </Box>
            )}

            {/* Usunięte składniki */}
            {changes.ingredientsRemoved.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <RemoveIcon sx={{ fontSize: 18, color: '#f44336' }} />
                  <Typography variant="body2" fontWeight="600" color="#f44336">
                    Usunięte składniki:
                  </Typography>
                </Box>
                <Box sx={{ pl: 3, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  {changes.ingredientsRemoved.map(ing => (
                    <Typography 
                      key={ing.id} 
                      variant="body2" 
                      sx={{ 
                        color: 'rgba(255, 255, 255, 0.6)',
                        textDecoration: 'line-through'
                      }}
                    >
                      • {ing.name}: {ing.amount} {ing.unit}
                    </Typography>
                  ))}
                </Box>
              </Box>
            )}

            {/* Zmodyfikowane składniki */}
            {changes.ingredientsModified.length > 0 && (
              <Box>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <EditIcon sx={{ fontSize: 18, color: '#2196f3' }} />
                  <Typography variant="body2" fontWeight="600" color="#2196f3">
                    Zmodyfikowane składniki:
                  </Typography>
                </Box>
                <Box sx={{ pl: 3, display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {changes.ingredientsModified.map(({ ingredient, oldAmount, newAmount }) => (
                    <Box key={ingredient.id}>
                      <Typography variant="body2" color="white" fontWeight="600">
                        • {ingredient.name}:
                      </Typography>
                      <Box display="flex" alignItems="center" gap={1} ml={2}>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            textDecoration: 'line-through',
                            color: 'rgba(255, 255, 255, 0.4)'
                          }}
                        >
                          {oldAmount} {ingredient.unit}
                        </Typography>
                        <Typography variant="caption" color="rgba(255, 255, 255, 0.6)">
                          →
                        </Typography>
                        <Typography variant="caption" fontWeight="700" color="#4caf50">
                          {newAmount} {ingredient.unit}
                        </Typography>
                        {oldAmount !== newAmount && (
                          <Chip
                            label={`${newAmount > oldAmount ? '+' : ''}${(newAmount - oldAmount).toFixed(1)}`}
                            size="small"
                            icon={newAmount > oldAmount ? <TrendingUpIcon /> : <TrendingDownIcon />}
                            sx={{
                              height: '18px',
                              fontSize: '0.65rem',
                              backgroundColor: newAmount > oldAmount 
                                ? 'rgba(76, 175, 80, 0.2)' 
                                : 'rgba(244, 67, 54, 0.2)',
                              color: newAmount > oldAmount ? '#4caf50' : '#f44336',
                              '& .MuiChip-icon': {
                                fontSize: '0.75rem',
                                color: newAmount > oldAmount ? '#4caf50' : '#f44336',
                              }
                            }}
                          />
                        )}
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
};

// Helper component
const ChangeIndicator = ({ icon, text, color }) => (
  <Box display="flex" alignItems="center" gap={1}>
    <Box sx={{ color }}>{icon}</Box>
    <Typography variant="body2" color="rgba(255, 255, 255, 0.9)">
      {text}
    </Typography>
  </Box>
);

export default MealChangesList;