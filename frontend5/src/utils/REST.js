import axios from "axios";
import Cookies from 'universal-cookie';

// const serverUrl = "https://improvement-app-backend.herokuapp.com/";
// static BASE_URL = "http://localhost:8080/";
// const serverUrl = 'https://mutarexx.smallhost.pl:24568/';
const serverUrl = 'http://localhost:8080/';
const exercise = 'exercises/';
const dictionary = 'dictionary/';
const exerciseType = 'type';
const exerciseName = 'name';
const exerciseProgress = 'progress';
const exercisePlace = 'place';

const drive = 'drive/';
const shopping = 'shopping/';
const food = 'food/';
const weekly = 'weekly/';
const daily = 'daily/';
const finance = 'finance/';
const crypto = 'crypto/';

const statistic = 'statistic/';

// const axiosInstance = axios.create({
//     baseURL: 'https://mutarexx.smallhost.pl:24568',
//     httpsAgent: new (require('https').Agent)({
//       rejectUnauthorized: false, // Ignorowanie błędów certyfikatu
//     }),
//   });

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

axios.interceptors.request.use(
    (req) => {
        const cookies = new Cookies();
        req.headers.Authorization = cookies.get('authorization');
        return req;
    },
    (err) => {
        console.log('Cookies error')
        return Promise.reject(err);
    }
);

export default class REST {
    // Training module
    static getAllTrainingNames(page, size) {
        return get(serverUrl + exercise + 'trainingName?page=' + page + '&size=' + size);
    }

    static getExercises(trainingName) {
        return get(serverUrl + exercise + 'trainingName/' + trainingName);
    }

    static getExercisesByDate(date) {
        return get(serverUrl + exercise + 'date/' + date);
    }

    static getExercisesByName(name) {
        return get(serverUrl + exercise + 'name/' + name);
    }

    static getExerciseNames() {
        return get(serverUrl + exercise + dictionary + exerciseName);
    }

    static getExercisePlaces() {
        return get(serverUrl + exercise + dictionary + exercisePlace);
    }

    static getExerciseProgresses() {
        return get(serverUrl + exercise + dictionary + exerciseProgress);
    }

    static getExerciseTypes() {
        return get(serverUrl + exercise + dictionary + exerciseType);
    }

    static getTrainingTemplate(type) {
        return get(serverUrl + exercise + dictionary + 'training/' + type);
    }


    static initTrainingModule() {
        return get(serverUrl + drive + 'initApplication');
    }


    static getTestStatistic(exerciseName) {
        return get(serverUrl + exercise + statistic + 'capacity/statistic/' + exerciseName);
    }

    static getTrainingStatistic(exerciseName, chartType, beginDate, endDate) {
        return get(serverUrl + exercise + statistic + exerciseName + '/' + chartType + '/' + beginDate + '/' + endDate);
    }

    static getATHTraining(type) {
        return get(serverUrl + exercise + 'training/' + type + '/maximum');
    }

    static getTrainingTemplateByType(type) {
        return get(serverUrl + exercise + 'trainingType/' + type);
    }

    static getTrainingByType(type, page, size) {
        return get(serverUrl + exercise + 'training/' + type + '?page=' + page + '&size=' + size);
    }

    static addTraining(data) {
        return post(serverUrl + exercise + "addTraining", data);
    }


    // Food module
    static initFoodModule() {
        return get(serverUrl + drive + 'initFoodModule');
    }

    static getProductFiltredByCategoryAndName(productCategory, productName) {
        return get(serverUrl + food + 'product?productCategory=' + productCategory + "&productName=" + productName);
    }

    static getProductCategoryList() {
        return get(serverUrl + food + 'product/categories');
    }

    //mealCategory=All&mealType=All&mealName=&mealPopularity=&sortBy=
    static getMealList(mealCategory, mealType, mealName, mealPopularity, sortBy) {
        return get(serverUrl + food + 'meal?mealCategory=' + mealCategory + '&mealType=' + mealType + "&mealName=" + mealName
                                            + "&mealPopularity=" + mealPopularity + "&sortBy=" + sortBy);
    }

    static getMealCategoryList() {
        return get(serverUrl + food + 'meal/categories');
    }

    static getMealTypeList() {
        return get(serverUrl + food + 'meal/types');
    }

    static calculateDiet(selectedMealsId) {
        return post(serverUrl + food + 'diet/calculate', selectedMealsId);
    }

    static addDietSummary(selectedMealsId) {
        return post(serverUrl + food + 'diet/save-diet-day', selectedMealsId);
    }

    static checkProduct(selectedMeals) {
        return post(serverUrl + food + 'diet/sum-product', selectedMeals);
    }

    static getDietSummaries(page, size) {
        return get(serverUrl + food + 'diet/day-summary?page=' + page + '&size=' + size);
    }



    // Shopping module
    static getShoppingListByCategory(category) {
        return get(serverUrl + shopping + 'category/' + category);
    }

    static deleteProductFromShoppingList(productId) {
        return deleteMethod(serverUrl + shopping + productId);
    }

    static addProductToShoppingList(product) {
        return post(serverUrl + shopping, product);
    }

    static getAllCategoryProducts() {
        return get(serverUrl + shopping + 'categories');
    }


    // Weekly module
    static getWeeklyListByCategory(category) {
        return get(serverUrl + weekly + category);
    }

    static deleteProductFromWeeklyList(productId) {
        return deleteMethod(serverUrl + weekly + productId);
    }

    static addProductToWeeklyList(product) {
        return post(serverUrl + weekly, product);
    }

    static getAllCategoryWeeklyRecords() {
        return get(serverUrl + weekly + 'categories');
    }


    // daily
    static getDaily() {
        return get(serverUrl + daily);
    }

    static deleteDaily(id) {
        return deleteMethod(serverUrl + daily + id);
    }

    static addDaily(data) {
        return post(serverUrl + daily, data);
    }


    //finance
    static getFinanceCryptoPrice(coins, currency) {
        return get(serverUrl + finance + crypto + "price" + "/" + coins + "/" + currency);
    }

    static getFinanceCryptoDescription() {
        return get(serverUrl + finance + crypto + "description");
    }


    // Login module
    static loginUser(user) {
        return post(serverUrl + 'api/auth/signin', user);
    }
}