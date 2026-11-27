import React from 'react';
import { Box, Typography } from '@mui/material';

import appLogo from '../assets/logo.png';
import { surfaceSx, HAIRLINE } from '../food/component/foodStyles';

// Wspólna karta logowania / rejestracji w stylu modułów (płaska powierzchnia, cienka ramka):
// logo, tytuł z opisem, treść i opcjonalna stopka (np. link do drugiego formularza).
export default function AuthCard({ title, description, maxWidth = 420, footer, children }) {
  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 32px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        py: 4,
      }}
    >
      <Box component="main" sx={{ ...surfaceSx, width: '100%', maxWidth, textAlign: 'left' }}>
        <Box sx={{ p: { xs: 2.5, sm: 3.5 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.75, mb: 3 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                flexShrink: 0,
                borderRadius: 2.5,
                bgcolor: 'rgba(255,255,255,0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Box
                component="img"
                src={appLogo}
                alt=""
                sx={{ width: 34, height: 34, objectFit: 'contain' }}
              />
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
          {children}
        </Box>

        {footer && (
          <Box
            sx={{
              px: { xs: 2.5, sm: 3.5 },
              py: 1.75,
              borderTop: HAIRLINE,
              textAlign: 'center',
            }}
          >
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {footer}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
