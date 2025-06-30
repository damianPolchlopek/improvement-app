// SnackbarContext.jsx
import { createContext, useReducer, useContext } from 'react';
import Snackbar from './Snackbar';

const SnackbarContext = createContext();

const initialState = {
  open: false,
  message: '',
  severity: 'info'
};

function snackbarReducer(state, action) {
  switch (action.type) {
    case 'OPEN_SNACKBAR':
      return {
        ...state,
        open: true,
        message: action.message,
        severity: action.severity || 'info'
      };
    case 'CLOSE_SNACKBAR':
      return {
        ...state,
        open: false
      };
    default:
      return state;
  }
}

export default function SnackbarProvider({ children }) {
  const [state, dispatch] = useReducer(snackbarReducer, initialState);

  const showSnackbar = (message, severity = 'info') => {
    dispatch({ type: 'OPEN_SNACKBAR', message, severity });
  };

  const hideSnackbar = () => {
    dispatch({ type: 'CLOSE_SNACKBAR' });
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar, hideSnackbar }}>
      {children}
      <Snackbar
        open={state.open}
        severity={state.severity}
        onClose={hideSnackbar}  
        message={state.message}
      />
    </SnackbarContext.Provider>
  );
}

export function useSnackbar() {
  return useContext(SnackbarContext);
}