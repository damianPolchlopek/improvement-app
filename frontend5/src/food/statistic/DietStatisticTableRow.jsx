import React, { useState } from "react";
import {
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTranslation } from "react-i18next";

import StyledTableCell from "../../component/table/StyledTableCell";
import StyledTableRow from "../../component/table/StyledTableRow";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from '../../utils/REST';
import REST from '../../utils/REST';
import ErrorBlock from "../../component/ErrorBlock";

export default function DietStatisticTableRow({ dietSummary }) {
  const [snackbar, setSnackbar] = useState(
      { open: false, message: '', severity: 'success' });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const {
    mutate,
    isPending: isPendingDeletion,
    isError: isErrorDeleting,
    error: deleteError,
  } = useMutation({
    mutationFn: (id) => REST.deleteDietSummaries(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['diet-summaries']);
      setSnackbar({
        open: true,
        message: `Success removed diet summary from ${dietSummary.date}`,
        severity: 'success',
      });
    },
    onError: () => {
      setSnackbar({
        open: true,
        message: `Failed removed diet summary from ${dietSummary.date}`,
        severity: 'error',
      });
    }
  });

  const handleDeleteClick = () => {
    setConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    setConfirmOpen(false);
    handleDaySummaryRemove(dietSummary.id);
  };

  const handleDaySummaryRemove = (id) => {
    mutate(id);
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
      <StyledTableRow>
        <StyledTableCell sx={{ width: "50px" }}>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen((prev) => !prev)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </StyledTableCell>

        <StyledTableCell>{dietSummary.date}</StyledTableCell>
        <StyledTableCell>{dietSummary.kcal}</StyledTableCell>
        <StyledTableCell>{dietSummary.protein}</StyledTableCell>
        <StyledTableCell>{dietSummary.carbohydrates}</StyledTableCell>
        <StyledTableCell>{dietSummary.fat}</StyledTableCell>

        {/* Ikona usuwania */}
        <StyledTableCell sx={{ width: "50px" }}>
          <IconButton aria-label="delete day" size="small" onClick={handleDeleteClick}>
            <DeleteIcon color="error" fontSize="small"/>
          </IconButton>
        </StyledTableCell>
      </StyledTableRow>

      <StyledTableRow>
        <TableCell sx={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Table size="small">
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell>{t("food.name")}</StyledTableCell>
                  <StyledTableCell>{t("food.kcal")}</StyledTableCell>
                  <StyledTableCell>{t("food.protein")}</StyledTableCell>
                  <StyledTableCell>{t("food.carbs")}</StyledTableCell>
                  <StyledTableCell>{t("food.fat")}</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {dietSummary.meals.map((meal) => (
                  <StyledTableRow key={meal.id}>
                    <StyledTableCell>{meal.name}</StyledTableCell>
                    <StyledTableCell>{meal.kcal}</StyledTableCell>
                    <StyledTableCell>{meal.protein}</StyledTableCell>
                    <StyledTableCell>{meal.carbohydrates}</StyledTableCell>
                    <StyledTableCell>{meal.fat}</StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </Collapse>
        </TableCell>

        <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
          <DialogTitle>{t('common.areYouSure')}</DialogTitle>
          <p>{t('food.deleteConfirmation')}</p>
          {isPendingDeletion && <p>{t('common.deleting')}</p>}
          <DialogActions>
            <Button onClick={() => setConfirmOpen(false)} color="primary">
              {t('common.cancel')}
            </Button>
            <Button onClick={handleConfirmDelete} color="error" variant="contained">
              {t('common.delete')}
            </Button>
          </DialogActions>
          {isErrorDeleting && (
            <ErrorBlock
              title={t('food.deleteErrorTitle')}
              message={
                deleteError.info?.message ||
                t('food.deleteErrorMessage')
              }
            />
          )}
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbar.severity} 
            variant="filled"
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </StyledTableRow>
    </>
  );
}
