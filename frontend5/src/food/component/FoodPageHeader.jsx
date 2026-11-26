import React from 'react';
import { Box, Divider, Skeleton, Typography } from '@mui/material';
import { surfaceSx, HAIRLINE } from './foodStyles';

// Wspólny nagłówek widoków modułu food:
// ikona + tytuł + opis, opcjonalna jedna liczba (np. liczba posiłków),
// akcje po prawej (wyszukiwarka, przycisk) i opcjonalny rząd filtrów pod linią.
export default function FoodPageHeader({
  icon,
  title,
  description,
  statLabel,
  statValue,
  statLoading = false,
  actions,
  children,
}) {
  return (
    <Box component="header" sx={{ ...surfaceSx, mb: 3 }}>
      <Box sx={{ p: { xs: 2, md: 2.5 } }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            columnGap: 4,
            rowGap: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.75, flex: '1 1 280px' }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                flexShrink: 0,
                borderRadius: 2.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'rgba(255, 255, 255, 0.06)',
                color: 'text.primary',
              }}
            >
              {icon}
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="h5" component="h1" sx={{ fontWeight: 500, lineHeight: 1.2 }}>
                {title}
              </Typography>
              {description && (
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {description}
                </Typography>
              )}
            </Box>
          </Box>

          {statLabel && (
            <Box sx={{ minWidth: 0, pl: { md: 3 }, borderLeft: { md: HAIRLINE } }}>
              <Typography
                variant="caption"
                sx={{ color: 'text.secondary', display: 'block' }}
                noWrap
              >
                {statLabel}
              </Typography>
              {statLoading ? (
                <Skeleton width={48} height={30} />
              ) : (
                <Typography sx={{ fontSize: 22, fontWeight: 500, lineHeight: 1.35 }}>
                  {statValue}
                </Typography>
              )}
            </Box>
          )}

          {actions && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                flexWrap: 'wrap',
                ml: { lg: 'auto' },
                width: { xs: '100%', sm: 'auto' },
              }}
            >
              {actions}
            </Box>
          )}
        </Box>

        {children && (
          <>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
              {children}
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}
