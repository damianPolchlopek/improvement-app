// features/diet-audit/components/DietAuditPage.jsx

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDietRevisions } from '../hooks/useDietAudit';
import { useAuditFilters } from '../hooks/useAuditFilters';
import DietAuditTimeline from './DietAuditTimeline';
import AuditFilters from './AuditFilters';
import RevisionCompare from './RevisionCompare';

import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Fade,
  Chip,
  useTheme,
  IconButton,
  Tooltip
} from '@mui/material';

import {
  Timeline as TimelineIcon,
  CompareArrows as CompareIcon,
  Visibility as VisibilityIcon,
  ArrowBack as ArrowBackIcon,
  History as HistoryIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';

import Grid from '@mui/material/Unstable_Grid2';

const DietAuditPage = () => {
  const { dietSummaryId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const [selectedRevisions, setSelectedRevisions] = useState([]);
  const [viewMode, setViewMode] = useState(0); // 0: timeline, 1: compare

  const { data: revisions, isLoading, error } = useDietRevisions(dietSummaryId);
  const { filters, setFilters, filteredRevisions } = useAuditFilters(revisions);

  const handleRevisionSelect = (revision) => {
    if (viewMode === 1) { // compare mode
      if (selectedRevisions.length < 2) {
        setSelectedRevisions([...selectedRevisions, revision]);
      } else {
        // Replace the older selection
        setSelectedRevisions([selectedRevisions[1], revision]);
      }
    } else {
      setSelectedRevisions([revision]);
    }
  };

  const handleViewModeChange = (event, newValue) => {
    setViewMode(newValue);
    setSelectedRevisions([]);
  };

  if (isLoading) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        py: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <CircularProgress 
          size={60} 
          sx={{ 
            mb: 3,
            color: '#4caf50'
          }} 
        />
        <Typography variant="h6" color="white" fontWeight="600">
          Ładowanie historii zmian...
        </Typography>
        <Typography variant="body2" color="rgba(255, 255, 255, 0.7)" sx={{ mt: 1 }}>
          Pobieranie rewizji z bazy danych
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ minHeight: '100vh', py: 4 }}>
        <Container maxWidth="xl" sx={{ width: '70%' }}>
          <Alert 
            severity="error" 
            sx={{ 
              borderRadius: 3,
              fontSize: '1.1rem',
              backgroundColor: 'rgba(211, 47, 47, 0.1)',
              color: 'white',
              border: '1px solid rgba(211, 47, 47, 0.3)',
              '& .MuiAlert-icon': {
                color: '#f44336',
              }
            }}
          >
            Błąd ładowania historii zmian: {error.message}
          </Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 4, minHeight: '100vh' }}>
      <Container maxWidth="xl" sx={{ width: '70%' }}>
        
        {/* Header Section */}
        <Grid container spacing={3}>
          <Grid xs={12}>
            <Card elevation={8} sx={{ 
              borderRadius: 4,
              background: theme.palette.card.header,
              color: 'white',
              mb: 4,
              overflow: 'hidden',
              border: theme.palette.card.border,
            }}>
              <CardContent sx={{ p: 4 }}>
                {/* Back Button */}
                <Tooltip title="Powrót do listy">
                  <IconButton
                    onClick={() => navigate(-1)}
                    sx={{ 
                      mb: 2,
                      color: 'rgba(255, 255, 255, 0.8)',
                      '&:hover': {
                        color: 'white',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      }
                    }}
                  >
                    <ArrowBackIcon />
                  </IconButton>
                </Tooltip>

                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <HistoryIcon sx={{ fontSize: 40 }} />
                  <Box>
                    <Typography variant="h3" fontWeight="700" sx={{ mb: 1 }}>
                      Historia Zmian
                    </Typography>
                    <Typography variant="h6" sx={{ opacity: 0.9 }}>
                      Przeglądaj wszystkie rewizje podsumowania diety
                    </Typography>
                  </Box>
                </Box>

                <Box display="flex" gap={2} sx={{ mt: 3 }} flexWrap="wrap">
                  <Chip 
                    label={`ID: ${dietSummaryId}`}
                    sx={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '0.9rem'
                    }}
                  />
                  <Chip 
                    label={`Rewizji: ${revisions?.length || 0}`}
                    icon={<HistoryIcon sx={{ color: 'white !important' }} />}
                    sx={{ 
                      backgroundColor: 'rgba(76, 175, 80, 0.3)',
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '0.9rem'
                    }}
                  />
                  <Chip 
                    label={`Wyświetlono: ${filteredRevisions?.length || 0}`}
                    sx={{ 
                      backgroundColor: 'rgba(33, 150, 243, 0.3)',
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '0.9rem'
                    }}
                  />
                  <Chip 
                    icon={<AssessmentIcon sx={{ color: 'white !important' }} />}
                    label={
                      viewMode === 0 ? "Oś czasu" : 
                      viewMode === 1 ? "Porównanie" : 
                      "Podgląd"
                    }
                    sx={{ 
                      backgroundColor: 'rgba(255, 152, 0, 0.3)',
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '0.9rem'
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Tabs Navigation */}
          <Grid xs={12}>
            <Card elevation={6} sx={{
              borderRadius: 3,
              background: 'linear-gradient(145deg, #1a2e3d 0%, #243441 100%)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              overflow: 'hidden'
            }}>
              <Tabs 
                value={viewMode} 
                onChange={handleViewModeChange}
                variant="fullWidth"
                sx={{
                  '& .MuiTabs-indicator': {
                    backgroundColor: '#4caf50',
                    height: 3,
                  },
                  '& .MuiTab-root': {
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontWeight: 600,
                    fontSize: '1rem',
                    py: 2.5,
                    transition: 'all 0.3s ease',
                    '&.Mui-selected': {
                      color: '#4caf50',
                      backgroundColor: 'rgba(76, 175, 80, 0.05)',
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    }
                  },
                }}
              >
                <Tab 
                  icon={<TimelineIcon />} 
                  iconPosition="start" 
                  label="Oś czasu" 
                />
                <Tab 
                  icon={<CompareIcon />} 
                  iconPosition="start" 
                  label="Porównaj wersje" 
                />
              </Tabs>
            </Card>
          </Grid>

          {/* Filters */}
          <Grid xs={12}>
            <AuditFilters filters={filters} setFilters={setFilters} />
          </Grid>

          {/* Content based on view mode */}
          <Grid xs={12}>
            <Fade in={true} timeout={500}>
              <Box>
                {viewMode === 0 && (
                  <DietAuditTimeline
                    revisions={filteredRevisions}
                    onRevisionSelect={handleRevisionSelect}
                    selectedRevision={selectedRevisions[0]}
                  />
                )}

                {viewMode === 1 && (
                  <RevisionCompare
                    dietSummaryId={dietSummaryId}
                    selectedRevisions={selectedRevisions}
                    onRevisionSelect={handleRevisionSelect}
                    availableRevisions={filteredRevisions}
                  />
                )}

              </Box>
            </Fade>
          </Grid>
        </Grid>

      </Container>
    </Box>
  );
};

export default DietAuditPage;