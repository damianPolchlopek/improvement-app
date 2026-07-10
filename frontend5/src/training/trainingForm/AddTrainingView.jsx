import React, { useState } from 'react';
import REST from '../../utils/REST';
import TrainingForm from './TrainingForm';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';

import {
  FormControlLabel,
  Switch,
  Typography,
  Paper,
  Box,
  Alert,
  CircularProgress,
  Fade,
  Chip,
  useTheme,
} from '@mui/material';

import TrainingTypeSelector from '../component/TrainingTypeSelector';
import { CheckCircle, FitnessCenter } from '@mui/icons-material';

export default function AddTrainingView() {
  const [isSimpleForm, setIsSimpleForm] = useState(true);
  const [trainingType, setTrainingType] = useState('F'); // domyślnie 5x5
  const { t } = useTranslation();
  const theme = useTheme();

  // Szablon ładuje się automatycznie przy wejściu i po każdej zmianie typu
  // (queryKey zawiera trainingType, więc React Query sam pobiera dane na nowo).
  const {
    data: exercises,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ['training-template', trainingType],
    queryFn: () => REST.getTrainingTemplateByType(trainingType),
    enabled: !!trainingType,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  const loadedCount = exercises?.content?.length ?? 0;

  return (
    <Box sx={{ py: 3 }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: 2 }}>
        {/* Kompaktowy pasek: wybór typu (auto-load) + przełącznik trybu */}
        <Paper
          elevation={3}
          sx={{
            p: 2,
            mb: 3,
            borderRadius: 3,
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <FitnessCenter color="primary" />
            <TrainingTypeSelector
              value={trainingType}
              setTrainingType={setTrainingType}
              size="small"
              label={t('training.type')}
            />
            {isFetching ? (
              <CircularProgress size={22} />
            ) : (
              loadedCount > 0 && (
                <Fade in>
                  <Chip
                    size="small"
                    color="success"
                    icon={<CheckCircle />}
                    label={t('training.templateLoaded', { count: loadedCount })}
                  />
                </Fade>
              )
            )}
          </Box>

          <FormControlLabel
            control={
              <Switch
                checked={!isSimpleForm}
                onChange={() => setIsSimpleForm(!isSimpleForm)}
                color="warning"
              />
            }
            label={isSimpleForm ? t('training.simpleMode') : t('training.advancedMode')}
          />
        </Paper>

        {/* Błąd ładowania szablonu */}
        {isError && (
          <Fade in>
            <Alert severity="error" sx={{ borderRadius: 2, mb: 3 }}>
              <Typography fontWeight="500">
                {t('training.errorLoading')}: {error.message}
              </Typography>
            </Alert>
          </Fade>
        )}

        {/* Formularz treningu */}
        <Paper elevation={2} sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <Box
            sx={{
              p: 2,
              background: theme.palette.card.header,
              color: 'text.primary',
            }}
          >
            <Typography variant="subtitle1" fontWeight="600">
              {t('training.formTitle')}
            </Typography>
          </Box>
          <Box sx={{ p: { xs: 2, md: 4 } }}>
            <TrainingForm isSimpleForm={isSimpleForm} exercises={exercises?.content || []} />
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
