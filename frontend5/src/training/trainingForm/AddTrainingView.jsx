import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Alert, Box, Skeleton, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { AddCircleOutlined } from '@mui/icons-material';

import REST from '../../utils/REST';
import TrainingForm from './TrainingForm';
import FoodPageHeader from '../../food/component/FoodPageHeader';
import { surfaceSx } from '../../food/component/foodStyles';
import TrainingTypeChips from '../component/TrainingTypeChips';

export default function AddTrainingView() {
  const [isSimpleForm, setIsSimpleForm] = useState(true);
  const [trainingType, setTrainingType] = useState('F3A');
  const { t } = useTranslation();

  // Szablon ładuje się automatycznie przy wejściu i po każdej zmianie typu
  // (queryKey zawiera trainingType, więc React Query sam pobiera dane na nowo).
  const {
    data: exercises,
    isLoading,
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
    <Box sx={{ py: 3, px: 2, maxWidth: 1100, mx: 'auto' }}>
      <FoodPageHeader
        icon={<AddCircleOutlined />}
        title={t('training.addTraining')}
        description={t('training.addTrainingDesc')}
        statLabel={t('training.templateExercises')}
        statValue={loadedCount}
        statLoading={isFetching}
        actions={
          <ToggleButtonGroup
            exclusive
            size="small"
            value={isSimpleForm ? 'simple' : 'advanced'}
            onChange={(event, value) => value && setIsSimpleForm(value === 'simple')}
            aria-label={t('training.formMode')}
            sx={{ '& .MuiToggleButton-root': { px: 1.75, textTransform: 'none' } }}
          >
            <ToggleButton value="simple">{t('training.simpleMode')}</ToggleButton>
            <ToggleButton value="advanced">{t('training.advancedMode')}</ToggleButton>
          </ToggleButtonGroup>
        }
      >
        <TrainingTypeChips value={trainingType} onChange={setTrainingType} />
      </FoodPageHeader>

      {isError && (
        <Alert severity="error" sx={{ borderRadius: 2, mb: 3 }}>
          {t('training.errorLoading')}: {error.message}
        </Alert>
      )}

      {/* overflow: visible – inaczej przyklejony pasek zapisu nie trzymałby się dołu ekranu */}
      <Box sx={{ ...surfaceSx, overflow: 'visible', p: { xs: 1.5, md: 2.5 } }}>
        {isLoading ? (
          Array.from({ length: 5 }).map((_, index) => <Skeleton key={index} height={52} />)
        ) : (
          <TrainingForm isSimpleForm={isSimpleForm} exercises={exercises?.content || []} />
        )}
      </Box>
    </Box>
  );
}
