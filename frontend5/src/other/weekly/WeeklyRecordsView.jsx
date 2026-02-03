import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import REST from '../../utils/REST';
import { useTranslation } from 'react-i18next';

import {
  Box,
  Card,
  CardContent,
  Typography,
  useTheme,
  Fab,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { Add as AddIcon, ListAlt } from '@mui/icons-material';

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

  const categories = categoriesData?.entity || [];

  // Ustaw domyślną kategorię gdy się załadują
  React.useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0]);
    }
  }, [categories, selectedCategory]);

  const { data: records, isLoading: recordsLoading, isError, error } = useQuery({
    queryKey: ['weekly-records', selectedCategory],
    queryFn: () => REST.getWeeklyListByCategory(selectedCategory),
    enabled: !!selectedCategory,
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
        <Grid xs={12}>
          <Card elevation={6} sx={{
            borderRadius: 3,
            background: theme.palette.card.header,
            color: 'white',
            mb: 2
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <ListAlt sx={{ fontSize: 32 }} />
                <Typography variant="h4" fontWeight="600">
                  Tygodniowe Zapisy
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Zarządzaj swoimi tygodniowymi rekordami
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Category Filter */}
        <Grid xs={12}>
          <Card elevation={4} sx={{ borderRadius: 3, p: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Wybierz kategorię</InputLabel>
              <Select
                value={selectedCategory}
                label="Wybierz kategorię"
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Card>
        </Grid>

        {/* Statistics Cards */}
        <Grid xs={12} md={6}>
          <Card elevation={6} sx={{
            height: '100%',
            borderRadius: 3,
            transition: 'transform 0.2s ease-in-out',
            '&:hover': {
              boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
            }
          }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="600" mb={2}>
                Rekordy w kategorii
              </Typography>
              <Typography variant="h3" fontWeight="700" color="primary">
                {recordsLoading ? '...' : recordsList.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} md={6}>
          <Card elevation={6} sx={{
            height: '100%',
            borderRadius: 3,
            background: 'linear-gradient(45deg, #2196f3, #1976d2)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 3
          }}>
            <Box textAlign="center">
              <Typography variant="h3" fontWeight="700">
                {categories.length}
              </Typography>
              <Typography variant="body1">
                Dostępnych kategorii
              </Typography>
            </Box>
          </Card>
        </Grid>

        {/* Table Section */}
        <Grid xs={12}>
          {recordsLoading ? (
            <PageLoader text="Ładowanie rekordów..." />
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
          height: 64
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