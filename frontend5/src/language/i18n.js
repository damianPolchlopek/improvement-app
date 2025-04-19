import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        welcome: "Welcome to our app!",
        exercise: {
          reps: "Reps",
          weight: "Weight",
          date: "Date",
          trainingType: "Training Type",
          name: "Name",
          progress: "Progress",
          place: "Place",
          type: "Type"
        },
        menu: {
          home: "Home",
          exercises: "Exercises",
          settings: "Settings",
          view: "View",
          training: "Training",
          maximum: "Maximum",
          add: "Add",
          statistic: "Statistic",
          food: "Food",
          product: "Product",
          finance: "Finance",
          information: "Information",
          shopping: "Shopping",
          other: "Other",
          weekly: "Weekly",
          daily: "Daily",
          ticTacTao: "Tic Tac Toe",
          timerChallenge: "Timer Challenge",
          management: "Management",
          projects: "Projects",
          vacations: "Vacations"
        },
        chart: {
          date: "Date",
          value: "Value",
          chartType: "Chart Type",
          exerciseName: "Exercise Name",
          beginDate: "Begin Date",
          endDate: "End Date"
        },
        messages: {
          add: "Add",
          remove: "Remove",
          submit: "Submit",
          loading: "Loading...",
          loadLastTraining: "Load Last Training",
          enableMoreAccurateForm: "Enable a more accurate form",
          trainingSchema: "Training Schema",
          trainingView: "Training View",
          submitting: "Submitting..."
        },
        common: {
          cancel: "Cancel",
          delete: "Delete",
          areYouSure: "Are you sure?",
        },
        header: {
          logout: "Logout"
        },
        home: {
          initTrainingModule: "Init Training Module",
          initFoodModule: "Init Food Module"
        },
        login: {
          loginPanel: "Login Panel",
          username: "Username",
          password: "Password",
          submit: "Submit"
        },
        signup: {
          title: "Sign Up",
          alreadyHaveAccount: "Already have an account?",
          login: "Log in",
          username: "Username",
          email: "Email",
          password: "Password",
          confirmPassword: "Confirm Password",
          signUp: "Sign Up",
          usernameError: "Please enter a valid username!",
          emailError: "Please enter a valid email!",
          passwordError: "Password should have minimum 4 characters!",
          confirmPasswordError: "Passwords must be the same!"
        },
        mealFilter: {
          mealPopularity: "Meal Popularity",
          all: "ALL",
          popular: "Popular",
          rare: "Rare"
        },
        food: {
          kcal: "Kcal",
          protein: "Protein",
          carbs: "Carbs",
          fat: "Fat",
          name: "Name",
          all: "All",
          lunch: "Lunch",
          breakfast: "Breakfast",
          hotDish: "Hot Dish",
          sweets: "Sweets",
          dinner: "Dinner",
          other: "Other",
          high: "High",
          low: "Low",
          mealsTable: {
            mealName: "Meal Name",
            calories: "Calories",
            quantity: "Quantity",
            totalCalories: "Total Calories"
          },
          meal: "Meal",
          mealCategory: "Meal Category",
          mealType: "Meal Type",
          summary: "Summary",
          products: "Products",
          recipes: "Recipes",
          portionAmount: "Portion Amount",
          url: "URL",
          amount: "Amount",
          unit: "Unit",
          noProducts: "No products available",
          noRecipes: "No recipes available",
          product: "Product",
          dietStatisticTableRow: "Diet Statistic Table Row",
          date: "Date",
          saveDietDay: "Save Diet Day",
          addDietDayView: "Add Diet Day View",
          dietSavedSuccessfully: "Diet summary saved successfully!",
          failedAddDietSummary: "Failed to save the diet summary!",
          deleteConfirmation: "Do you really want to delete this item? This action cannot be undone.",
          actions: "Actions"
        }
      }
    },
    pl: {
      translation: {
        welcome: "Witaj w naszej aplikacji!",
        exercise: {
          reps: "Powtórzenia",
          weight: "Ciężar",
          date: "Data",
          trainingType: "Typ treningu",
          name: "Nazwa",
          progress: "Postęp",
          place: "Miejsce",
          type: "Typ"
        },
        menu: {
          home: "Strona główna",
          exercises: "Ćwiczenia",
          settings: "Ustawienia",
          view: "Widok",
          training: "Trening",
          maximum: "Maksimum",
          add: "Dodaj",
          statistic: "Statystyka",
          food: "Jedzenie",
          product: "Produkt",
          finance: "Finanse",
          information: "Informacje",
          shopping: "Zakupy",
          other: "Inne",
          weekly: "Tygodniowy",
          daily: "Dzienny",
          ticTacTao: "Kółko i Krzyżyk",
          timerChallenge: "Wyzwanie Czasowe",
          management: "Zarządzanie",
          projects: "Projekty",
          vacations: "Urlopy"
        },
        chart: {
          date: "Data",
          value: "Wartość",
          chartType: "Typ Wykresu",
          exerciseName: "Nazwa ćwiczenia",
          beginDate: "Data startowa",
          endDate: "Data zakończenia"
        },
        messages: {
          add: "Dodaj",
          remove: "Usuń",
          submit: "Wyślij",
          loading: "Ładowanie...",
          loadLastTraining: "Wczytaj ostatni trening",
          enableMoreAccurateForm: "Włącz dokładnieszy formularz",
          trainingSchema: "Schemat Treningu",
          trainingView: "Widok treningów",
          submitting: "Wysyłanie..."
        },
        common: {
          cancel: "Anuluj",
          delete: "Usuń",
          areYouSure: "Czy jesteś pewien?",
        },
        header: {
          logout: "Wyloguj się"
        },
        home: {
          initTrainingModule: "Zainicjuj moduł treningowy",
          initFoodModule: "Zainicjuj moduł żywnościowy"
        },
        login: {
          loginPanel: "Panel logowania",
          username: "Nazwa użytkownika",
          password: "Hasło",
          submit: "Zatwierdź"
        },
        signup: {
          title: "Zarejestruj się",
          alreadyHaveAccount: "Masz już konto?",
          login: "Zaloguj się",
          username: "Nazwa użytkownika",
          email: "Email",
          password: "Hasło",
          confirmPassword: "Potwierdź hasło",
          signUp: "Zarejestruj się",
          usernameError: "Proszę podać prawidłową nazwę użytkownika!",
          emailError: "Proszę podać prawidłowy email!",
          passwordError: "Hasło powinno mieć co najmniej 4 znaki!",
          confirmPasswordError: "Hasła muszą być takie same!"
        },
        food: {
          kcal: "Kcal",
          protein: "Białko",
          carbs: "Węglowodany",
          fat: "Tłuszcz",
          name: "Nazwa",
          all: "Wszystkie",
          lunch: "Obiad",
          breakfast: "Śniadanie",
          hotDish: "Ciepły Posiłek",
          sweets: "Słodycze",
          dinner: "Kolacja",
          other: "Inne",
          high: "Wysoka",
          low: "Niska",
          meal: "Posiłek",
          mealCategory: "Kategoria posiłku",
          mealType: "Typ posiłku",
          summary: "Podsumowanie",
          products: "Produkty",
          recipes: "Przepisy",
          portionAmount: "Ilość porcji",
          url: "URL",
          amount: "Ilość",
          unit: "Jednostka",
          noProducts: "Brak dostępnych produktów",
          noRecipes: "Brak dostępnych przepisów",
          product: "Produkt",
          dietStatisticTableRow: "Wiersz statystyki diety",
          date: "Data",
          saveDietDay: "Zapisz dzień diety",
          addDietDayView: "Widok dodawania dnia diety",
          mealPopularity: "Popularność posiłków",
          popular: "Popularne",
          rare: "Rzadkie",
          dietSavedSuccessfully: "Dieta zapisana pomyślnie!",
          failedAddDietSummary: "Nie udało się zapisać podsumowania diety!",
          deleteConfirmation: "Czy na pewno chcesz usunąć ten element? Tej operacji nie można cofnąć.",
          actions: "Akcje"
        }
      }
    }
  },
  lng: "en", // default language
  fallbackLng: "pl",
  interpolation: {
    escapeValue: false // react already safeguards from XSS
  }
});

export default i18n;
