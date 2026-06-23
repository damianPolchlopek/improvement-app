import axios from 'axios';
import { QueryClient } from '@tanstack/react-query';
import { LoginUrl } from './URLHelper';

export const queryClient = new QueryClient();

// const serverUrl = "https://improvement-app-backend.herokuapp.com/";
// static BASE_URL = "http://localhost:8080/";
// const serverUrl = 'https://mutarexx.smallhost.pl:24568/';
const serverUrl = import.meta.env.VITE_API_URL;
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

// Przeglądarka automatycznie wysyła httpOnly cookies przy każdym requeście
axios.defaults.withCredentials = true;
axios.defaults.timeout = 60000;

// === Interceptor 401: automatyczne odświeżenie tokenu albo wylogowanie ===
// Frontend nie widzi httpOnly cookie z JWT — gdy backend odrzuci request (401),
// próbujemy raz odświeżyć sesję i ponowić; jeśli się nie uda, sprowadzamy front
// do stanu "wylogowany" (koniec rozjazdu sessionStorage ↔ realna sesja na backendzie).
let isRefreshing = false;
let pendingRequests = [];

const flushQueue = (error) => {
  pendingRequests.forEach(({ resolve, reject }) => (error ? reject(error) : resolve()));
  pendingRequests = [];
};

