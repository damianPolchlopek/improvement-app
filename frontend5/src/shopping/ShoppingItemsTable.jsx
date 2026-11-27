import React from 'react';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import {
  Box,
  IconButton,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { CheckCircleOutlined, RemoveShoppingCart } from '@mui/icons-material';

import REST, { queryClient } from '../utils/REST';
import { useSnackbar } from '../component/snackbar/SnackbarProvider';
import { HAIRLINE, surfaceSx } from '../tokens';
import { otherTableSx } from '../other/component/otherStyles';
import { categoryColor } from './shoppingCategories';

// Lista zakupów – produkt po produkcie. Kategoria pokazywana tylko w widoku "Wszystkie".
export default function ShoppingItemsTable({ items, showCategory, title, isLoading }) {
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();

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
    <Box component="section" sx={surfaceSx}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'baseline',
          gap: 1,
          px: 2,
          py: 1.5,
          borderBottom: HAIRLINE,
        }}
      >
        <Typography component="h2" sx={{ fontWeight: 500 }}>
          {title || t('shopping.itemsList')}
        </Typography>
        {!isLoading && (
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            · {t('shopping.itemsCount', { count: items.length })}
          </Typography>
        )}
      </Box>

      {isLoading ? (
        <Box sx={{ px: 2, py: 1 }}>
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} height={44} />
          ))}
        </Box>
      ) : items.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
          <RemoveShoppingCart sx={{ fontSize: 40, mb: 1, opacity: 0.6 }} />
          <Typography>{t('shopping.noItems')}</Typography>
        </Box>
      ) : (
        <TableContainer>
          <Table size="small" sx={otherTableSx}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: 32 }}>#</TableCell>
                <TableCell>{t('shopping.name')}</TableCell>
                {showCategory && <TableCell>{t('shopping.category')}</TableCell>}
                <TableCell align="right" sx={{ width: 56 }} />
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item, index) => {
                const colors = categoryColor(item.category);
                return (
                  <TableRow key={item.id}>
                    <TableCell sx={{ color: 'text.secondary' }}>{index + 1}</TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>{item.name}</TableCell>
                    {showCategory && (
                      <TableCell>
                        <Box
                          component="span"
                          sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 0.75,
                            px: 1,
                            borderRadius: 1.5,
                            fontSize: 12,
                            lineHeight: 1.9,
                            bgcolor: colors.bg,
                            color: colors.text,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {t(`shopping.categories.${item.category}`)}
                        </Box>
                      </TableCell>
                    )}
                    <TableCell align="right">
                      <Tooltip title={t('shopping.markBought')}>
                        <IconButton
                          aria-label={t('shopping.markBought')}
                          size="small"
                          onClick={() => deleteItem(item)}
                          disabled={isDeleting}
                          sx={{ color: 'text.secondary', '&:hover': { color: 'status.done' } }}
                        >
                          <CheckCircleOutlined fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
