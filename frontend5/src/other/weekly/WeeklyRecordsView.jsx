import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import REST from '../../utils/REST';
import { useTranslation } from 'react-i18next';

import {
  Box,
  Card,
  CardContent,
  Toolbar,
  Typography,
  useTheme,
  Fab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { Add as AddIcon, Category, ListAlt } from '@mui/icons-material';

import PageLoader from '../../component/loader/PageLoader';
import ErrorAlert from '../../component/error/ErrorAlert';
import AddWeeklyRecordDialog from './AddWeeklyRecordDialog';
import WeeklyRecordsTable from './WeeklyRecordsTable';

export default function WeeklyRecordsView() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const { t } = useTranslation();
  const theme = useTheme();

  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ['weekly-record-categories'],
    queryFn: () => REST.getAllCategoryWeeklyRecords(),
  });

  const categories = useMemo(() => categoriesData?.entity || [], [categoriesData]);

  // Domyślna kategoria jako wartość pochodna (bez efektu / setState)
  const effectiveCategory = selectedCategory || categories[0] || '';

  const {
    data: records,
    isLoading: recordsLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['weekly-records', effectiveCategory],
    queryFn: () => REST.getWeeklyListByCategory(effectiveCategory),
    enabled: !!effectiveCategory,
    staleTime: 1000 * 60 * 5,
  });

  const recordsList = records?.entity || [];

  if (categoriesLoading) {
    return <PageLoader text={t('messages.loading')} />;
  }

  if (isError) {
    return <ErrorAlert error={error} />;
  }

  return (
    <Box sx={{ py: 4 }}>
      <Grid container spacing={3} sx={{ maxWidth: 1400, mx: 'auto', px: 2 }}>
        {/* Header Section */}
        <Grid size={12}>
          <Card
            elevation={2}
            sx={{
              borderRadius: 3,
              background: theme.palette.card.header,
              color: 'white',
              mb: 2,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <ListAlt sx={{ fontSize: 32 }} />
                <Typography variant="h4" fontWeight="600">
                  {t('weekly.title')}
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                {t('weekly.subtitle')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Filters + stats */}
        <Grid size={12}>
          <Card elevation={2} sx={{ borderRadius: 3 }}>
            <Toolbar
              sx={{
                flexWrap: 'wrap',
                alignItems: 'center',
                columnGap: 3,
                rowGap: 1.5,
                py: 1.5,
                minHeight: 'auto',
              }}
            >
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel>{t('weekly.selectCategory')}</InputLabel>
                <Select
                  value={effectiveCategory}
                  label={t('weekly.selectCategory')}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Box display="flex" alignItems="center" gap={1}>
                <ListAlt fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {t('weekly.recordsInCategory')}
                </Typography>
                <Typography variant="subtitle1" fontWeight="600">
                  {recordsLoading ? '...' : recordsList.length}
                </Typography>
              </Box>

              <Box display="flex" alignItems="center" gap={1}>
                <Category fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {t('weekly.availableCategories')}
                </Typography>
                <Typography variant="subtitle1" fontWeight="600">
                  {categories.length}
                </Typography>
              </Box>
            </Toolbar>
          </Card>
        </Grid>

        {/* Table Section */}
        <Grid size={12}>
          {recordsLoading ? (
            <PageLoader text={t('weekly.loadingRecords')} />
          ) : (
            <WeeklyRecordsTable records={recordsList} />
          )}
        </Grid>
      </Grid>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add"
        onClick={() => setDialogOpen(true)}
        sx={{
          position: 'fixed',
          bottom: 32,
          right: 32,
          width: 64,
          height: 64,
        }}
      >
        <AddIcon sx={{ fontSize: 32 }} />
      </Fab>

      {/* Add Dialog */}
      <AddWeeklyRecordDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        categories={categories}
      />
    </Box>
  );
}
