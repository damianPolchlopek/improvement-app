import React, { useState } from 'react';
import {
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Chip,
  useTheme,
  CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '../../utils/REST';
import REST from '../../utils/REST';
import { useSnackbar } from '../../component/snackbar/SnackbarProvider';
import StyledTableCell from '../../component/table/StyledTableCell';
import StyledTableRow from '../../component/table/StyledTableRow';
import ErrorAlert from '../../component/error/ErrorAlert';

export default function WeeklyRecordTableRow({ record }) {
  const { showSnackbar } = useSnackbar();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const theme = useTheme();

  const {
    mutate,
    isPending: isPendingDeletion,
    isError: isErrorDeleting,
    error
  } = useMutation({
    mutationFn: (id) => REST.deleteProductFromWeeklyList(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['weekly-records']);
      showSnackbar(`Pomyślnie usunięto rekord: ${record.name}`, 'success');
    },
    onError: () => {
      showSnackbar(`Nie udało się usunąć rekordu: ${record.name}`, 'error');
    },
    retry: false,
  });

  const handleDeleteClick = () => {
    setConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    setConfirmOpen(false);
    mutate(record.id);
  };

  return (
    <>
      <StyledTableRow sx={{
        '&:hover': {
          backgroundColor: theme.palette.action.hover,
          transform: 'translateY(-1px)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        },
        transition: 'all 0.2s ease-in-out'
      }}>
        <StyledTableCell>
          <Typography variant="body2" fontWeight="600">
            {record.name}
          </Typography>
        </StyledTableCell>

        <StyledTableCell>
          <Typography variant="body2">
            {record.date}
          </Typography>
        </StyledTableCell>

        <StyledTableCell sx={{ width: "100px" }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              aria-label="edit record"
              size="small"
              sx={{
                backgroundColor: theme.palette.primary.light,
                color: theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: theme.palette.primary.main,
                  color: 'white',
                  transform: 'scale(1.1)'
                },
                transition: 'all 0.2s ease-in-out'
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton
              aria-label="delete record"
              size="small"
              onClick={handleDeleteClick}
              sx={{
                backgroundColor: theme.palette.error.light,
                color: theme.palette.error.main,
                '&:hover': {
                  backgroundColor: theme.palette.error.main,
                  color: 'white',
                  transform: 'scale(1.1)'
                },
                transition: 'all 0.2s ease-in-out'
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </StyledTableCell>
      </StyledTableRow>

      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 12px 40px rgba(0,0,0,0.2)'
          }
        }}
      >
        <DialogTitle sx={{
          background: 'linear-gradient(45deg, #f44336, #d32f2f)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <DeleteIcon />
          Czy na pewno?
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Czy na pewno chcesz usunąć ten rekord?
          </Typography>

          <Box sx={{
            p: 2,
            // backgroundColor: theme.palette.grey[50],
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider'
          }}>
            <Typography variant="body2" color="text.secondary">
              Nazwa: <strong>{record.name}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Kategoria: <strong>{record.category}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Data: <strong>{record.date}</strong>
            </Typography>
          </Box>

          {isPendingDeletion && (
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              mt: 2,
              p: 2,
              backgroundColor: theme.palette.warning.light,
              borderRadius: 2
            }}>
              <CircularProgress size={20} />
              <Typography variant="body2">
                Usuwanie...
              </Typography>
            </Box>
          )}

          {isErrorDeleting && (
            <Box sx={{ mt: 2 }}>
              <ErrorAlert error={error} />
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button
            onClick={() => setConfirmOpen(false)}
            variant="outlined"
            size="large"
            sx={{ minWidth: 100 }}
          >
            Anuluj
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            size="large"
            sx={{ minWidth: 100 }}
            disabled={isPendingDeletion}
          >
            Usuń
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}