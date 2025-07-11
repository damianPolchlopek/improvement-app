import React, { useState } from "react";
import REST from "../../utils/REST";

import Grid from '@mui/material/Unstable_Grid2';
import FormControlLabel from '@mui/material/FormControlLabel';

import Typography from "@mui/material/Typography";
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';


export default function DailyForm(props) {
  const [dailyFields, setDailyFields] = useState(
    {smoking: false, exercise: false, book: false, work: false},
  )

  function addDaily() {
    REST.addDaily(dailyFields).then(response => {
      window.location.reload(false)
    });
  }

  const handleFormChange = (event) => {
    let data = dailyFields;
    data[event.target.name] = !dailyFields[event.target.name];
    setDailyFields(data);

    console.log(dailyFields)
  }

  return(
    <>
      <Grid container>

        <Grid xs={12}>
          <Typography 
            variant="h5" 
            component="div" 
          >
            Daily Schema
          </Typography>
        </Grid>

        <Grid xs={12}>

            <FormControlLabel 
              control={<Checkbox />} 
              value={dailyFields.smoking} 
              name='smoking' 
              onChange={event => handleFormChange(event)} 
              label="Palenie papierosów" 
            />

            <FormControlLabel 
              control={<Checkbox />} 
              value={dailyFields.exercise} 
              name='exercise' 
              onChange={event => handleFormChange(event)} 
              label="Cwiczenia na postawe" 
            />


            <FormControlLabel 
              control={<Checkbox />} 
              value={dailyFields.book} 
              name='book' 
              onChange={event => handleFormChange(event)} 
              label="Książka" 
            />

            <FormControlLabel 
              control={<Checkbox />} 
              value={dailyFields.work} 
              name='work' 
              onChange={event => handleFormChange(event)} 
              label="Cloud" 
            /> 
        </Grid>

        <Grid xs={12}>
          <Button variant="contained" onClick={addDaily}>Submit</Button>
        </Grid>
        
      </Grid>
    </>
  )
}