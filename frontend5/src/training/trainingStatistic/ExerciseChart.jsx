import * as React from 'react';
import { useEffect, useState } from 'react';
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
} from "recharts";

import { Typography } from '@mui/material';


function formatXAxis(tickItem) {
  return moment(tickItem).format('DD/MM/YYYY')
}

function convertLocalDateToEpoch(date) {
  return moment(date).valueOf()
}

const CustomTooltip = ({ active, payload, label }) => {
  const { t } = useTranslation();
  
  if (active && payload && payload.length) {
    return (
      <div style={{ backgroundColor: 'black', padding: '5px', color: 'white' }}>
        <p>{t('chart.date')}: {formatXAxis(label)}</p>
        <p>{t('chart.value')}: {payload[0]?.value || 'No data'}</p>
      </div>
    );
  }

  return null;
};


export default function ExerciseChart({exercises, beginDate, endDate}) {
  const [dataExercise, setDataExercise] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    const updatedExercises = exercises.map(element => ({
      ...element,
      localDate: convertLocalDateToEpoch(element.localDate),
    }));

    setDataExercise(updatedExercises);
  }, [exercises, beginDate, endDate]);


  return (
    <React.Fragment>
      {dataExercise.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            width={730}
            height={250}
            data={dataExercise}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3"/>
            <XAxis
              dataKey="localDate"
              domain={[convertLocalDateToEpoch(beginDate), convertLocalDateToEpoch(endDate)]}
              scale="time"
              type="number"
              tickFormatter={formatXAxis}
            />
            <YAxis />
            <Tooltip content={<CustomTooltip/>}/>
            <Legend/>
            <Line type="monotone" dataKey="value" stroke="#8884d8"/>
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <Typography variant="body2">{t('messages.loading')}</Typography>
      )}
    </React.Fragment>
  );

}