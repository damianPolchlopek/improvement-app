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
          daily: "Daily"
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
          trainingView: "Training View"
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
          daily: "Dzienny"
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
          trainingView: "Widok treningów"
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
