import React, {useEffect, useState, useCallback} from 'react';
import REST from '../../utils/REST';
import CenteredContainer from '../../component/CenteredContainer';
import StyledTableCell from '../../component/table/StyledTableCell';
import StyledTableRow from '../../component/table/StyledTableRow';
import { useTranslation } from 'react-i18next';

import PropTypes from 'prop-types';

import {
  Box, 
  Paper,
  Tab,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  Tabs,
  TextField
} from '@mui/material';

import Grid from '@mui/material/Unstable_Grid2';


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
        <Box sx={{p: 3}}>
          {children}
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

export default function ProductView() {
  const [productList, setProductList] = useState([]);
  const [productCategoryList, setProductCategoryList] = useState([]);
  const miesoTabIndex = 0;
  const [tabIndex, setTabIndex] = useState(miesoTabIndex);
  const [typedProductName, setTypedProductName] = useState(' ');
  const [category, setCategory] = useState('ALL');
  const { t } = useTranslation();

  const handleClickOnTab = useCallback((newCategory) => {
    REST.getProductFiltredByCategoryAndName(newCategory, typedProductName).then(response => {
      setProductList(response.entity);
    });

    setCategory(newCategory);
  }, [typedProductName]);

  useEffect(() => {
    REST.getProductCategoryList().then(response => {
      setProductCategoryList(response.entity);
      if (response.entity.length > 0) {
        handleClickOnTab(response.entity[0]);
      }
    });
  }, [handleClickOnTab]);

  useEffect(() => {
    REST.getProductFiltredByCategoryAndName(category, typedProductName).then(response => {
      setProductList(response.entity);
    });
  }, [category, typedProductName]);

  const handleChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const handleProductTyped = (e) => {
    setTypedProductName(e.target.value)

    REST.getProductFiltredByCategoryAndName(category, e.target.value).then(response => {
      setProductList(response.entity);
    });
  }

  return (
    <CenteredContainer>

      <Grid container sx={{width: '70%'}} spacing={2}>
        <Grid xs={12}>
          <CenteredContainer>
            <TextField
              sx={{width: '40%'}}
              onChange={(e) => handleProductTyped(e)}
              label={t('food.product')}
            />
          </CenteredContainer>

        </Grid>

        <Grid sx={{height: '30px'}} xs={12}>

        </Grid>

        <Grid xs={12}>
          <Paper>
          <Tabs
            value={tabIndex}
            onChange={handleChange}
            indicatorColor="secondary"
            textColor="inherit"
            variant="fullWidth"
            aria-label="full width tabs example"
          >
            {productCategoryList.map((productCategory, index) =>
              <Tab
                key={index}
                label={productCategory}
                {...a11yProps(0)}
                onClick={() => handleClickOnTab(productCategoryList[index])}
              />
            )}
          </Tabs>

          {productCategoryList.map((productCategory, index) =>
            <TabPanel key={index} value={tabIndex} index={index} component={'span'}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <StyledTableRow>
                      <StyledTableCell>{t('food.name')}</StyledTableCell>
                      <StyledTableCell>{t('food.kcal')}</StyledTableCell>
                      <StyledTableCell>{t('food.protein')}</StyledTableCell>
                      <StyledTableCell>{t('food.carbs')}</StyledTableCell>
                      <StyledTableCell>{t('food.fat')}</StyledTableCell>
                      <StyledTableCell>{t('food.amount')}</StyledTableCell>
                      <StyledTableCell>{t('food.unit')}</StyledTableCell>
                    </StyledTableRow>
                  </TableHead>

                  <TableBody>
                    {productList ? productList.map(product => {
                      return <StyledTableRow
                        key={product.id}
                        sx={{'&:last-child td, &:last-child th': {border: 0}}}
                      >
                        <StyledTableCell>{product.name}</StyledTableCell>
                        <StyledTableCell>{product.kcal}</StyledTableCell>
                        <StyledTableCell>{product.protein}</StyledTableCell>
                        <StyledTableCell>{product.carbohydrates}</StyledTableCell>
                        <StyledTableCell>{product.fat}</StyledTableCell>
                        <StyledTableCell>{product.amount}</StyledTableCell>
                        <StyledTableCell>{product.unit}</StyledTableCell>
                      </StyledTableRow>
                    }) : null}
                  </TableBody>

                </Table>
              </TableContainer>
            </TabPanel>
          )}
          </Paper>
        </Grid>


      </Grid>
    </CenteredContainer>
  );
}