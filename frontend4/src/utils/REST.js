import axios from "axios";
import Cookies from 'universal-cookie';

// const serverUrl = "https://improvement-app-backend.herokuapp.com/";
// static BASE_URL = "http://localhost:8080/";
const serverUrl = 'http://localhost:8080/';
const exercise = 'exercise/';
const drive = 'drive/';
const shopping = 'shopping/'
const food = 'food/'

const get = (url) => {
    return axios.get(url).then((response) => {
        console.log(response)
        return response.data;
    });
}

const post = (url, data) => {
    return axios.post(url, data).then((response) => {
        return response.data;
    })
}

const deleteMethod = (url) => {
    return axios.delete(url).then((response) => {
        console.log(response)
        return response.data;
    });
}

// axios.interceptors.request.use(
//     (req) => {
//       const cookies = new Cookies();
//       req.headers.common.Authorization = cookies.get('authorization');
//        return req;
//     },
//     (err) => {
//        return Promise.reject(err);
//     }
//   );

export default class REST {
    // Training module
    static getAllTrainingNames() {
        return get(serverUrl + exercise + 'getTrainingNames');
    }

    static getExercises(trainingName) {
        return get(serverUrl + exercise + 'getExercise/trainingName/' + trainingName);
    }

    static getExerciseNames(){
        return get(serverUrl + exercise + 'getExerciseNames');
    }

    static getExercisePlaces(){
        return get(serverUrl + exercise + 'getExercisePlaces');
    }

    static getExerciseProgresses(){
        return get(serverUrl + exercise + 'getExerciseProgresses');
    }

    static getExerciseTypes(){
        return get(serverUrl + exercise + 'getExerciseTypes');
    }

    static getExercisesByDate(date){
        return get(serverUrl + exercise + 'getExercise/date/' + date);
    }

    static getExercisesByName(name){
        return get(serverUrl + exercise + 'getExercise/name/' + name);
    }

    static getTrainingByType(type){
        return get(serverUrl + exercise + 'getLastTypeTraining/' + type);
    }

    static addTraining(data){
        return post(serverUrl + exercise + 'addTraining', data);
    }

    static loginUser(user){
        return post(serverUrl + 'api/auth/signin', user);
    }
    
    static initTrainingModule(){
        return get(serverUrl + drive + 'initApplication');
    }

    static getShoppingList(){
        return get(serverUrl + shopping + 'showList');
    }

    static getAllCategoryProducts(){
        return get(serverUrl + shopping + 'getAllCategoryType');
    }



    // Shopping module
    static getShoppingListByCategory(category){
        return get(serverUrl + shopping + 'getShoppingList/' + category);
    }

    static deleteProductFromShoppingList(productId){
        return deleteMethod(serverUrl + shopping + 'deleteItem/' + productId);
    }

    static addProductToShoppingList(product){
        return post(serverUrl + shopping + 'addItem', product);
    }





    // Food module
    static initFoodModule(){
        return get(serverUrl + drive + 'initFoodModule');
    }

    static getProductList(productCategory){
        return get(serverUrl + food + 'getProducts/' + productCategory);
    }

    static getProductCategoryList(){
        return get(serverUrl + food + 'getProductCategories');
    }

    static getMealList(){
        return get(serverUrl + food + 'getMeals');
    }

    static getMealList(mealCategory, mealType){
        return get(serverUrl + food + 'getMeals/' + mealCategory + '/' + mealType);
    }

    static getMealCategoryList(){
        return get(serverUrl + food + 'getMealCategories');
    }

    static getMealTypeList(){
        return get(serverUrl + food + 'getMealTypes');
    }


}