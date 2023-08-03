import React, { useState, useEffect } from 'react';
import REST from '../utils/REST';
import PropTypes from 'prop-types';

import { 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,

  Tabs,
  Tab,
  Box,

  TextField 
} from '@mui/material';

import CenteredContainer from '../component/CenteredContainer';
import Grid from '@mui/material/Unstable_Grid2';


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
    
  useEffect(() => {
    REST.getProductCategoryList().then(response => {
      setProductCategoryList(response.entity);   
      handleClickOnTab(response.entity[0]); 
    });

    REST.getProductFiltredByCategoryAndName(category, typedProductName).then(response => {
      setProductList(response.entity);
    });

  }, []);

  const handleChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const handleClickOnTab = (newCategory) => {
    REST.getProductFiltredByCategoryAndName(newCategory, typedProductName).then(response => {
      setProductList(response.entity);
    });

    setCategory(newCategory);
  }

  const handleProductTyped = (e) => {
    setTypedProductName(e.target.value)

    REST.getProductFiltredByCategoryAndName(category, e.target.value).then(response => {
      setProductList(response.entity);
    });
  }

  return (
    <CenteredContainer>

      <Grid container sx={{ width: '70%'}} spacing={2}>
        <Grid xs={12}>
          <CenteredContainer>  
            <TextField  
              sx={{ width: '40%' }}  
              onChange={(e) => handleProductTyped(e)} 
              label="Product" 
            />
          </CenteredContainer>
          
        </Grid>

        <Grid sx={{height: '30px'}} xs={12}>

        </Grid>

        <Grid xs={12}>
          <Tabs 
            value={tabIndex} 
            onChange={handleChange} 
            indicatorColor="secondary"
            textColor="inherit"
            variant="fullWidth"
            aria-label="full width tabs example"
          >
            {productCategoryList ? productCategoryList.map((productCategory, index) => 
              <Tab 
                key={index} 
                label={productCategory} 
                {...a11yProps(0)} 
                onClick={() => handleClickOnTab(productCategoryList[index])}
              />
            ) : null}
          </Tabs>

          {productCategoryList.map((productCategory, index) => 
            <TabPanel key={index} value={tabIndex} index={index} component={'span'}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Kcal</TableCell>
                        <TableCell>Protein</TableCell>
                        <TableCell>Carbo</TableCell>
                        <TableCell>Fat</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Unit</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {productList ? productList.map(product => {
                      return <TableRow
                        key={product.name}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.kcal}</TableCell>
                        <TableCell>{product.protein}</TableCell>
                        <TableCell>{product.carbohydrates}</TableCell>
                        <TableCell>{product.fat}</TableCell>
                        <TableCell>{product.amount}</TableCell>
                        <TableCell>{product.unit}</TableCell>
                      </TableRow>
                    }) : null}
                  </TableBody>

                </Table>
              </TableContainer>
            </TabPanel>
          )} 
        </Grid>

      </Grid>
    </CenteredContainer>
  );
}