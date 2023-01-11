import React from 'react';

import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#202c44' : '#202c34',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
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
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}
  
export default function SingleMeal(props) {
  const [tabIndex, setTabIndex] = React.useState(0);

  const handleTabIndexChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <React.Fragment>
      <Item>
        <Box>
          <Tabs 
            value={tabIndex} 
            onChange={handleTabIndexChange} 
            indicatorColor="secondary"
            textColor="inherit"
            variant="fullWidth"
            aria-label="full width tabs example"
          >
            <Tab label="Sumary" {...a11yProps(0)} />
            <Tab label="Products" {...a11yProps(0)} />
            <Tab label="Recipes" {...a11yProps(0)} />
          </Tabs>

          <TabPanel value={tabIndex} index={0}>  
            <Table>
              <TableRow>
                <TableCell variant="head">Name</TableCell>
                <TableCell>{props.meal.name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell variant="head">Kcal</TableCell>
                <TableCell>{props.meal.kcal}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell variant="head">Protein</TableCell>
                <TableCell>{props.meal.protein}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell variant="head">Carbo</TableCell>
                <TableCell>{props.meal.carbohydrates}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell variant="head">Fat</TableCell>
                <TableCell>{props.meal.fat}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell variant="head">Portion amount</TableCell>
                <TableCell>{props.meal.portionAmount}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell variant="head">URL</TableCell>
                <TableCell>{props.meal.url}</TableCell>
              </TableRow>
            </Table>

          </TabPanel>

          <TabPanel value={tabIndex} index={1}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Unit</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {props.meal.productList.map((product, index) => 
                    <TableRow
                    key={index}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.amount}</TableCell>
                    <TableCell>{product.unit}</TableCell>
                  </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          <TabPanel value={tabIndex} index={2}>
            {props.meal.recipe.map(( (recipeRow, index) =>
              <div key={index} textAlign="left">{recipeRow.name}</div>))}
          </TabPanel>
        </Box>
        
      </Item>          
    </React.Fragment>
  );
}