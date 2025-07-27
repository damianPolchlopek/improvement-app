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
  DialogContent,
  Button,
  Box,
  Typography,
  Chip,
  useTheme,
  Card,
  CardContent,
  Divider,
  CircularProgress
} from "@mui/material";

import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import FitnessCenter from "@mui/icons-material/FitnessCenter";
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
  const theme = useTheme();

  const {
    mutate,
    isPending: isPendingDeletion,
    isError: isErrorDeleting,
    error
  } = useMutation({
    mutationFn: (id) => REST.deleteDietSummaries(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['diet-summaries']);
      showSnackbar(`Success removed diet summary from ${dietSummary.date}`, 'success');
    },
    onError: () => {
      showSnackbar(`Failed removed diet summary from ${dietSummary.date}`, 'error');
    },

    retry: false,
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
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
        <StyledTableCell sx={{ width: "50px" }}>
          <IconButton 
            aria-label="expand row" 
            size="small" 
            onClick={() => setOpen((prev) => !prev)}
            sx={{
              backgroundColor: open ? theme.palette.primary.main : 'transparent',
              color: open ? 'white' : theme.palette.primary.main,
              '&:hover': {
                backgroundColor: theme.palette.primary.main,
                color: 'white'
              },
              transition: 'all 0.2s ease-in-out'
            }}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </StyledTableCell>

        <StyledTableCell>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <RestaurantIcon sx={{ color: theme.palette.primary.main, fontSize: 20 }} />
            <Typography variant="body2" fontWeight="600">
              {formatDate(dietSummary.date)}
            </Typography>
          </Box>
        </StyledTableCell>

        <StyledTableCell>
          <Chip 
            icon={<LocalFireDepartmentIcon />}
            label={formatInput(dietSummary.kcal)}
            color="warning"
            variant="outlined"
            size="small"
          />
        </StyledTableCell>

        <StyledTableCell>
          <Chip 
            label={formatInput(dietSummary.protein)}
            color="success"
            variant="outlined"
            size="small"
          />
        </StyledTableCell>

        <StyledTableCell>
          <Chip 
            label={formatInput(dietSummary.carbohydrates)}
            color="info"
            variant="outlined"
            size="small"
          />
        </StyledTableCell>

        <StyledTableCell>
          <Chip 
            label={formatInput(dietSummary.fat)}
            color="secondary"
            variant="outlined"
            size="small"
          />
        </StyledTableCell>

        <StyledTableCell sx={{ width: "100px" }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton 
              aria-label="edit day" 
              size="small" 
              onClick={handleEditClick}
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
              aria-label="delete day" 
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

      <StyledTableRow>
        <TableCell sx={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 2 }}>
              <Card elevation={4} sx={{ borderRadius: 3, overflow: 'hidden' }}>
                <CardContent sx={{ p: 0 }}>
                  <Table size="small">
                    <TableHead>
                      <StyledTableRow sx={{ backgroundColor: theme.palette.grey[50] }}>
                        <StyledTableCell sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                          {t("food.name")}
                        </StyledTableCell>
                        <StyledTableCell sx={{ fontWeight: 'bold', color: theme.palette.warning.main }}>
                          {t("food.kcal")}
                        </StyledTableCell>
                        <StyledTableCell sx={{ fontWeight: 'bold', color: theme.palette.success.main }}>
                          {t("food.protein")}
                        </StyledTableCell>
                        <StyledTableCell sx={{ fontWeight: 'bold', color: theme.palette.info.main }}>
                          {t("food.carbs")}
                        </StyledTableCell>
                        <StyledTableCell sx={{ fontWeight: 'bold', color: theme.palette.secondary.main }}>
                          {t("food.fat")}
                        </StyledTableCell>
                        <StyledTableCell sx={{ fontWeight: 'bold' }}>
                          {t("food.amount")}
                        </StyledTableCell>
                      </StyledTableRow>
                    </TableHead>
                    <TableBody>
                      {dietSummary.meals?.map((meal, index) => (
                        <StyledTableRow 
                          key={meal.id || index}
                          sx={{
                            '&:hover': {
                              backgroundColor: theme.palette.action.hover
                            }
                          }}
                        >
                          <StyledTableCell>
                            <Typography variant="body2" fontWeight="500">
                              {meal.name}
                            </Typography>
                          </StyledTableCell>
                          <StyledTableCell>
                            <Typography variant="body2" color="warning.main">
                              {meal.kcal}
                            </Typography>
                          </StyledTableCell>
                          <StyledTableCell>
                            <Typography variant="body2" color="success.main">
                              {meal.protein}
                            </Typography>
                          </StyledTableCell>
                          <StyledTableCell>
                            <Typography variant="body2" color="info.main">
                              {meal.carbohydrates}
                            </Typography>
                          </StyledTableCell>
                          <StyledTableCell>
                            <Typography variant="body2" color="secondary.main">
                              {meal.fat}
                            </Typography>
                          </StyledTableCell>
                          <StyledTableCell>
                            <Typography variant="body2">
                              {meal.amount}
                            </Typography>
                          </StyledTableCell>
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </Box>
          </Collapse>
        </TableCell>
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
          {t('common.areYouSure')}
        </DialogTitle>
        
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {t('food.deleteConfirmation')}
          </Typography>
          
          <Box sx={{
            p: 2,
            backgroundColor: theme.palette.grey[50],
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider'
          }}>
            <Typography variant="body2" color="text.secondary">
              Data: <strong>{formatDate(dietSummary.date)}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Kalorie: <strong>{formatInput(dietSummary.kcal)}</strong>
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
                {t('common.deleting')}
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
            {t('common.cancel')}
          </Button>
          <Button 
            onClick={handleConfirmDelete} 
            color="error" 
            variant="contained"
            size="large"
            sx={{ minWidth: 100 }}
            disabled={isPendingDeletion}
          >
            {t('common.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}