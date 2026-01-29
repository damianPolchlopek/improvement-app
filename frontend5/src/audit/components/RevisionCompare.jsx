// features/diet-audit/components/RevisionCompare.jsx

import React from 'react';
import { useRevisionComparison } from '../hooks/useDietAudit';
import { useParams } from 'react-router-dom';
import { formatMacroChange, getMacroChangeColor } from '../utils/auditFormatters';
import MealChangesList from './MealChangesList';

import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  CircularProgress,
  Alert,
  useTheme,
  alpha,
  Divider
} from '@mui/material';

import {
  CompareArrows as CompareArrowsIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Remove as RemoveIcon,
  Check as CheckIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';

import Grid from '@mui/material/Unstable_Grid2';

const RevisionCompare = ({ 
  dietSummaryId, 
  selectedRevisions, 
  onRevisionSelect,
  availableRevisions 
}) => {
  const theme = useTheme();
  const { dietSummaryId: paramDietSummaryId } = useParams();
  const actualDietSummaryId = dietSummaryId || paramDietSummaryId;

  const needsSelection = selectedRevisions.length < 2;

  const olderRevisionNumber = selectedRevisions[0]?.revisionNumber;
  const newerRevisionNumber = selectedRevisions[1]?.revisionNumber;

  const { data: comparisonData, isLoading, isError } = useRevisionComparison(
    actualDietSummaryId,
    olderRevisionNumber,
    newerRevisionNumber
  );

  if (needsSelection) {
    return (
      <Card elevation={6} sx={{
        borderRadius: 3,
        background: 'linear-gradient(145deg, #1a2e3d 0%, #243441 100%)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }}>
        <CardContent sx={{ p: 4 }}>
          <Box textAlign="center" mb={4}>
            <CompareArrowsIcon sx={{ fontSize: 64, color: 'rgba(255, 255, 255, 0.3)', mb: 2 }} />
            <Typography variant="h5" fontWeight="600" color="white" mb={1}>
              Wybierz dwie wersje do porównania
            </Typography>
            <Typography variant="body1" color="rgba(255, 255, 255, 0.7)">
              Wybrano: {selectedRevisions.length}/2 wersji
            </Typography>
            
            {selectedRevisions.length === 1 && (
              <Alert 
                severity="info" 
                sx={{ 
                  mt: 3,
                  backgroundColor: 'rgba(33, 150, 243, 0.1)',
                  color: 'white',
                  border: '1px solid rgba(33, 150, 243, 0.3)',
                  '& .MuiAlert-icon': {
                    color: '#2196f3',
                  }
                }}
              >
                Wybierz drugą wersję do porównania
              </Alert>
            )}
          </Box>
          
          {/* Lista dostępnych rewizji */}
          <Grid container spacing={2}>
            {availableRevisions.map(revision => {
              const isSelected = selectedRevisions.some(
                r => r.revisionNumber === revision.revisionNumber
              );
              const selectionOrder = selectedRevisions.findIndex(
                r => r.revisionNumber === revision.revisionNumber
              );

              return (
                <Grid xs={12} sm={6} md={4} key={revision.revisionNumber}>
                  <Card
                    onClick={() => onRevisionSelect(revision)}
                    elevation={isSelected ? 8 : 2}
                    sx={{
                      cursor: 'pointer',
                      borderRadius: 2,
                      transition: 'all 0.3s ease',
                      background: isSelected 
                        ? 'linear-gradient(145deg, #243441 0%, #2d4a5a 100%)'
                        : 'rgba(255, 255, 255, 0.05)',
                      border: isSelected 
                        ? '2px solid #4caf50' 
                        : '1px solid rgba(255, 255, 255, 0.1)',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 24px rgba(76, 175, 80, 0.3)',
                        border: '2px solid rgba(76, 175, 80, 0.5)',
                      }
                    }}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Box display="flex" justifyContent="space-between" alignItems="start" mb={1}>
                        <Typography variant="h6" fontWeight="700" color="white">
                          #{revision.revisionNumber}
                        </Typography>
                        {isSelected && (
                          <Chip
                            label={selectionOrder === 0 ? 'Starsza' : 'Nowsza'}
                            size="small"
                            icon={<CheckIcon />}
                            sx={{
                              backgroundColor: 'rgba(76, 175, 80, 0.3)',
                              color: '#4caf50',
                              fontWeight: 600,
                            }}
                          />
                        )}
                      </Box>
                      <Typography variant="caption" color="rgba(255, 255, 255, 0.7)">
                        {new Date(revision.revisionTimestamp).toLocaleString('pl-PL')}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </CardContent>
      </Card>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <Card elevation={6} sx={{
        borderRadius: 3,
        background: 'linear-gradient(145deg, #1a2e3d 0%, #243441 100%)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        p: 8,
        textAlign: 'center'
      }}>
        <CircularProgress size={60} sx={{ mb: 3, color: '#4caf50' }} />
        <Typography variant="h6" color="white" fontWeight="600">
          Ładowanie danych do porównania...
        </Typography>
      </Card>
    );
  }

  // Error state
  if (isError || !comparisonData) {
    return (
      <Alert severity="error">
        Nie udało się załadować porównania rewizji
      </Alert>
    );
  }

  const { olderRevision, newerRevision, macroChanges, mealsAdded, mealsRemoved, mealsModified } = comparisonData;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      
      {/* Header z wybranymi wersjami */}
      <Card elevation={8} sx={{
        borderRadius: 4,
        background: theme.palette.card.header,
        border: theme.palette.card.border,
        overflow: 'hidden'
      }}>
        <CardContent sx={{ p: 4 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
            <Box display="flex" alignItems="center" gap={2}>
              <CompareArrowsIcon sx={{ fontSize: 32, color: 'white' }} />
              <Typography variant="h4" fontWeight="700" color="white">
                Porównanie wersji
              </Typography>
            </Box>
            
            <Button
              variant="outlined"
              onClick={() => onRevisionSelect(null)}
              sx={{
                borderColor: 'rgba(255, 255, 255, 0.3)',
                color: 'white',
                '&:hover': {
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                }
              }}
            >
              Wybierz inne wersje
            </Button>
          </Box>

          <Grid container spacing={3}>
            <Grid xs={12} md={5}>
              <VersionInfo 
                title="Wersja starsza"
                revision={olderRevision}
                color="rgba(255, 152, 0, 0.3)"
                borderColor="rgba(255, 152, 0, 0.5)"
              />
            </Grid>
            
            <Grid xs={12} md={2} display="flex" alignItems="center" justifyContent="center">
              <ArrowForwardIcon sx={{ fontSize: 40, color: '#4caf50' }} />
            </Grid>
            
            <Grid xs={12} md={5}>
              <VersionInfo 
                title="Wersja nowsza"
                revision={newerRevision}
                color="rgba(76, 175, 80, 0.3)"
                borderColor="rgba(76, 175, 80, 0.5)"
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Zmiany w makroskładnikach */}
      <Card elevation={6} sx={{
        borderRadius: 3,
        background: 'linear-gradient(145deg, #1a2e3d 0%, #243441 100%)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }}>
        <Box sx={{
          p: 2,
          background: theme.palette.card.header,
          borderBottom: theme.palette.card.border,
        }}>
          <Typography variant="h6" fontWeight="600" color="white">
            Zmiany w makroskładnikach
          </Typography>
        </Box>
        
        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid xs={12} sm={6} md={3}>
              <MacroChange 
                label="Kalorie"
                changeDetail={macroChanges.kcal}
                unit="kcal"
                color="#ff9800"
              />
            </Grid>
            <Grid xs={12} sm={6} md={3}>
              <MacroChange 
                label="Białko"
                changeDetail={macroChanges.protein}
                unit="g"
                color="#2196f3"
              />
            </Grid>
            <Grid xs={12} sm={6} md={3}>
              <MacroChange 
                label="Węglowodany"
                changeDetail={macroChanges.carbohydrates}
                unit="g"
                color="#4caf50"
              />
            </Grid>
            <Grid xs={12} sm={6} md={3}>
              <MacroChange 
                label="Tłuszcze"
                changeDetail={macroChanges.fat}
                unit="g"
                color="#fdd835"
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Zmiany w posiłkach */}
        <MealChangesList 
        changes={{
            mealsAdded,
            mealsRemoved,
            mealsModified
        }}
        />
    </Box>
  );
};

// Helper Components
const VersionInfo = ({ title, revision, color, borderColor }) => (
  <Card 
    elevation={4}
    sx={{
      borderRadius: 2,
      background: color,
      border: `2px solid ${borderColor}`,
      height: '100%'
    }}
  >
    <CardContent sx={{ p: 3 }}>
      <Typography variant="h6" fontWeight="600" color="white" mb={2}>
        {title}
      </Typography>
      
      <Box display="flex" flexDirection="column" gap={1}>
        <Box display="flex" justifyContent="space-between">
          <Typography variant="body2" color="rgba(255, 255, 255, 0.8)">
            Rewizja:
          </Typography>
          <Typography variant="body2" fontWeight="600" color="white">
            #{revision.revisionNumber}
          </Typography>
        </Box>
        
        <Box display="flex" justifyContent="space-between">
          <Typography variant="body2" color="rgba(255, 255, 255, 0.8)">
            Data:
          </Typography>
          <Typography variant="body2" fontWeight="600" color="white">
            {new Date(revision.revisionTimestamp).toLocaleDateString('pl-PL')}
          </Typography>
        </Box>
        
        <Box display="flex" justifyContent="space-between">
          <Typography variant="body2" color="rgba(255, 255, 255, 0.8)">
            Godzina:
          </Typography>
          <Typography variant="body2" fontWeight="600" color="white">
            {new Date(revision.revisionTimestamp).toLocaleTimeString('pl-PL')}
          </Typography>
        </Box>

        <Divider sx={{ my: 1, borderColor: 'rgba(255, 255, 255, 0.2)' }} />
        
        <Box display="flex" justifyContent="space-between">
          <Typography variant="body2" color="rgba(255, 255, 255, 0.8)">
            Kalorie:
          </Typography>
          <Typography variant="body2" fontWeight="600" color="white">
            {revision.dietSummary.kcal.toFixed(1)} kcal
          </Typography>
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const MacroChange = ({ label, changeDetail, unit, color }) => {
  const { oldValue, newValue, diff, percentChange } = changeDetail;
  const changeColor = getMacroChangeColor(diff);
  const hasChange = Math.abs(diff) > 0.1;

  const getChangeIcon = () => {
    if (diff > 0) return <TrendingUpIcon sx={{ fontSize: 16 }} />;
    if (diff < 0) return <TrendingDownIcon sx={{ fontSize: 16 }} />;
    return <RemoveIcon sx={{ fontSize: 16 }} />;
  };

  return (
    <Card elevation={2} sx={{
      borderRadius: 2,
      background: 'rgba(0, 0, 0, 0.2)',
      border: `1px solid ${alpha(color, 0.3)}`,
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: `0 4px 12px ${alpha(color, 0.3)}`,
      }
    }}>
      <CardContent sx={{ p: 2 }}>
        <Typography 
          variant="caption" 
          color="rgba(255, 255, 255, 0.7)"
          sx={{ 
            mb: 1.5,
            display: 'block',
            textTransform: 'uppercase',
            letterSpacing: 1,
            fontWeight: 600
          }}
        >
          {label}
        </Typography>
        
        {/* Stara wartość */}
        <Box display="flex" alignItems="baseline" gap={1} mb={1}>
          <Typography 
            variant="h6" 
            sx={{ 
              textDecoration: 'line-through',
              color: 'rgba(255, 255, 255, 0.4)',
              fontWeight: 500
            }}
          >
            {oldValue.toFixed(1)}
          </Typography>
          <Typography variant="caption" color="rgba(255, 255, 255, 0.4)">
            {unit}
          </Typography>
        </Box>
        
        {/* Nowa wartość */}
        <Box display="flex" alignItems="baseline" gap={1} mb={2}>
          <Typography variant="h5" fontWeight="700" sx={{ color }}>
            {newValue.toFixed(1)}
          </Typography>
          <Typography variant="caption" color="rgba(255, 255, 255, 0.6)">
            {unit}
          </Typography>
        </Box>
        
        {/* Zmiana */}
        {hasChange && (
          <Box 
            display="flex" 
            alignItems="center" 
            justifyContent="space-between"
            sx={{
              pt: 1.5,
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <Chip
              icon={getChangeIcon()}
              label={formatMacroChange(diff)}
              size="small"
              sx={{
                backgroundColor: alpha(changeColor, 0.2),
                color: changeColor,
                fontWeight: 700,
                border: `1px solid ${alpha(changeColor, 0.3)}`,
                '& .MuiChip-icon': {
                  color: changeColor,
                }
              }}
            />
            <Typography 
              variant="caption" 
              fontWeight="600"
              sx={{ color: changeColor }}
            >
              {percentChange.toFixed(1)}%
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default RevisionCompare;