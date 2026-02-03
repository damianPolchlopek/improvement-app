import React, { useState } from 'react';
import REST from '../utils/REST';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from '../component/snackbar/SnackbarProvider';

import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  Collapse,
  IconButton,
  CircularProgress
} from '@mui/material';

import { ShoppingCartIcon, AddIcon } from '@mui/icons-material';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';


export default function ShoppingAdd({ categories = [] }) {
  const [item, setItem] = useState({ name: '', category: categories[0] || '' });
  const [open, setOpen] = useState(false);

  const theme = useTheme();
  const { showSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: () => REST.addProductToShoppingList(item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shopping-list'] });
      setItem(prev => ({ ...prev, name: '' }));
      showSnackbar('Product added', 'success');
    },
    onError: () => {
      showSnackbar('Failed to add product', 'error');
    },
    retry: false,
  });

  const handleAdd = () => {
    if (!item.name.trim()) return;
    mutate();
  };

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
          <ShoppingCartOutlinedIcon sx={{ fontSize: 24 }} />
          <Typography variant="h6" fontWeight="600">
            Add Product
          </Typography>
        </Box>
        <IconButton sx={{ color: 'white' }} size="small">
          {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </IconButton>
      </Box>

      {/* Form */}
      <Collapse in={open} timeout="auto" unmountOnExit>
        <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            placeholder="Product name..."
            label="Name"
            variant="outlined"
            size="small"
            fullWidth
            value={item.name}
            onChange={(e) => setItem(prev => ({ ...prev, name: e.target.value }))}
          />

          <FormControl size="small" fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              label="Category"
              value={item.category}
              onChange={(e) => setItem(prev => ({ ...prev, category: e.target.value }))}
            >
              {categories.map(cat => (
                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            onClick={handleAdd}
            disabled={isPending || !item.name.trim()}
            sx={{ alignSelf: 'flex-start' }}
          >
            {isPending ? <CircularProgress size={20} /> : 'Add Product'}
          </Button>
        </CardContent>
      </Collapse>
    </Card>
  );
}