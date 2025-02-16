import React from 'react';
import Item from '../../component/Item';

import {
  Box,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs, Typography,
} from '@mui/material';

function TabPanel(props) {
  const {children, value, index, ...other} = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          {children}
        </Box>
      )}
    </div>
  );
}

const a11yProps = (index) => ({
  id: `full-width-tab-${index}`,
  'aria-controls': `full-width-tabpanel-${index}`,
});

export default function SingleMeal(props) {
  const [tabIndex, setTabIndex] = React.useState(0);

  const handleTabIndexChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const tabs = ['Summary', 'Products', 'Recipes'];

  return (
      <Item>
        <Tabs
          value={tabIndex}
          onChange={handleTabIndexChange}
          indicatorColor="secondary"
          textColor="inherit"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          {tabs.map((label, index) => (
            <Tab key={index} label={label} {...a11yProps(index)} />
          ))}
        </Tabs>

        <TabPanel value={tabIndex} index={0}>
          <Table>
            <TableBody>
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
            </TableBody>
          </Table>

        </TabPanel>

        <TabPanel value={tabIndex} index={1}>
          {props.meal.mealIngredients?.length > 0 ? (
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
                  {props.meal.mealIngredients?.map((ingredient, index) =>
                    <TableRow
                      key={index}
                      sx={{'&:last-child td, &:last-child th': {border: 0}}}
                    >
                      <TableCell>{ingredient.name}</TableCell>
                      <TableCell>{ingredient.amount}</TableCell>
                      <TableCell>{ingredient.unit}</TableCell>
                    </TableRow>)}
                </TableBody>
              </Table>
            </TableContainer>
          ): (
            <Typography>No products available</Typography>
          )}
        </TabPanel>

        <TabPanel value={tabIndex} index={2}>
          {props.meal.recipe?.length > 0 ? (
            props.meal.recipe.map((recipeRow, index) => <div key={index}>{recipeRow}</div>)
          ) : (
            <Typography>No recipes available</Typography>
          )}
        </TabPanel>

      </Item>
  );
}