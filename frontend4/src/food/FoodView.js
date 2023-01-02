import React, { useState, useEffect } from 'react';
import REST from '../utils/REST';

import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TrainingsView from '../training/trainingView/TrainingsView';


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
  const [productList, setProductList] = useState([]);
  const [allCategoryTypes, setAllCategoryTypes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState();
  const [item, setItem] = useState({name: '', category: 'SklepSpożywczy'});
  const [isAddProductIsHidden, setIsAddProductIsHidden] = useState(false);
    
  useEffect(() => {
    REST.getProductList().then(response => {
        setProductList(response.entity);
    });

    REST.getAllCategoryProducts().then(response => {
      setAllCategoryTypes(response.entity);
      setSelectedCategory(response.entity[1])
    });

  }, []);

  // function loadProductsFromSelectedCategory(){
  //   REST.getShoppingListByCategory(selectedCategory).then(response => {
  //     setShoppingList(response.entity);
  //   });
  // }

//   function deleteProductFromShoppingList(productId){
//     REST.deleteProductFromShoppingList(productId).then(response => {
//       window.location.reload();
//     });
//   }

//   function addProductToShoppingList(){
//     REST.addProductToShoppingList(item).then(response => {
//       window.location.reload();
//     });
//   }

//   function changeAddProductState(){
//     var tmpState = isAddProductIsHidden
//     setIsAddProductIsHidden(!tmpState);
//   }


const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


  return (
    <React.Fragment>
       <Box
      sx={{ flexGrow: 1, bgcolor: '#202c34', display: 'flex', height: 500 }}
    >
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        sx={{ borderRight: 1, borderColor: 'divider' }}
      >
        <Tab label="Item one" {...a11yProps(0)} />
        <Tab label="Item Two" {...a11yProps(1)} />
        <Tab label="Item Three" {...a11yProps(2)} />
        <Tab label="Item Four" {...a11yProps(3)} />
        <Tab label="Item Five" {...a11yProps(4)} />
        <Tab label="Item Six" {...a11yProps(5)} />
        <Tab label="Item Seven" {...a11yProps(6)} />
      </Tabs>
      <TabPanel value={value} index={0}>
        sss
        {/* <TrainingsView /> */}
      </TabPanel>
      <TabPanel value={value} index={1}>
        Item Two
      </TabPanel>
      <TabPanel value={value} index={2}>
        Item Three
      </TabPanel>
      <TabPanel value={value} index={3}>
        Item Four
      </TabPanel>
      <TabPanel value={value} index={4}>
        Item Five
      </TabPanel>
      <TabPanel value={value} index={5}>
        Item Six
      </TabPanel>
      <TabPanel value={value} index={6}>
        Item Seven
      </TabPanel>
      
</Box>

      {productList ? 
      <div className='training-list'>

        {/* <h2> Choose Category </h2>
        <select name='type' 
                onChange={(e => setSelectedCategory(e.target.value))}
                defaultValue={allCategoryTypes[1]}>
          {allCategoryTypes ? allCategoryTypes.map(exerciseType => {
            return(
              <option key={exerciseType.type} value={exerciseType.type}>
                {exerciseType}
              </option>
            );
          }) : null}
        </select>
        <button onClick={() => {loadProductsFromSelectedCategory()}}>Load Shopping List</button>

        <h2 onClick={() => changeAddProductState()}>Add Products</h2>
        <div className="add-shopping-list">
          <div hidden={isAddProductIsHidden}>
            <div>
              <label>Name: </label>
              <input defaultValue={item.name}
                    onChange={(e)=> setItem({name: e.target.value, category: item.category})}></input>
            </div>
            <div>
              <label>Category: </label>
              <select name='item.category' defaultValue={allCategoryTypes[1]} 
                      onChange={(e)=> setItem({name: item.name, category: e.target.value})}>
                {allCategoryTypes ? allCategoryTypes.map(categoryType => {
                  return(
                    <option key={categoryType} value={categoryType}>
                      {categoryType}
                    </option>
                  );
                }) : null}
              </select>
            </div>
            <button onClick={() => addProductToShoppingList()}>Add Product</button>
          </div>
        </div> */}

        <h2>Product List</h2>
        <div>
          {productList.map(product => {
            return <div className="shopping-list" key={product.id}>
                <span className="span-element">{product.name}</span>
                {/* <button onClick={() => {deleteProductFromShoppingList(product.id)}}>Delete</button> */}
              </div>
            })}
        </div>
      </div> : null}
    </React.Fragment>
  );
  
}