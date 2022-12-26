import React, { useState, useEffect } from 'react';
import REST from '../../utils/REST';
// import SingleTraining from './SingleTraining';
// import './TrainingsView.css';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { Button, Collapse } from '@mui/material';
import Typography from '@mui/material/Typography';
import SingleTraining from './SingleTraining';
// import CommentIcon from '@mui/icons-material/Comment';


export default function TrainingsView() {
  const [trainingNames, setTrainingNames] = useState(null);
  const [checked, setChecked] = React.useState([0]);
    
  useEffect(() => {
    REST.getAllTrainingNames().then(response => {
      setTrainingNames(response.entity);
    });
  }, []);


  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };


  return (
    <React.Fragment>
      {trainingNames ? 

      <div className='training-list'>
        <Typography variant="h4" component="div" style={{color: 'white'}}>
          TrainingView
        </Typography>


        <List>
          {trainingNames.map((trainingName) => {
            return (
              <SingleTraining 
                  key={trainingName}
                  trainingName={trainingName}
                />
              // <React.Fragment>
              //   <ListItem
              //     key={trainingName}
              //     disablePadding
              //   >
              //     <ListItemButton role={undefined} onClick={handleToggle(trainingName)} dense>
              //       <ListItemText id={trainingName} primary={trainingName} />
              //     </ListItemButton>

              //     <Button edge="end" onClick={() => console.log('Modify')}>Modify</Button>
              //     <Button edge="end" onClick={() => console.log('Delete')}>Delete</Button>
              //     {/* <SingleTraining /> */}
                    
              //   </ListItem>
              //   <SingleTraining 
              //     key={trainingName}
              //     trainingName={trainingName}
              //   />
              // </React.Fragment>
            );
          })}
        </List>
        
      </div> : null} 
    </React.Fragment>
  );
  
}
