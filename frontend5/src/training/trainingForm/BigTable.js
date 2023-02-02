import React from "react";

import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';

import TextField from '@mui/material/TextField';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

function MyTableCell(props){
  return <TableCell style={{padding: '4px'}}>{props.children}</TableCell>
}

export default function BigTable(props) {
    return(
      <React.Fragment>
        <TableContainer padding="8px" hidden={props.hidden}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                  <MyTableCell>#</MyTableCell>
                  <MyTableCell>Type</MyTableCell>
                  <MyTableCell>Place</MyTableCell>
                  <MyTableCell>Name</MyTableCell>
                  <MyTableCell>Reps</MyTableCell>
                  <MyTableCell>Weight</MyTableCell>
                  <MyTableCell>Progress</MyTableCell>
                  <MyTableCell>Add</MyTableCell>
                  <MyTableCell>Remove</MyTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {props.exercises ? props.exercises.map((exercise, index) => (
              <TableRow style={{padding: '8px'}} key={index}>
                <MyTableCell>{index}</MyTableCell>
                <MyTableCell>
                  <Select 
                    name='type' 
                    defaultValue={exercise.type}
                    size='small'
                  >
                    {props.exerciseTypes ? props.exerciseTypes.map((exerciseType, index) => {
                      return(
                        <MenuItem key={index} value={exerciseType.type}>
                          {exerciseType.type}
                        </MenuItem>
                      );
                    }) : null}
                  </Select>
                </MyTableCell>
                <MyTableCell>
                  <Select 
                    name='place' 
                    defaultValue={exercise.place}
                    size='small'
                  >
                    {props.exercisePlaces ? props.exercisePlaces.map((exercisePlace, index) => {
                      return(
                        <MenuItem key={index} value={exercisePlace.place}>
                          {exercisePlace.place}
                        </MenuItem>
                      );
                    }) : null}
                  </Select>
                </MyTableCell>
                <MyTableCell>
                  <Select 
                    name='name' 
                    defaultValue={exercise.name}
                    size='small'
                  >
                    {props.exerciseNames ? props.exerciseNames.map((exerciseName, index) => {
                      return(
                        <MenuItem key={index} value={exerciseName.name}>
                          {exerciseName.name}
                        </MenuItem>
                      );
                    }) : null}
                  </Select>
                </MyTableCell>
                <MyTableCell>
                  <TextField
                    style={{width: 150}}
                    name='reps' 
                    placeholder="Reps..."
                    defaultValue={exercise.reps}
                    variant="outlined"
                    size="small"
                  />
                </MyTableCell>
                <MyTableCell>
                <TextField
                    style={{width: 230}}
                    name='weight' 
                    placeholder="weight..."
                    defaultValue={exercise.weight}
                    variant="outlined"
                    size="small"
                  />
                </MyTableCell>
                <MyTableCell>
                  <Select 
                    name='progress' 
                    defaultValue={exercise.progress}
                    size='small'
                  >
                    {props.exerciseProgresses ? props.exerciseProgresses.map((exerciseProgress, index) => {
                      return(
                        <MenuItem key={index} value={exerciseProgress.progress}>
                          {exerciseProgress.progress}
                        </MenuItem>
                      );
                    }) : null}
                  </Select>
                </MyTableCell>
                <MyTableCell>
                  <Button>Add</Button>
                </MyTableCell>
                <MyTableCell>
                  <Button>Remove</Button>
                </MyTableCell>
              </TableRow>

            )): null}
                
            </TableBody>
          </Table>
        </TableContainer>
      </React.Fragment>
    )
}