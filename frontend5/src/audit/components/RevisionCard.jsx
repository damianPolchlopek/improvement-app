// features/diet-audit/components/RevisionCard.jsx

import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useRevisionDetails } from '../hooks/useDietAudit';
import { formatRevisionType, formatTimestamp } from '../utils/auditFormatters';

import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  alpha,
  Collapse,
  IconButton,
  CircularProgress
} from '@mui/material';


import {
  ExpandMore as ExpandMoreIcon,
  LocalDining as LocalDiningIcon,
} from '@mui/icons-material';

import Grid from '@mui/material/Unstable_Grid2';

const RevisionCard = ({ revision, onClick, isSelected }) => {
  const { dietSummaryId } = useParams();
  const [expanded, setExpanded] = useState(false);

  // Lazy loading - pobierz pełne dane dopiero gdy karta jest wybrana
  const { 
    data: fullRevision, 
    isLoading: isLoadingDetails,
    error: detailsError 
  } = useRevisionDetails(
    dietSummaryId,
    isSelected ? revision.revisionNumber : null // Pobieraj tylko gdy wybrana
  );

  const typeInfo = formatRevisionType(revision.revisionType);
  const timeInfo = formatTimestamp(revision.revisionTimestamp);

  const handleExpandClick = (e) => {
    e.stopPropagation();
    setExpanded(!expanded);
  };

  // Używamy pełnych danych jeśli są dostępne, w przeciwnym razie podstawowych
  const dietSummary = fullRevision?.dietSummary;
  const meals = dietSummary?.meals || [];
  const hasFullData = !!dietSummary;

  return (
    <Card
      onClick={onClick}
      elevation={isSelected ? 12 : 6}
      sx={{
        borderRadius: 3,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        background: isSelected 
          ? 'linear-gradient(145deg, #243441 0%, #2d4a5a 100%)'
          : 'linear-gradient(145deg, #1a2e3d 0%, #243441 100%)',
        border: isSelected 
          ? `2px solid ${typeInfo.color}`
          : '1px solid rgba(255, 255, 255, 0.1)',
        position: 'relative',
        overflow: 'visible',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 8px 24px ${alpha(typeInfo.color, 0.3)}`,
          border: `2px solid ${alpha(typeInfo.color, 0.6)}`,
        },
        '&::before': isSelected ? {
          content: '""',
          position: 'absolute',
          top: -2,
          left: -2,
          right: -2,
          bottom: -2,
          background: `linear-gradient(45deg, ${alpha(typeInfo.color, 0.3)}, transparent)`,
          borderRadius: 3,
          zIndex: -1,
          filter: 'blur(10px)',
        } : {}
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="start" mb={3}>
          <Box display="flex" alignItems="center" gap={2}>
            <Box sx={{
              fontSize: '2.5rem',
              filter: `drop-shadow(0 0 8px ${alpha(typeInfo.color, 0.6)})`,
              transition: 'all 0.3s ease',
            }}>
              {typeInfo.icon}
            </Box>
            
            <Box>
              <Typography variant="h6" fontWeight="700" color="white">
                Rewizja #{revision.revisionNumber}
              </Typography>
              <Chip 
                label={typeInfo.label}
                size="small"
                sx={{
                  mt: 0.5,
                  backgroundColor: typeInfo.bgColor,
                  color: typeInfo.color,
                  fontWeight: 600,
                  border: `1px solid ${alpha(typeInfo.color, 0.3)}`,
                  fontSize: '0.75rem'
                }}
              />
            </Box>
          </Box>

          <Box textAlign="right">
            <Typography 
              variant="body2" 
              color="rgba(255, 255, 255, 0.9)" 
              fontWeight="600"
              sx={{ mb: 0.5 }}
            >
              {timeInfo.time}
            </Typography>
            <Chip 
              label={timeInfo.relative}
              size="small"
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '0.7rem',
                height: '20px'
              }}
            />
          </Box>
        </Box>

        {/* Loading State lub Macros Summary */}
        {isSelected && isLoadingDetails ? (
          <Card elevation={0} sx={{
            background: 'rgba(0, 0, 0, 0.2)',
            borderRadius: 2,
            mb: 3,
            p: 2,
          }}>
            <Box display="flex" alignItems="center" justifyContent="center" gap={2} py={3}>
              <CircularProgress size={24} sx={{ color: '#4caf50' }} />
              <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
                Ładowanie szczegółów rewizji...
              </Typography>
            </Box>
          </Card>
        ) : isSelected && hasFullData ? (
          <>
            {/* Macros Summary - pokazuj tylko gdy mamy pełne dane */}
            <Card elevation={0} sx={{
              background: 'rgba(0, 0, 0, 0.2)',
              borderRadius: 2,
              mb: 3,
              border: '1px solid rgba(255, 255, 255, 0.05)'
            }}>
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Grid container spacing={2}>
                  <Grid xs={3}>
                    <MacroDisplay 
                      label="Kalorie" 
                      value={dietSummary.kcal} 
                      unit="kcal"
                      color="#ff9800"
                    />
                  </Grid>
                  <Grid xs={3}>
                    <MacroDisplay 
                      label="Białko" 
                      value={dietSummary.protein} 
                      unit="g"
                      color="#2196f3"
                    />
                  </Grid>
                  <Grid xs={3}>
                    <MacroDisplay 
                      label="Węgle" 
                      value={dietSummary.carbohydrates} 
                      unit="g"
                      color="#4caf50"
                    />
                  </Grid>
                  <Grid xs={3}>
                    <MacroDisplay 
                      label="Tłuszcze" 
                      value={dietSummary.fat} 
                      unit="g"
                      color="#fdd835"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Footer Info */}
            <Box 
              display="flex" 
              justifyContent="space-between" 
              alignItems="center"
              sx={{
                pb: expanded ? 2 : 0,
                borderBottom: expanded ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                transition: 'all 0.3s ease'
              }}
            >
              <Box display="flex" alignItems="center" gap={1}>
                <LocalDiningIcon sx={{ fontSize: 18, color: 'rgba(255, 255, 255, 0.6)' }} />
                <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
                  Posiłków: <strong style={{ color: 'white' }}>{meals.length}</strong>
                </Typography>
              </Box>
              
              <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
                Data diety: <strong style={{ color: 'white' }}>{dietSummary.date}</strong>
              </Typography>

              {meals.length > 0 && (
                <IconButton
                  onClick={handleExpandClick}
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    }
                  }}
                >
                  <ExpandMoreIcon />
                </IconButton>
              )}
            </Box>

            {/* Expandable Meals Preview */}
            {meals.length > 0 && (
              <Collapse in={expanded} timeout="auto" unmountOnExit>
                <Box sx={{ mt: 2, pt: 2 }}>
                  <Typography 
                    variant="caption" 
                    color="rgba(255, 255, 255, 0.6)" 
                    sx={{ 
                      mb: 2, 
                      display: 'block',
                      textTransform: 'uppercase',
                      letterSpacing: 1,
                      fontWeight: 600
                    }}
                  >
                    Lista posiłków:
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {meals.map((meal, index) => (
                      <MealCard key={meal.id || index} meal={meal} index={index} />
                    ))}
                  </Box>
                </Box>
              </Collapse>
            )}
          </>
        ) : isSelected ? (
          <Card elevation={0} sx={{
            background: 'rgba(0, 0, 0, 0.2)',
            borderRadius: 2,
            mb: 3,
            p: 2,
          }}>
            <Typography variant="body2" color="rgba(255, 255, 255, 0.6)" align="center">
              Kliknij aby zobaczyć szczegóły
            </Typography>
          </Card>
        ) : (
          <Card elevation={0} sx={{
            background: 'rgba(0, 0, 0, 0.2)',
            borderRadius: 2,
            mb: 3,
            p: 2,
          }}>
            <Typography variant="body2" color="rgba(255, 255, 255, 0.6)" align="center">
              Kliknij aby zobaczyć szczegóły
            </Typography>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};

// Helper Components
const MacroDisplay = ({ label, value, unit, color }) => (
  <Box textAlign="center">
    <Typography 
      variant="caption" 
      color="rgba(255, 255, 255, 0.6)" 
      sx={{ 
        mb: 0.5, 
        display: 'block',
        textTransform: 'uppercase',
        fontSize: '0.65rem',
        letterSpacing: 0.5
      }}
    >
      {label}
    </Typography>
    <Typography variant="h6" fontWeight="700" sx={{ color, lineHeight: 1 }}>
      {value.toFixed(1)}
    </Typography>
    <Typography 
      component="span" 
      variant="caption" 
      sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.65rem' }}
    >
      {unit}
    </Typography>
  </Box>
);

const MealCard = ({ meal, index }) => (
  <Card 
    elevation={0}
    sx={{
      background: 'rgba(255, 255, 255, 0.05)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: 2,
    }}
  >
    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
      <Box display="flex" justifyContent="space-between" alignItems="start">
        <Box flex={1}>
          <Box display="flex" alignItems="center" gap={1} mb={0.5}>
            <Chip 
              label={`#${index + 1}`}
              size="small"
              sx={{
                height: '20px',
                fontSize: '0.7rem',
                backgroundColor: 'rgba(76, 175, 80, 0.2)',
                color: '#4caf50',
                fontWeight: 700
              }}
            />
            <Typography variant="body2" color="white" fontWeight="600">
              {meal.name}
            </Typography>
          </Box>
          
          <Typography variant="caption" color="rgba(255, 255, 255, 0.6)">
            Porcja: {meal.portionMultiplier}x
          </Typography>
        </Box>

        <Box textAlign="right">
          <Typography variant="h6" fontWeight="700" sx={{ color: '#ff9800' }}>
            {meal.cachedKcal.toFixed(0)}
          </Typography>
          <Typography variant="caption" color="rgba(255, 255, 255, 0.5)">
            kcal
          </Typography>
        </Box>
      </Box>
    </CardContent>
  </Card>
);

export default RevisionCard;