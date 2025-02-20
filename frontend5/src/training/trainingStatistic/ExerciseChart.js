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


export default function ExerciseChart(props) {
  const [dataExercise, setDataExercise] = useState([]);
  const [beginDate, setBeginDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const { t } = useTranslation();

  useEffect(() => {
    const updatedExercises = props.exercises.map(element => ({
      ...element,
      localDate: convertLocalDateToEpoch(element.localDate),
    }));

    setDataExercise(updatedExercises);
    setBeginDate(props.beginDate);
    setEndDate(props.endDate);
  }, [props.exercises, props.beginDate, props.endDate]);


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
        <p>{t('messages.loading')}</p>
      )}
    </React.Fragment>
  );

}