import React from 'react';
import Item from '../../component/Item';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

  const handleTabIndexChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const tabs = [t('food.summary'), t('food.products'), t('food.recipes')];

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
                <TableCell variant="head">{t('food.name')}</TableCell>
                <TableCell>{props.meal.name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell variant="head">{t('food.kcal')}</TableCell>
                <TableCell>{props.meal.kcal}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell variant="head">{t('food.protein')}</TableCell>
                <TableCell>{props.meal.protein}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell variant="head">{t('food.carbs')}</TableCell>
                <TableCell>{props.meal.carbohydrates}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell variant="head">{t('food.fat')}</TableCell>
                <TableCell>{props.meal.fat}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell variant="head">{t('food.portionAmount')}</TableCell>
                <TableCell>{props.meal.portionAmount}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell variant="head">{t('food.url')}</TableCell>
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
                    <TableCell>{t('food.name')}</TableCell>
                    <TableCell>{t('food.amount')}</TableCell>
                    <TableCell>{t('food.unit')}</TableCell>
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
            <Typography>{t('food.noProducts')}</Typography>
          )}
        </TabPanel>

        <TabPanel value={tabIndex} index={2}>
          {props.meal.recipe?.length > 0 ? (
            props.meal.recipe.map((recipeRow, index) => <div key={index}>{recipeRow}</div>)
          ) : (
            <Typography>{t('food.noRecipes')}</Typography>
          )}
        </TabPanel>

      </Item>
  );
}