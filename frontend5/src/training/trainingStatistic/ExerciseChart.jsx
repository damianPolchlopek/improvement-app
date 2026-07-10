import * as React from 'react';
import { useState } from 'react';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { Box, Button, Typography, useTheme } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { ZoomOutMap } from '@mui/icons-material';

// Single source of truth for series colors. The order matches the order of the
// selected exercises, so the chips in the picker and the lines here stay in sync.
export const CHART_COLORS = [
  '#4caf50',
  '#ff9800',
  '#42a5f5',
  '#ec407a',
  '#ab47bc',
  '#26c6da',
  '#ffca28',
  '#8d6e63',
  '#ef5350',
  '#5c6bc0',
];

function formatAxisDate(tickItem) {
  return moment(tickItem).format('DD/MM/YYYY');
}

const CustomTooltip = ({ active, payload, label, t }) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  return (
    <Box
      sx={{
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        borderRadius: 1.5,
        p: 1.5,
        minWidth: 160,
      }}
    >
      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
        {t('chart.date')}: {formatAxisDate(label)}
      </Typography>
      {payload.map((entry) => (
        <Box
          key={entry.dataKey}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
            mt: 0.75,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                backgroundColor: entry.color,
                flexShrink: 0,
              }}
            />
            <Typography variant="body2" sx={{ color: 'text.primary' }} noWrap>
              {entry.dataKey}
            </Typography>
          </Box>
          <Typography variant="body2" fontWeight={700} sx={{ color: 'text.primary' }}>
            {entry.value}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default function ExerciseChart({ data, series, beginDate, endDate }) {
  const { t } = useTranslation();
  const theme = useTheme();

  // Drag-to-zoom state: refArea* track the live selection, zoom holds the applied range.
  const [refAreaLeft, setRefAreaLeft] = useState('');
  const [refAreaRight, setRefAreaRight] = useState('');
  const [zoom, setZoom] = useState(null);

  // Reset zoom when the dataset scope changes (exercises / date range) by adjusting
  // state during render — the React-recommended alternative to a resetting effect.
  const scopeKey = `${beginDate}|${endDate}|${series.join(',')}`;
  const [prevScopeKey, setPrevScopeKey] = useState(scopeKey);
  if (scopeKey !== prevScopeKey) {
    setPrevScopeKey(scopeKey);
    setZoom(null);
    setRefAreaLeft('');
    setRefAreaRight('');
  }

  // Tightly fit the Y axis to the values visible inside the zoomed X range.
  const getYDomain = (from, to) => {
    let bottom = Infinity;
    let top = -Infinity;
    data
      .filter((row) => row.localDate >= from && row.localDate <= to)
      .forEach((row) => {
        series.forEach((name) => {
          const value = row[name];
          if (value != null) {
            bottom = Math.min(bottom, value);
            top = Math.max(top, value);
          }
        });
      });
    if (bottom === Infinity) return ['auto', 'auto'];
    const padding = (top - bottom) * 0.1 || 1;
    return [Math.floor(bottom - padding), Math.ceil(top + padding)];
  };

  const handleZoom = () => {
    let left = refAreaLeft;
    let right = refAreaRight;
    setRefAreaLeft('');
    setRefAreaRight('');

    if (left === '' || right === '' || left === right) return;
    if (left > right) [left, right] = [right, left];

    const [bottom, top] = getYDomain(left, right);
    setZoom({ left, right, bottom, top });
  };

  const resetZoom = () => {
    setZoom(null);
    setRefAreaLeft('');
    setRefAreaRight('');
  };

  const xDomain = zoom ? [zoom.left, zoom.right] : [beginDate, endDate];
  const yDomain = zoom ? [zoom.bottom, zoom.top] : ['auto', 'auto'];

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1,
          mb: 1,
          minHeight: 32,
        }}
      >
        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
          {t('chart.zoomHint')}
        </Typography>
        {zoom && (
          <Button
            size="small"
            variant="outlined"
            startIcon={<ZoomOutMap />}
            onClick={resetZoom}
            sx={{
              color: 'text.primary',
              borderColor: 'rgba(255,255,255,0.3)',
              '&:hover': {
                borderColor: 'success.main',
                backgroundColor: alpha(theme.palette.success.main, 0.12),
              },
            }}
          >
            {t('chart.resetZoom')}
          </Button>
        )}
      </Box>

      <Box sx={{ userSelect: 'none', cursor: 'crosshair' }}>
        <ResponsiveContainer width="100%" height={460}>
          <LineChart
            data={data}
            margin={{ top: 8, right: 24, left: 4, bottom: 8 }}
            onMouseDown={(e) => e && e.activeLabel != null && setRefAreaLeft(e.activeLabel)}
            onMouseMove={(e) =>
              refAreaLeft !== '' && e && e.activeLabel != null && setRefAreaRight(e.activeLabel)
            }
            onMouseUp={handleZoom}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
            <XAxis
              dataKey="localDate"
              domain={xDomain}
              allowDataOverflow
              scale="time"
              type="number"
              tickFormatter={formatAxisDate}
              stroke="rgba(255, 255, 255, 0.6)"
              tick={{ fontSize: 12 }}
              minTickGap={32}
            />
            <YAxis
              domain={yDomain}
              allowDataOverflow
              stroke="rgba(255, 255, 255, 0.6)"
              tick={{ fontSize: 12 }}
              width={44}
            />
            <Tooltip content={(props) => <CustomTooltip {...props} t={t} />} />
            <Legend wrapperStyle={{ paddingTop: 12 }} />
            {series.map((name, index) => (
              <Line
                key={name}
                type="monotone"
                dataKey={name}
                name={name}
                stroke={CHART_COLORS[index % CHART_COLORS.length]}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
                connectNulls
                isAnimationActive={false}
              />
            ))}
            {refAreaLeft !== '' && refAreaRight !== '' && (
              <ReferenceArea
                x1={refAreaLeft}
                x2={refAreaRight}
                strokeOpacity={0.3}
                fill={theme.palette.success.main}
                fillOpacity={0.15}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}
