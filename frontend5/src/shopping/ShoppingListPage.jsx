import React from 'react';
import { useQuery } from '@tanstack/react-query';
import REST from '../utils/REST';

import { Box, useTheme, Card, CardContent, Typography } from '@mui/material';
import { Analytics } from '@mui/icons-material';

import ShoppingAdd from './ShoppingAdd';
import ShoppingListView from './ShoppingListView';

import PageLoader from '../component/loader/PageLoader';
import ErrorAlert from '../component/error/ErrorAlert';


export default function ShoppingListPage() {
  const theme = useTheme();

  const { data: categories, isLoading, isError, error } = useQuery({
    queryKey: ['shopping-categories'],
    queryFn: () => REST.getAllCategoryProducts().then(res => res.entity),
  });

  if (isLoading) {
    return <PageLoader text="Loading..." />;
  }

  if (isError) {
    return <ErrorAlert error={error} />;
  }

  return (
    <Box sx={{ py: 4 }}>
      <Box sx={{ maxWidth: 800, mx: 'auto', px: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>

        {/* Header */}
        <Card elevation={6} sx={{
          borderRadius: 3,
          background: theme.palette.card.header,
          color: 'white',
        }}>
          <CardContent sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" gap={2}>
              <Analytics sx={{ fontSize: 32 }} />
              <Typography variant="h4" fontWeight="600">
                Shopping List
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ opacity: 0.9, mt: 1 }}>
              Manage your shopping list by category
            </Typography>
          </CardContent>
        </Card>

        {/* Add + List */}
        <ShoppingAdd categories={categories} />
        <ShoppingListView categories={categories} />

      </Box>
    </Box>
  );
}