import React from 'react';
import Item from '../../component/Item';
import { useTranslation } from 'react-i18next';

import {
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs, 
  Typography,
} from '@mui/material';

import TabPanel from '../component/TabPanel';


export default function SingleMeal({ meal }) {
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
            <Tab key={index} label={label} />
          ))}
        </Tabs>

        <TabPanel value={tabIndex} index={0}>
          <TableContainer>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell variant="head">{t('food.name')}</TableCell>
                  <TableCell>{meal.name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell variant="head">{t('food.kcal')}</TableCell>
                  <TableCell>{meal.kcal}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell variant="head">{t('food.protein')}</TableCell>
                  <TableCell>{meal.protein}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell variant="head">{t('food.carbs')}</TableCell>
                  <TableCell>{meal.carbohydrates}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell variant="head">{t('food.fat')}</TableCell>
                  <TableCell>{meal.fat}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell variant="head">{t('food.portionAmount')}</TableCell>
                  <TableCell>{meal.portionAmount}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell variant="head">{t('food.url')}</TableCell>
                  <TableCell>{meal.url}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        <TabPanel value={tabIndex} index={1}>
          {meal.ingredients?.length > 0 ? (
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
                  {meal.ingredients?.map((ingredient, index) =>
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
          {meal.recipe?.length > 0 ? (
            meal.recipe.map((recipeRow, index) => <div key={index}>{recipeRow}</div>)
          ) : (
            <Typography>{t('food.noRecipes')}</Typography>
          )}
        </TabPanel>

      </Item>
  );
}