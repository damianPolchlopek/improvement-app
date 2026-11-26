import React from 'react';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { Box, Typography } from '@mui/material';

import { surfaceSx, HAIRLINE } from '../food/component/foodStyles';
import { MODULES, MODULE_COLORS } from './dashboardStatus';

const HISTORY_DAYS = 35;

export default function ActivityMosaic({ summary }) {
  const { t } = useTranslation();
  const days = Array.from({ length: HISTORY_DAYS }, (_, index) =>
    dayjs().subtract(HISTORY_DAYS - 1 - index, 'day')
  );

  return (
    <Box component="section" sx={{ ...surfaceSx, mb: 3 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'baseline',
          gap: 1,
          px: 2.5,
          py: 1.5,
          borderBottom: HAIRLINE,
        }}
      >
        <Typography component="h2" sx={{ fontWeight: 500 }}>
          {t('home.last35Days')}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          · {days[0].format('DD.MM')} – {days[HISTORY_DAYS - 1].format('DD.MM')}
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: `72px repeat(${HISTORY_DAYS}, minmax(0, 1fr))`,
          gap: { xs: '2px', sm: '4px' },
          alignItems: 'center',
          px: 2.5,
          py: 2,
        }}
      >
        {MODULES.map(({ key, daysField }) => {
          const filled = new Set(summary[daysField]);
          const color = MODULE_COLORS[key].dot;
          return (
            <React.Fragment key={key}>
              <Typography
                variant="caption"
                sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.75 }}
                noWrap
              >
                <Box
                  component="span"
                  sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: color, flexShrink: 0 }}
                />
                {t(`home.module.${key}`)}
              </Typography>
              {days.map((day, index) => {
                const hasEntry = filled.has(day.format('YYYY-MM-DD'));
                return (
                  <Box
                    key={day.format('YYYY-MM-DD')}
                    title={`${t(`home.module.${key}`)}: ${day.format('DD-MM-YYYY')}`}
                    sx={{
                      aspectRatio: '1',
                      borderRadius: '3px',
                      bgcolor: hasEntry ? color : 'rgba(255,255,255,0.06)',
                      outline: index === HISTORY_DAYS - 1 ? '1.5px solid' : 'none',
                      outlineColor: 'primary.main',
                      outlineOffset: '1px',
                    }}
                  />
                );
              })}
            </React.Fragment>
          );
        })}
      </Box>
    </Box>
  );
}
