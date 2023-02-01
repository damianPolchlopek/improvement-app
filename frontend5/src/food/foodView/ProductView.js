import React, { useState, useEffect } from 'react';
import REST from '../../utils/REST';

import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

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
  const [tabIndex, setTabIndex] = React.useState(0);
    
  useEffect(() => {

    REST.getProductCategoryList().then(response => {
      setProductCategoryList(response.entity);   
      handleClickOnTab(response.entity[0]); 
    });

  }, []);

  const handleChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const handleClickOnTab = (category) => {
    REST.getProductList(category).then(response => {
      setProductList(response.entity);
    });
  }

  return (
    <React.Fragment>
      <Box sx={{ width: '100%' }}>
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
      </Box> 
    </React.Fragment>
  );
}