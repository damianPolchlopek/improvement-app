import * as React from 'react';
import { useEffect, useState } from 'react';
import moment from 'moment/moment';

// Recharts components
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

const CustomTooltip = ({active, payload, label}) => {
  if (active && payload && payload.length) {
    return (
      <div style={{backgroundColor: 'black'}}>
        <p>Date: {formatXAxis(label)}</p>
        <p>Value: {`${payload[0].value}`}</p>
      </div>
    );
  }

  return null;
};

export default function ExerciseChart(props) {
  const [dataExercise, setDataExercise] = useState();
  const [beginDate, setBeginDate] = useState();
  const [endDate, setEndDate] = useState();

  useEffect(() => {
    setDataExercise(props.exercises)

    setBeginDate(props.beginDate);
    setEndDate(props.endDate)

    props.exercises.forEach(element => {
      element.localDate = convertLocalDateToEpoch(element.localDate);
    });
  });

  return (
    <React.Fragment>
      {dataExercise ? <ResponsiveContainer width="100%" height={400}>
        <LineChart width={730} height={250} data={props.exercises}
                   margin={{top: 5, right: 30, left: 20, bottom: 5}}
        >
          <CartesianGrid strokeDasharray="3 3"/>
          <XAxis
            dataKey="localDate"
            domain={[convertLocalDateToEpoch(beginDate), convertLocalDateToEpoch(endDate)]}
            scale="time"
            type="number"
            tickFormatter={formatXAxis}
          />
          <YAxis/>
          <Tooltip content={<CustomTooltip/>}/>
          <Legend/>
          <Line type="monotone" dataKey="value" stroke="#8884d8"/>
        </LineChart>
      </ResponsiveContainer> : null}
    </React.Fragment>
  );

}