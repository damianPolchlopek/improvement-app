import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  CircularProgress,
  Typography,
  useTheme,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { queryClient } from '../../utils/REST';
import REST from '../../utils/REST';
import { useSnackbar } from '../../component/snackbar/SnackbarProvider';
import ErrorAlert from '../../component/error/ErrorAlert';
import moment from 'moment';

function formatDate(timestamp) {
  return moment(timestamp).format('DD-MM-YYYY');
}

export default function AddWeeklyRecordDialog({ open, onClose, categories }) {
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();
  const theme = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    category: categories[0] || 'Waga',
    date: formatDate(moment().valueOf()),
  });

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: (data) => REST.addRecordToWeeklyList(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['weekly-records']);
      showSnackbar(t('weekly.addSuccess'), 'success');
      handleClose();
    },
    onError: () => {
      showSnackbar(t('weekly.addError'), 'error');
    },
    retry: false,
  });

  const handleClose = () => {
    setFormData({
      name: '',
      category: categories[0] || 'Waga',
      date: formatDate(moment().valueOf()),
    });
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showSnackbar(t('weekly.nameRequired'), 'warning');
      return;
    }
    mutate(formData);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
        },
      }}
    >
      <DialogTitle
        sx={{
          background: `linear-gradient(45deg, ${theme.palette.info.main}, ${theme.palette.info.dark})`,
          color: 'text.primary',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <AddIcon />
        {t('weekly.addRecord')}
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label={t('weekly.recordName')}
              placeholder={t('weekly.enterName')}
              variant="outlined"
              fullWidth
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
              autoFocus
            />

            <FormControl fullWidth>
              <InputLabel>{t('weekly.category')}</InputLabel>
              <Select
                value={formData.category}
                label={t('weekly.category')}
                onChange={(e) => handleChange('category', e.target.value)}
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label={t('weekly.date')}
              variant="outlined"
              fullWidth
              value={formData.date}
              disabled
              helperText={t('weekly.dateAutoHelper')}
            />

            {isPending && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  p: 2,
                  backgroundColor: 'info.light',
                  borderRadius: 2,
                }}
              >
                <CircularProgress size={20} />
                <Typography variant="body2">{t('weekly.addingRecord')}</Typography>
              </Box>
            )}

            {isError && <ErrorAlert error={error} />}
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button onClick={handleClose} variant="outlined" size="large" disabled={isPending}>
            {t('common.cancel')}
          </Button>
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={isPending}
            sx={{ minWidth: 120 }}
          >
            {t('weekly.add')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
