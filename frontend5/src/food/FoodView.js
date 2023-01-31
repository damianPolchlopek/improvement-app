import React from 'react';

import PropTypes from 'prop-types';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

import ProductView from './product/ProductView';
import MealView from './MealView';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

export default function FoodView() {

const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <React.Fragment>

      <Box
        sx={{ flexGrow: 1, bgcolor: '#202c34', display: 'flex' }}
      >
        <Box sx={{ borderColor: 'divider', height: '500px' }}>
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={value}
            onChange={handleChange}
            aria-label="Vertical tabs example"
            sx={{ borderRight: 1, borderColor: 'divider' }}
          >
            <Tab label="Products" {...a11yProps(0)} />
            <Tab label="Meals" {...a11yProps(1)} />
            <Tab label="Statistics" {...a11yProps(2)} />
          </Tabs>
        </Box>
        
        <Container>
          <TabPanel value={value} index={0}>
            <ProductView />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <MealView />
          </TabPanel>
          <TabPanel value={value} index={2}>
            Statistics
          </TabPanel>
        </Container>
       
      </Box>
    </React.Fragment>
  );
  
}