import React, { useState, useEffect } from 'react';
import REST from '../utils/REST';
import './ShoppingListView.css';

export default function ShoppingListView() {
  const [shoppingList, setShoppingList] = useState([]);
  const [allCategoryTypes, setAllCategoryTypes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState();
  const [item, setItem] = useState({name: '', category: 'SklepSpożywczy'});
    
  useEffect(() => {
    REST.getShoppingList().then(response => {
        setShoppingList(response.entity);
    });

    REST.getAllCategoryProducts().then(response => {
      setAllCategoryTypes(response.entity);
      setSelectedCategory(response.entity[1])
    });

  }, []);

  function loadProductsFromSelectedCategory(){
    REST.getShoppingListByCategory(selectedCategory).then(response => {
      setShoppingList(response.entity);
    });
  }

  function deleteProductFromShoppingList(productId){
    REST.deleteProductFromShoppingList(productId).then(response => {
      window.location.reload();
    });
  }

  function addProductToShoppingList(){
    REST.addProductToShoppingList(item).then(response => {
      window.location.reload();
    });
  }

  return (
    <React.Fragment>
      {allCategoryTypes.length > 3 ? 
      <div className='training-list'>

        <h2> Choose Category </h2>
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

        <h2>Add Products</h2>
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

        <h2>Shopping List</h2>
          {shoppingList.map(product => {
            return <div>
                {product.name}
                <button onClick={() => {deleteProductFromShoppingList(product.id)}}>Delete</button>
              </div>
            })}
      </div> : null}
    </React.Fragment>
  );
  
}