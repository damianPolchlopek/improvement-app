import { useState } from "react";
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
  Box
} from "@mui/material";

import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useTranslation } from "react-i18next";

import StyledTableCell from "../../component/table/StyledTableCell";
import StyledTableRow from "../../component/table/StyledTableRow";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from '../../utils/REST';
import REST from '../../utils/REST';
import { useNavigate } from "react-router-dom";
import { useSnackbar } from '../../component/snackbar/SnackbarProvider';
import { formatInput } from '../../utils/common';
import ErrorAlert from "../../component/error/ErrorAlert";

export default function DietStatisticTableRow({ dietSummary }) {
  const { showSnackbar } = useSnackbar();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const {
    mutate,
    isPending: isPendingDeletion,
    isError: isErrorDeleting,
    error
  } = useMutation({
    mutationFn: (id) => REST.deleteDietSummaries(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['diet-summaries']);
      showSnackbar( `Success removed diet summary from ${dietSummary.date}`, 'success' );
    },
    onError: () => {
      showSnackbar( `Failed removed diet summary from ${dietSummary.date}`, 'error' );
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

  const handleEditClick = () => {
    navigate(`/food/${dietSummary.id}/edit`);
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
        <StyledTableCell>{formatInput(dietSummary.kcal)}</StyledTableCell>
        <StyledTableCell>{formatInput(dietSummary.protein)}</StyledTableCell>
        <StyledTableCell>{formatInput(dietSummary.carbohydrates)}</StyledTableCell>
        <StyledTableCell>{formatInput(dietSummary.fat)}</StyledTableCell>

        {/* Ikona usuwania */}
        <StyledTableCell sx={{ width: "100px" }}>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <IconButton aria-label="edit day" size="small" onClick={handleEditClick}>
              <EditIcon color="primary" fontSize="small" />
            </IconButton>
            <IconButton aria-label="delete day" size="small" onClick={handleDeleteClick}>
              <DeleteIcon color="error" fontSize="small" />
            </IconButton>
          </Box>
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
                  <StyledTableCell>{t("food.amount")}</StyledTableCell>
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
                    <StyledTableCell>{meal.amount}</StyledTableCell>
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
            <ErrorAlert error={error} />
            
          )}
        </Dialog>
      </StyledTableRow>
    </>
  );
}