const forceLogout = () => {
  sessionStorage.removeItem('isLoggedIn');
  sessionStorage.removeItem('accessTokenExpiresAt');
  sessionStorage.removeItem('refreshTokenExpiresAt');
  sessionStorage.removeItem('role');
  // Interceptor żyje poza Reactem → twarde przekierowanie na login
  if (!window.location.pathname.startsWith(LoginUrl)) {
    window.location.assign(LoginUrl);
  }
};

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { response, config } = error;

    // Brak odpowiedzi (sieć/timeout) lub status inny niż 401 → przepuść dalej
    if (!response || response.status !== 401 || !config) {
      return Promise.reject(error);
    }

    // Endpointy auth (signin/refresh/logout/...) obsługują 401 same → nie odświeżaj
    if (config.url?.includes('api/auth/')) {
      return Promise.reject(error);
    }

    // Ten request już raz ponawialiśmy → nie zapętlaj
    if (config._retry) {
      return Promise.reject(error);
    }
    config._retry = true;

    // Jeśli odświeżanie już trwa, poczekaj na jego wynik i ponów request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingRequests.push({ resolve, reject });
      }).then(() => axios(config));
    }

    isRefreshing = true;
    try {
      const { data } = await axios.post(serverUrl + 'api/auth/refresh-token', {});
      // Zaktualizuj lokalny zapis czasu wygaśnięcia (bookkeeping front-endu)
      if (data?.accessTokenExpiresAt) {
        sessionStorage.setItem('accessTokenExpiresAt', data.accessTokenExpiresAt.toString());
      }
      flushQueue(null);
      return axios(config); // ponów oryginalny request — nowe cookie jest już ustawione
    } catch (refreshError) {
      flushQueue(refreshError);
      forceLogout();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

const get = (url) => axios.get(url).then((r) => r.data);
const post = (url, data) => axios.post(url, data).then((r) => r.data);
const put = (url, data) => axios.put(url, data).then((r) => r.data);
const deleteMethod = (url) => axios.delete(url).then((r) => r.data);

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

  // Najświeższe reps/weight dla danej nazwy ćwiczenia (podpowiedź "ostatnio").
  // Reużywa istniejącego /name/{name} (zwraca historię od najnowszej) i bierze pierwszy wpis;
  // brak historii zwraca 404 -> traktujemy jako brak danych.
  static getLastExerciseByName(name) {
    return get(serverUrl + exercise + 'name/' + name)
      .then((res) => res?.content?.[0] ?? null)
      .catch(() => null);
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
    return get(
      serverUrl +
        exercise +
        statistic +
        exerciseName +
        '/' +
        chartType +
        '/' +
        beginDate +
        '/' +
        endDate
    );
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
    return post(serverUrl + exercise + 'addTraining', data);
  }

  // Food module
  static initFoodModule() {
    return get(serverUrl + drive + 'initFoodModule');
  }

  static getProductFiltredByCategoryAndName(productCategory, productName) {
    return get(
      serverUrl +
        food +
        'product?productCategory=' +
        productCategory +
        '&productName=' +
        productName
    );
  }

  static getProductCategoryList() {
    return get(serverUrl + food + 'product/categories');
  }

  //mealCategory=All&mealType=All&mealName=&mealPopularity=&sortBy=
  static getMealList(mealCategory, mealType, mealName, mealPopularity, sortBy, onOnePortion) {
    return get(
      serverUrl +
        food +
        'meal?mealCategory=' +
        mealCategory +
        '&mealType=' +
        mealType +
        '&mealName=' +
        mealName +
        '&mealPopularity=' +
        mealPopularity +
        '&sortBy=' +
        sortBy +
        '&onOnePortion=' +
        onOnePortion
    );
  }

  static getMealIngredients(mealId) {
    return get(serverUrl + food + 'meal/' + mealId + '/ingredients');
  }

  static getMealCategoryList() {
    return get(serverUrl + food + 'meal/categories');
  }

  static getMealTypeList() {
    return get(serverUrl + food + 'meal/types');
  }

  static calculateDiet(selectedMeals) {
    return post(serverUrl + food + 'macro/calculate', selectedMeals);
  }

  static createDietSummary(selectedMealsId) {
    return post(serverUrl + food + 'diet/day-summary', selectedMealsId);
  }

  static recalculateMealMacro(selectedMeal) {
    return post(serverUrl + food + 'macro/meal/recalculate', selectedMeal);
  }

  static getDietSummaries(page, size) {
    return get(serverUrl + food + 'diet/day-summary?page=' + page + '&size=' + size);
  }

  static deleteDietSummaries(id) {
    return deleteMethod(serverUrl + food + 'diet/day-summary/' + id);
  }

  static getDietSummariesById(id) {
    return get(serverUrl + food + 'diet/day-summary/' + id);
  }

  static updateDietSummary(updatedDietSummary) {
    return put(serverUrl + food + 'diet/day-summary', updatedDietSummary);
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

  static addRecordToWeeklyList(product) {
    return post(serverUrl + 'weekly', product);
  }

  static getAllCategoryWeeklyRecords() {
    return get(serverUrl + weekly + 'categories');
  }

  // daily
  static getDaily(page, size) {
    return get(serverUrl + 'daily?page=' + page + '&size=' + size);
  }

  static deleteDaily(id) {
    return deleteMethod(serverUrl + daily + id);
  }

  static addDaily(data) {
    return post(serverUrl + daily, data);
  }

  //finance
  static getFinanceCryptoPrice(coins, currency) {
    return get(serverUrl + finance + crypto + 'price/' + coins + '/' + currency);
  }

  static getFinanceCryptoDescription() {
    return get(serverUrl + finance + crypto + 'description');
  }

  // Login module
  static loginUser(user) {
    return post(serverUrl + 'api/auth/signin', user);
  }

  static registerUser(user) {
    return post(serverUrl + 'api/auth/signup', user);
  }

  static refreshTokenRequest() {
    // refresh_token jest wysyłany automatycznie jako httpOnly cookie
    return post(serverUrl + 'api/auth/refresh-token', {});
  }

  static logoutUser() {
    return post(serverUrl + 'api/auth/logout', {});
  }

  static verifyEmail(token) {
    return get(serverUrl + 'api/auth/verify-email?token=' + encodeURIComponent(token));
  }

  static resendVerificationEmail(username) {
    return post(serverUrl + 'api/auth/resend-verification', username);
  }

  // Audit
  static getRevisions(dietSummaryId) {
    return get(serverUrl + 'api/audit/diet-summary/' + dietSummaryId + '/revisions');
  }

  static getRevisionDetails(dietSummaryId, revisionNumber) {
    return get(serverUrl + 'api/audit/food/diet-summary/' + dietSummaryId + '/' + revisionNumber);
  }

  // compare?olderRevision=23&newerRevision=26
  static getRevisionComparsion(dietSummaryId, olderRevisionId, newerRevisionId) {
    return get(
      serverUrl +
        'api/audit/food/diet-summary/' +
        dietSummaryId +
        '/revisions/compare?olderRevision=' +
        olderRevisionId +
        '&newerRevision=' +
        newerRevisionId
    );
  }
}
