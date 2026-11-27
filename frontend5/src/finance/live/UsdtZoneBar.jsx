import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography } from '@mui/material';
import { STATUS } from '../../tokens';

// USDT dominance zones (in %), read off the user's own TradingView analysis.
// High USDT.D = money parked in stablecoins = market bottom; low = market top.
// Edit here to move a zone.
export const USDT_ZONES = [
  { id: 'buyDip', from: 8.2, to: 9.4, color: '#ff9800' },
  { id: 'takeProfit', from: 5.65, to: 7.15, color: '#fdd835' },
  { id: 'sellTop', from: 3.7, to: 4.8, color: '#ff9800' },
];
export const USDT_LOCAL_BOTTOM = 8.545;

const SCALE_MIN = 3;
const SCALE_MAX = 10;
const TICKS = [3, 4, 5, 6, 7, 8, 9, 10];

/** Distance from the top of the bar, in %, for a USDT.D value. */
function topPercent(value) {
  const clamped = Math.min(SCALE_MAX, Math.max(SCALE_MIN, value));
  return ((SCALE_MAX - clamped) / (SCALE_MAX - SCALE_MIN)) * 100;
}

/**
 * Vertical gauge next to the USDT.D chart: the analysis zones on a fixed 3–10% scale,
 * with the current dominance marked. The TradingView widget can't be drawn on, so the
 * zones live beside it instead.
 */
export default function UsdtZoneBar({ value, height = 420 }) {
  const { t } = useTranslation();
  const hasValue = typeof value === 'number';
  const currentZone = hasValue ? USDT_ZONES.find((z) => value >= z.from && value <= z.to) : null;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        height,
        minWidth: 0,
        textAlign: 'left',
        py: 1.5,
      }}
    >
      <Box>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {t('finance.live.zoneNow')}
        </Typography>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.3 }}>
          {!hasValue && '—'}
          {hasValue && `${value.toFixed(2)}% · `}
          {hasValue &&
            (currentZone ? t(`finance.live.zones.${currentZone.id}`) : t('finance.live.zoneNone'))}
        </Typography>
      </Box>

      <Box sx={{ position: 'relative', flex: 1, display: 'flex', gap: 1 }}>
        {/* Scale */}
        <Box sx={{ position: 'relative', width: 28, flexShrink: 0 }}>
          {TICKS.map((tick) => (
            <Typography
              key={tick}
              variant="caption"
              sx={{
                position: 'absolute',
                right: 0,
                top: `${topPercent(tick)}%`,
                transform: 'translateY(-50%)',
                color: 'text.secondary',
                fontSize: 11,
              }}
            >
              {tick}%
            </Typography>
          ))}
        </Box>

        {/* Bar */}
        <Box
          sx={{
            position: 'relative',
            flex: 1,
            borderRadius: 1,
            bgcolor: 'surface.subtle',
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          {USDT_ZONES.map((zone) => (
            <Box
              key={zone.id}
              sx={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: `${topPercent(zone.to)}%`,
                height: `${topPercent(zone.from) - topPercent(zone.to)}%`,
                bgcolor: `${zone.color}55`,
                borderTop: `1px solid ${zone.color}`,
                borderBottom: `1px solid ${zone.color}`,
                display: 'flex',
                alignItems: 'center',
                px: 1,
                outline: currentZone?.id === zone.id ? `2px solid ${zone.color}` : 'none',
              }}
            >
              <Typography
                variant="caption"
                sx={{ fontWeight: 700, lineHeight: 1.1, fontSize: 11, color: 'text.primary' }}
              >
                {t(`finance.live.zones.${zone.id}`)}
                <Box component="span" sx={{ display: 'block', fontWeight: 400, opacity: 0.8 }}>
                  {zone.from}–{zone.to}%
                </Box>
              </Typography>
            </Box>
          ))}

          {/* Local bottom line */}
          <Box
            sx={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: `${topPercent(USDT_LOCAL_BOTTOM)}%`,
              borderTop: `1px dashed ${STATUS.up}`,
            }}
          >
            <Typography
              variant="caption"
              sx={{ position: 'absolute', right: 4, top: 1, fontSize: 10, color: 'status.up' }}
            >
              {t('finance.live.localBottom')} {USDT_LOCAL_BOTTOM}%
            </Typography>
          </Box>

          {/* Current value marker */}
          {hasValue && (
            <Box
              sx={{
                position: 'absolute',
                left: -4,
                right: -4,
                top: `${topPercent(value)}%`,
                borderTop: '2px solid',
                borderColor: 'common.white',
                zIndex: 1,
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  left: 4,
                  top: 0,
                  transform: 'translateY(-50%)',
                  bgcolor: 'common.white',
                  color: 'common.black',
                  borderRadius: 0.5,
                  px: 0.5,
                  fontSize: 11,
                  fontWeight: 700,
                }}
              >
                {value.toFixed(2)}%
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
