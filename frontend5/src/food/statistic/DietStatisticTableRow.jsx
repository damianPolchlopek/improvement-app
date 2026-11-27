import { useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  DeleteOutlined,
  EditOutlined,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import REST, { queryClient } from '../../utils/REST';
import { useSnackbar } from '../../component/snackbar/SnackbarProvider';
import ErrorAlert from '../../component/error/ErrorAlert';
import MacroBar from '../foodView/MacroBar';
import { MACRO_COLORS, formatMacro } from '../foodView/macroColors';
import { foodTableSx } from '../component/foodStyles';
import { HAIRLINE, SURFACE, dialogPaperSx } from '../../tokens';

function MacroCell({ value, macro, unit = 'g', strong = false }) {
  return (
    <TableCell align="right">
      <Typography
        component="span"
        variant="body2"
        sx={{ color: MACRO_COLORS[macro].text, fontWeight: strong ? 500 : 400 }}
      >
        {macro === 'kcal' ? Math.round(value) : formatMacro(value)}
      </Typography>
      {unit && (
        <Typography component="span" variant="body2" sx={{ color: 'text.secondary', ml: 0.25 }}>
          {unit}
        </Typography>
      )}
    </TableCell>
  );
}

export default function DietStatisticTableRow({ dietSummary }) {
  const { showSnackbar } = useSnackbar();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const {
    mutate,
    isPending: isPendingDeletion,
    isError: isErrorDeleting,
    error,
  } = useMutation({
    mutationFn: (id) => REST.deleteDietSummaries(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['diet-summaries']);
      showSnackbar(t('food.deleteSuccess', { date: dietSummary.date }), 'success');
    },
    onError: () => {
      showSnackbar(t('food.deleteError', { date: dietSummary.date }), 'error');
    },
    retry: false,
  });

  const handleConfirmDelete = () => {
    setConfirmOpen(false);
    mutate(dietSummary.id);
  };

  const locale = i18n.language === 'en' ? 'en-GB' : 'pl-PL';
  const date = new Date(dietSummary.date);
  const formattedDate = date.toLocaleDateString(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  const weekday = date.toLocaleDateString(locale, { weekday: 'long' });

  return (
    <>
      <TableRow
        hover
        selected={open}
        onClick={() => setOpen((prev) => !prev)}
        sx={{ cursor: 'pointer', '& > .MuiTableCell-root': { borderBottom: open ? 0 : undefined } }}
      >
        <TableCell>
          <IconButton
            aria-label={t('food.showMeals')}
            aria-expanded={open}
            size="small"
            onClick={(event) => {
              event.stopPropagation();
              setOpen((prev) => !prev);
            }}
          >
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>

        <TableCell>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {formattedDate}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {weekday}
          </Typography>
        </TableCell>

        <MacroCell value={dietSummary.kcal} macro="kcal" unit="" strong />
        <MacroCell value={dietSummary.protein} macro="protein" />
        <MacroCell value={dietSummary.carbohydrates} macro="carbohydrates" />
        <MacroCell value={dietSummary.fat} macro="fat" />

        <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
          <MacroBar
            protein={dietSummary.protein}
            carbohydrates={dietSummary.carbohydrates}
            fat={dietSummary.fat}
          />
        </TableCell>

        <TableCell align="right" onClick={(event) => event.stopPropagation()}>
          <Box sx={{ display: 'inline-flex', gap: 0.5 }}>
            <Tooltip title={t('food.edit')}>
              <IconButton
                aria-label="edit day"
                size="small"
                onClick={() => navigate(`/app/food/${dietSummary.id}/edit`)}
              >
                <EditOutlined fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title={t('common.delete')}>
              <IconButton
                aria-label="delete day"
                size="small"
                onClick={() => setConfirmOpen(true)}
                sx={{ '&:hover': { color: 'error.main' } }}
              >
                <DeleteOutlined fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell colSpan={8} sx={{ py: 0, ...(open ? {} : { borderBottom: 0 }) }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box
              sx={{
                my: 1.5,
                ml: { md: 7 },
                borderRadius: 2,
                bgcolor: 'surface.inset',
                border: HAIRLINE,
                overflow: 'hidden',
              }}
            >
              <Table size="small" sx={foodTableSx}>
                <TableHead>
                  <TableRow>
                    <TableCell>{t('food.name')}</TableCell>
                    <TableCell align="right">{t('food.kcal')}</TableCell>
                    <TableCell align="right">{t('food.protein')}</TableCell>
                    <TableCell align="right">{t('food.carbs')}</TableCell>
                    <TableCell align="right">{t('food.fat')}</TableCell>
                    <TableCell align="right">{t('food.portionMultiplier')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dietSummary.meals?.map((meal, index) => (
                    <TableRow key={meal.id || index}>
                      <TableCell>
                        <Typography variant="body2">{meal.name}</Typography>
                      </TableCell>
                      <MacroCell value={meal.kcal} macro="kcal" unit="" />
                      <MacroCell value={meal.protein} macro="protein" />
                      <MacroCell value={meal.carbohydrates} macro="carbohydrates" />
                      <MacroCell value={meal.fat} macro="fat" />
                      <TableCell align="right">
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          ×{formatMacro(meal.portionMultiplier)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>

      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        maxWidth="xs"
        fullWidth
        slotProps={{
          paper: {
            sx: dialogPaperSx,
          },
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 500 }}>
          <DeleteOutlined sx={{ color: 'error.main' }} />
          {t('common.areYouSure')}
        </DialogTitle>

        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
            {t('food.deleteConfirmation')}
          </Typography>

          <Box sx={{ p: 1.5, bgcolor: SURFACE.card, borderRadius: 2, border: HAIRLINE }}>
            <Typography variant="body2">
              {t('food.date')}: <strong>{formattedDate}</strong>
            </Typography>
            <Typography variant="body2">
              {t('food.calories')}: <strong>{Math.round(dietSummary.kcal)}</strong>
            </Typography>
          </Box>

          {isPendingDeletion && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 2 }}>
              <CircularProgress size={18} />
              <Typography variant="body2">{t('common.deleting')}</Typography>
            </Box>
          )}

          {isErrorDeleting && (
            <Box sx={{ mt: 2 }}>
              <ErrorAlert error={error} />
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button onClick={() => setConfirmOpen(false)} variant="outlined">
            {t('common.cancel')}
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            disabled={isPendingDeletion}
          >
            {t('common.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
