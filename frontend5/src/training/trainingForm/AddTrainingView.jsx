import React, { useState } from "react";
import REST from '../../utils/REST';
import TrainingForm from "./TrainingForm";
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';

import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Typography,
  Paper,
  Box,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Fade,
  Chip
} from "@mui/material";

import Grid from '@mui/material/Unstable_Grid2';
import TrainingTypeSelector from "../component/TrainingTypeSelector";
import { 
  Settings, 
  PlayArrow, 
  CheckCircle 
} from '@mui/icons-material';

export default function AddTrainingView() {
  const [isSimpleForm, setIsSimpleForm] = useState(true);
  const [trainingType, setTrainingType] = useState('A');
  const { t } = useTranslation();

  const {
    data: exercises,
    isFetching,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['training-template', trainingType],
    queryFn: () => REST.getTrainingTemplateByType(trainingType),
    enabled: false,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
  });

  const handleLoadTraining = () => {
    if (trainingType) {
      refetch();
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      py: 4
    }}>
      <Grid container spacing={3} sx={{ maxWidth: 1200, mx: 'auto', px: 2 }}>

        {/* Training Template Loader */}
        <Grid xs={12} md={6}>
          <Card elevation={6} sx={{ 
            height: '100%',
            minHeight: 400, // Dodana minimalna wysokość
            borderRadius: 3,
            transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
            '&:hover': {
              boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
            },
            display: 'flex',
            flexDirection: 'column'
          }}>
            <CardContent sx={{ 
              p: 3,
              display: 'flex',
              flexDirection: 'column',
//               height: '100%'
            }}>
              <Box display="flex" alignItems="center" gap={2} mb={3}>
                <PlayArrow sx={{ color: '#4caf50', fontSize: 28 }} />
                <Typography variant="h5" fontWeight="600">
                  {t('messages.loadLastTraining') || 'Załaduj Szablon'}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 3, flex: 1 }}>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  Wybierz typ treningu:
                </Typography>
                <FormControl fullWidth>
                  <TrainingTypeSelector setTrainingType={setTrainingType} />
                </FormControl>
              </Box>

              <Box sx={{ mt: 'auto' }}>
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={handleLoadTraining}
                  disabled={!trainingType || isFetching}
                  startIcon={isFetching ? <CircularProgress size={20} color="inherit" /> : <PlayArrow />}
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    background: 'linear-gradient(45deg, #4caf50, #45a049)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #45a049, #3e8e41)',
                    },
                    '&:disabled': {
                      background: 'rgba(0,0,0,0.12)'
                    }
                  }}
                >
                  {isFetching ? 
                    (t('messages.loading') || 'Ładowanie...') : 
                    (t('messages.loadLastTraining') || 'Załaduj Szablon')
                  }
                </Button>

                {exercises?.content && exercises.content.length > 0 && (
                  <Fade in={true}>
                    <Alert 
                      severity="success" 
                      sx={{ mt: 2, borderRadius: 2 }}
                      icon={<CheckCircle />}
                    >
                      Szablon załadowany! Znaleziono {exercises.content.length} ćwiczeń.
                    </Alert>
                  </Fade>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Settings Panel */}
        <Grid xs={12} md={6}>
          <Card elevation={6} sx={{ 
            height: '100%',
            minHeight: 400, // Dodana minimalna wysokość
            borderRadius: 3,
            transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
            '&:hover': {
              boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
            },
            display: 'flex',
            flexDirection: 'column'
          }}>
            <CardContent sx={{ 
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              height: '100%'
            }}>
              <Box display="flex" alignItems="center" gap={2} mb={3}>
                <Settings sx={{ color: '#ff9800', fontSize: 28 }} />
                <Typography variant="h5" fontWeight="600">
                  Ustawienia Formularza
                </Typography>
              </Box>
              
              <Box sx={{ 
                p: 3, 
                bgcolor: 'rgba(255, 152, 0, 0.05)', 
                borderRadius: 2,
                border: '1px solid rgba(255, 152, 0, 0.2)',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                <FormControlLabel
                  control={
                    <Checkbox 
                      checked={!isSimpleForm}
                      onChange={() => setIsSimpleForm(!isSimpleForm)}
                      sx={{
                        '&.Mui-checked': {
                          color: '#ff9800',
                        },
                      }}
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body1" fontWeight="500">
                        {t('messages.enableMoreAccurateForm') || 'Formularz Zaawansowany'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Więcej opcji i szczegółowych ustawień
                      </Typography>
                    </Box>
                  }
                />
              </Box>

              <Box sx={{ mt: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip 
                  label={isSimpleForm ? "Tryb Prosty" : "Tryb Zaawansowany"} 
                  color={isSimpleForm ? "default" : "warning"}
                  variant={isSimpleForm ? "outlined" : "filled"}
                />
                <Chip 
                  label={`Typ: ${trainingType}`} 
                  color="primary"
                  variant="outlined"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Error Display */}
        {isError && (
          <Grid xs={12}>
            <Fade in={true}>
              <Alert 
                severity="error" 
                sx={{ borderRadius: 2 }}
                onClose={() => {}}
              >
                <Typography fontWeight="500">
                  {t('messages.errorLoadingTraining') || 'Błąd podczas ładowania'}: {error.message}
                </Typography>
              </Alert>
            </Fade>
          </Grid>
        )}

        {/* Training Form */}
        <Grid xs={12}>
          <Paper elevation={8} sx={{ 
            borderRadius: 4,
            overflow: 'hidden',
            background: 'color.secondary',
            backdropFilter: 'blur(40px)'
          }}>
            <Box sx={{ 
              p: 2, 
              background: 'linear-gradient(90deg, #667eea, #764ba2)',
              color: 'white'
            }}>
              <Typography variant="h5" fontWeight="600">
                Formularz Treningu
              </Typography>
            </Box>
            <Box sx={{ p: 4 }}>
              <TrainingForm
                isSimpleForm={isSimpleForm}
                exercises={exercises?.content || []}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}