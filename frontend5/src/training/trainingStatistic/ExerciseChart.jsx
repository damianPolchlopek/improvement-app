import * as React from 'react';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { Box, Typography } from '@mui/material';

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
      <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
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
            <Typography variant="body2" sx={{ color: 'white' }} noWrap>
              {entry.dataKey}
            </Typography>
          </Box>
          <Typography variant="body2" fontWeight={700} sx={{ color: 'white' }}>
            {entry.value}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default function ExerciseChart({ data, series, beginDate, endDate }) {
  const { t } = useTranslation();

  return (
    <ResponsiveContainer width="100%" height={460}>
      <LineChart data={data} margin={{ top: 8, right: 24, left: 4, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
        <XAxis
          dataKey="localDate"
          domain={[beginDate, endDate]}
          scale="time"
          type="number"
          tickFormatter={formatAxisDate}
          stroke="rgba(255, 255, 255, 0.6)"
          tick={{ fontSize: 12 }}
          minTickGap={32}
        />
        <YAxis stroke="rgba(255, 255, 255, 0.6)" tick={{ fontSize: 12 }} width={44} />
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
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
