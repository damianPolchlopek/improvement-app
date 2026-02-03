import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import REST from '../utils/REST';
import { useSnackbar } from '../component/snackbar/SnackbarProvider';

import {
  Box,
  Card,
  CardContent,
  Typography,
  useTheme,
  Collapse,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Divider,
} from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import ErrorAlert from '../component/error/ErrorAlert';


export default function ShoppingListView({ categories = [] }) {
  const [selectedCategory, setSelectedCategory] = useState(categories[0] || '');
  const [open, setOpen] = useState(true);

  const theme = useTheme();
  const { showSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const { data: shoppingList, isLoading, isError, error } = useQuery({
    queryKey: ['shopping-list', selectedCategory],
    queryFn: () => REST.getShoppingListByCategory(selectedCategory).then(res => res.entity),
    enabled: !!selectedCategory,
    keepPreviousData: true,
  });

  const { mutate: deleteProduct, isPending: isDeleting } = useMutation({
    mutationFn: (id) => REST.deleteProductFromShoppingList(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shopping-list', selectedCategory] });
      showSnackbar('Product removed', 'success');
    },
    onError: () => {
      showSnackbar('Failed to remove product', 'error');
    },
    retry: false,
  });

  if (isError) {
    return <ErrorAlert error={error} />;
  }

  return (
    <Card elevation={6} sx={{ borderRadius: 3, overflow: 'hidden' }}>
      {/* Header */}
      <Box
        onClick={() => setOpen(prev => !prev)}
        sx={{
          p: 2,
          background: theme.palette.card.header,
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <ShoppingBasketIcon sx={{ fontSize: 24 }} />
          <Typography variant="h6" fontWeight="600">
            Shopping List
          </Typography>
        </Box>
        <IconButton sx={{ color: 'white' }} size="small">
          {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </IconButton>
      </Box>

      <Collapse in={open} timeout="auto" unmountOnExit>
        <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>

          {/* Category selector */}
          <FormControl size="small" sx={{ maxWidth: 250 }}>
            <InputLabel>Category</InputLabel>
            <Select
              label="Category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(cat => (
                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <Divider />

          {/* Product list */}
          {isLoading ? (
            <CircularProgress size={24} sx={{ alignSelf: 'center' }} />
          ) : shoppingList?.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
              No products in this category
            </Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {shoppingList?.map((product) => (
                <Box
                  key={product.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 1.5,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover,
                    },
                    transition: 'background-color 0.2s ease-in-out',
                  }}
                >
                  <Typography variant="body2" fontWeight="500">
                    {product.name}
                  </Typography>

                  <IconButton
                    size="small"
                    onClick={() => deleteProduct(product.id)}
                    disabled={isDeleting}
                    sx={{
                      backgroundColor: theme.palette.error.light,
                      color: theme.palette.error.main,
                      '&:hover': {
                        backgroundColor: theme.palette.error.main,
                        color: 'white',
                        transform: 'scale(1.1)',
                      },
                      transition: 'all 0.2s ease-in-out',
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Box>
          )}
        </CardContent>
      </Collapse>
    </Card>
  );
}