import * as React from 'react';
import { useEffect, useState } from "react";

import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Line,
  LineChart
} from "recharts";

export default function ExerciseChart(props) {

  const [dataExercise, setDataExercise] = useState();

  useEffect(() => {

    setDataExercise(props.exercises)
   
  }, []);

    return (
      <React.Fragment>
        {dataExercise ? <ResponsiveContainer width="100%" height={400}>
           <LineChart width={730} height={250} data={props.exercises}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="localDate" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#8884d8" />
            </LineChart> 
        </ResponsiveContainer> : null}
      </React.Fragment>
    );
  
}


 // REST.getExercisesDate(exerciseName).then(response => {
    //   console.log(exerciseName)
    //   console.log(response.entity);
    // });

    // REST.getExercisesCapacity(exerciseName).then(response2 => {
    //   console.log(response2.entity);
    // });

    

    // const fetchDatas = async () => {
    //   const res = await fetch("https://api.coincap.io/v2/assets/?limit=20");
    //   const data = await res.json();
    //   console.log(data);
    //   setdata(data?.data);
    // };
    // fetchDatas();


    {/* <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="name" fill="#8884d8" />
        <Bar dataKey="priceUsd" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer> */}