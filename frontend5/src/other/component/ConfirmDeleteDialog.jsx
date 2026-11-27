import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import { DeleteOutlined } from '@mui/icons-material';

import { SURFACE_BG, HAIRLINE } from '../../food/component/foodStyles';

// Potwierdzenie trwałego usunięcia (jak w module food): tytuł, opis i podsumowanie usuwanego wpisu.
export default function ConfirmDeleteDialog({
  open,
  title,
  text,
  details,
  pending = false,
  onCancel,
  onConfirm,
}) {
  const { t } = useTranslation();

  return (
    <Dialog
      open={open}
      onClose={() => !pending && onCancel()}
      maxWidth="xs"
      fullWidth
      slotProps={{
        paper: {
          sx: { borderRadius: 3, bgcolor: '#17252f', backgroundImage: 'none', border: HAIRLINE },
        },
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 500 }}>
        <DeleteOutlined sx={{ color: 'error.main' }} />
        {title}
      </DialogTitle>

      <DialogContent>
        <Typography variant="body2" sx={{ mb: details ? 2 : 0, color: 'text.secondary' }}>
          {text}
        </Typography>
        {details && (
          <Box sx={{ p: 1.5, bgcolor: SURFACE_BG, borderRadius: 2, border: HAIRLINE }}>
            {details}
          </Box>
        )}
        {pending && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 2 }}>
            <CircularProgress size={18} />
            <Typography variant="body2">{t('common.deleting')}</Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
        <Button onClick={onCancel} variant="outlined" disabled={pending}>
          {t('common.cancel')}
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained" disabled={pending}>
          {t('common.delete')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
