import React from 'react';
import {
  Card,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  Paper,
  Box,
  Typography,
  IconButton,
  useTheme,
} from '@mui/material';
import { ShoppingBasket } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import REST, { queryClient } from '../utils/REST';
import { useSnackbar } from '../component/snackbar/SnackbarProvider';
import StyledTableCell from '../component/table/StyledTableCell';
import StyledTableRow from '../component/table/StyledTableRow';

export default function ShoppingItemsTable({ items }) {
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();
  const theme = useTheme();

  // Bez potwierdzenia — usunięcie produktu to "odhaczenie" go z listy zakupów
  const { mutate: deleteItem, isPending: isDeleting } = useMutation({
    mutationFn: (item) => REST.deleteProductFromShoppingList(item.id),
    onSuccess: (_, item) => {
      queryClient.invalidateQueries({ queryKey: ['shopping-list'] });
      showSnackbar(t('shopping.deleteSuccess', { name: item.name }), 'success');
    },
    onError: (_, item) => {
      showSnackbar(t('shopping.deleteError', { name: item.name }), 'error');
    },
    retry: false,
  });

  return (
    <Card elevation={2} sx={{ borderRadius: 3, overflow: 'hidden' }}>
      <Box
        sx={{
          p: 2,
          background: theme.palette.card.header,
          color: 'text.primary',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <ShoppingBasket sx={{ fontSize: 22 }} />
        <Typography variant="subtitle1" fontWeight="600">
          {t('shopping.itemsList')}
        </Typography>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 0 }}>
        <Table>
          <TableHead>
            <StyledTableRow>
              <StyledTableCell>{t('shopping.name')}</StyledTableCell>
              <StyledTableCell>{t('shopping.category')}</StyledTableCell>
              <StyledTableCell>{t('shopping.actions')}</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {items.length > 0 ? (
              items.map((item) => (
                <StyledTableRow
                  key={item.id}
                  sx={{ '&:hover': { backgroundColor: theme.palette.action.hover } }}
                >
                  <StyledTableCell>
                    <Typography variant="body2" fontWeight="600">
                      {item.name}
                    </Typography>
                  </StyledTableCell>
                  <StyledTableCell>
                    <Typography variant="body2">
                      {t(`shopping.categories.${item.category}`)}
                    </Typography>
                  </StyledTableCell>
                  <StyledTableCell sx={{ width: '100px' }}>
                    <IconButton
                      aria-label="delete product"
                      size="small"
                      onClick={() => deleteItem(item)}
                      disabled={isDeleting}
                      sx={{
                        backgroundColor: theme.palette.error.light,
                        color: theme.palette.error.main,
                        '&:hover': {
                          backgroundColor: theme.palette.error.main,
                          color: 'text.primary',
                        },
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </StyledTableCell>
                </StyledTableRow>
              ))
            ) : (
              <StyledTableRow>
                <StyledTableCell colSpan={3} align="center">
                  <Typography variant="body1" color="text.secondary" sx={{ py: 4 }}>
                    {t('shopping.noItems')}
                  </Typography>
                </StyledTableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}
