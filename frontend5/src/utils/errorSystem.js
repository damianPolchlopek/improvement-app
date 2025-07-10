// utils/errorSystem.js

// ===== KODY BŁĘDÓW I KOMUNIKATY =====

/**
 * Główny słownik błędów aplikacji
 * Każdy błąd ma kod, komunikaty UI i konfigurację
 */
export const ERROR_DEFINITIONS = {
  // Błędy autoryzacji
  'EMAIL_NOT_VERIFIED': {
    severity: 'warning',
    titleKey: 'login.errors.emailNotVerified.title',
    messageKey: 'login.errors.emailNotVerified.message',
    defaultTitle: 'Email not verified',
    defaultMessage: 'Please check your email and click the verification link.',
    showResendButton: true,
    category: 'auth'
  },
  'INVALID_CREDENTIALS': {
    severity: 'error',
    titleKey: 'login.errors.invalidCredentials.title',
    messageKey: 'login.errors.invalidCredentials.message',
    defaultTitle: 'Invalid credentials',
    defaultMessage: 'Please check your username and password.',
    showResendButton: false,
    category: 'auth'
  },
  'ACCOUNT_LOCKED': {
    severity: 'error',
    titleKey: 'login.errors.accountLocked.title',
    messageKey: 'login.errors.accountLocked.message',
    defaultTitle: 'Account locked',
    defaultMessage: 'Please contact administrator.',
    showResendButton: false,
    category: 'auth'
  },
  'FORBIDDEN': {
    severity: 'error',
    titleKey: 'login.errors.forbidden.title',
    messageKey: 'login.errors.forbidden.message',
    defaultTitle: 'Access denied',
    defaultMessage: 'You do not have permission to perform this operation.',
    showResendButton: false,
    category: 'auth'
  },
  'INVALID_TOKEN': {
    severity: 'error',
    titleKey: 'login.errors.invalidToken.title',
    messageKey: 'login.errors.invalidToken.message',
    defaultTitle: 'Authorization error',
    defaultMessage: 'Please try logging in again.',
    showResendButton: false,
    category: 'auth'
  },

  // Błędy walidacji
  'INVALID_INPUT': {
    severity: 'error',
    titleKey: 'login.errors.invalidInput.title',
    messageKey: 'login.errors.invalidInput.message',
    defaultTitle: 'Invalid input',
    defaultMessage: 'Please fill in all required fields.',
    showResendButton: false,
    category: 'validation'
  },

  // Błędy serwera
  'SERVER_ERROR': {
    severity: 'error',
    titleKey: 'login.errors.serverError.title',
    messageKey: 'login.errors.serverError.message',
    defaultTitle: 'Server error',
    defaultMessage: 'Please try again later or contact support.',
    showResendButton: false,
    category: 'server'
  },

  // Błędy sieci
  'NETWORK_ERROR': {
    severity: 'error',
    titleKey: 'login.errors.networkError.title',
    messageKey: 'login.errors.networkError.message',
    defaultTitle: 'Connection error',
    defaultMessage: 'Please check your internet connection.',
    showResendButton: false,
    category: 'network'
  },

  // Błędy ogólne
  'UNKNOWN_ERROR': {
    severity: 'error',
    titleKey: 'login.errors.generic.title',
    messageKey: 'login.errors.generic.message',
    defaultTitle: 'Application error',
    defaultMessage: 'An unexpected error occurred.',
    showResendButton: false,
    category: 'generic'
  }
};

/**
 * Mapowanie kodów HTTP na kody błędów aplikacji
 */
export const HTTP_ERROR_MAPPINGS = {
  401: 'INVALID_CREDENTIALS',
  403: 'FORBIDDEN', // Może być nadpisane przez serwer
  500: 'SERVER_ERROR',
  502: 'SERVER_ERROR',
  503: 'SERVER_ERROR',
  504: 'SERVER_ERROR'
};

/**
 * Komunikaty dla funkcji resend
 */
export const RESEND_MESSAGES = {
  error: {
    titleKey: 'login.resend.error.title',
    defaultTitle: 'Send error',
    noUsernameKey: 'login.errors.resend.noUsername',
    noUsernameDefault: 'Please enter your username/email',
    failedKey: 'login.errors.resend.failed',
    failedDefault: 'Failed to send verification email'
  },
  success: {
    titleKey: 'login.resend.success.title',
    messageKey: 'login.resend.success.message',
    defaultTitle: 'Email sent!',
    defaultMessage: 'Please check your email.'
  },
  button: {
    buttonKey: 'login.resend.button',
    sendingKey: 'login.resend.sending',
    buttonDefault: 'Send again',
    sendingDefault: 'Sending...'
  }
};

// ===== FUNKCJE HTTP ERROR HANDLING =====

/**
 * Główna funkcja obsługi błędów HTTP
 * @param {Error} error - Obiekt błędu z axios
 * @param {string} context - Kontekst błędu
 * @returns {object} Standardowy obiekt błędu aplikacji
 */
export const handleHttpError = (error, context = 'generic') => {
  console.error(`${context} failed:`, error);

  // Błąd sieci (brak response)
  if (!error.response) {
    return createErrorResponse('NETWORK_ERROR', null, context);
  }

  const { status, data } = error.response;

  // Obsługa błędu 403 - używamy danych z serwera jeśli dostępne
  if (status === 403) {
    const errorCode = data?.code || 'FORBIDDEN';
    return createErrorResponse(errorCode, data, context);
  }

  // Błędy serwera (5xx)
  if (status >= 500) {
    return createErrorResponse('SERVER_ERROR', data, context);
  }

  // Inne kody HTTP z mapowania
  const errorCode = HTTP_ERROR_MAPPINGS[status];
  if (errorCode) {
    return createErrorResponse(errorCode, data, context);
  }

  // Fallback dla nieznanych kodów HTTP
  return createErrorResponse('UNKNOWN_ERROR', { httpStatus: status }, context);
};

/**
 * Tworzy standardowy obiekt błędu
 * @param {string} code - Kod błędu aplikacji
 * @param {object} serverData - Dane z serwera
 * @param {string} context - Kontekst błędu
 * @returns {object} Obiekt błędu
 */
const createErrorResponse = (code, serverData = null, context = 'generic') => {
  return {
    error: {
      code,
      message: serverData?.message || ERROR_DEFINITIONS[code]?.defaultMessage || 'Unknown error',
      details: serverData?.details || null,
      timestamp: serverData?.timestamp || new Date().toISOString(),
      context,
      ...serverData // Dodatkowe dane z serwera
    }
  };
};

/**
 * Funkcja walidacji wymaganych pól
 * @param {object} data - Dane do walidacji
 * @param {Array} requiredFields - Lista wymaganych pól
 * @returns {object|null} Obiekt błędu lub null
 */
export const validateRequiredFields = (data, requiredFields) => {
  const missingFields = requiredFields.filter(field => !data[field]?.trim());
  
  if (missingFields.length > 0) {
    return {
      error: {
        code: 'INVALID_INPUT',
        message: `Missing required fields: ${missingFields.join(', ')}`,
        details: 'Please fill in all required fields',
        missingFields,
        timestamp: new Date().toISOString()
      }
    };
  }
  
  return null;
};

/**
 * Obsługa błędów walidacji tokena
 * @param {Error} error - Błąd walidacji tokena
 * @returns {object} Obiekt błędu
 */
export const handleTokenValidationError = (error) => {
  console.error('Token validation failed:', error);
  return createErrorResponse('INVALID_TOKEN', null, 'token_validation');
};

// ===== FUNKCJE UI/MESSAGES =====

/**
 * Pobiera informacje o błędzie dla UI
 * @param {string} code - Kod błędu
 * @param {function} t - Funkcja tłumaczenia
 * @returns {object} Informacje o błędzie
 */
export const getErrorInfo = (code, t) => {
  const errorDef = ERROR_DEFINITIONS[code] || ERROR_DEFINITIONS['UNKNOWN_ERROR'];
  
  return {
    severity: errorDef.severity,
    title: t(errorDef.titleKey, errorDef.defaultTitle),
    message: t(errorDef.messageKey, errorDef.defaultMessage),
    showResendButton: errorDef.showResendButton,
    category: errorDef.category
  };
};

/**
 * Pobiera komunikaty dla funkcji resend
 * @param {function} t - Funkcja tłumaczenia
 * @returns {object} Komunikaty resend
 */
export const getResendMessages = (t) => ({
  error: {
    title: t(RESEND_MESSAGES.error.titleKey, RESEND_MESSAGES.error.defaultTitle),
    noUsername: t(RESEND_MESSAGES.error.noUsernameKey, RESEND_MESSAGES.error.noUsernameDefault),
    failed: t(RESEND_MESSAGES.error.failedKey, RESEND_MESSAGES.error.failedDefault)
  },
  success: {
    title: t(RESEND_MESSAGES.success.titleKey, RESEND_MESSAGES.success.defaultTitle),
    message: t(RESEND_MESSAGES.success.messageKey, RESEND_MESSAGES.success.defaultMessage)
  },
  button: {
    text: t(RESEND_MESSAGES.button.buttonKey, RESEND_MESSAGES.button.buttonDefault),
    sending: t(RESEND_MESSAGES.button.sendingKey, RESEND_MESSAGES.button.sendingDefault)
  }
});

// ===== FUNKCJE POMOCNICZE =====

/**
 * Sprawdza czy błąd wymaga ponownego logowania
 * @param {string} errorCode - Kod błędu
 * @returns {boolean}
 */
export const requiresReauth = (errorCode) => {
  const reauthCodes = ['INVALID_TOKEN', 'TOKEN_EXPIRED', 'INVALID_CREDENTIALS'];
  return reauthCodes.includes(errorCode);
};

/**
 * Sprawdza czy błąd jest tymczasowy
 * @param {string} errorCode - Kod błędu
 * @returns {boolean}
 */
export const isTemporaryError = (errorCode) => {
  const tempErrorCodes = ['SERVER_ERROR', 'NETWORK_ERROR'];
  return tempErrorCodes.includes(errorCode);
};

/**
 * Pobiera błędy według kategorii
 * @param {string} category - Kategoria błędu
 * @returns {Array} Lista kodów błędów
 */
export const getErrorsByCategory = (category) => {
  return Object.keys(ERROR_DEFINITIONS)
    .filter(code => ERROR_DEFINITIONS[code].category === category);
};

// ===== SPECJALIZOWANE FUNKCJE =====

/**
 * Obsługa błędów logowania
 * @param {Error} error - Błąd
 * @returns {object} Obiekt błędu
 */
export const handleLoginError = (error) => handleHttpError(error, 'login');

/**
 * Obsługa błędów rejestracji
 * @param {Error} error - Błąd
 * @returns {object} Obiekt błędu
 */
export const handleRegistrationError = (error) => handleHttpError(error, 'registration');

/**
 * Obsługa błędów profilu
 * @param {Error} error - Błąd
 * @returns {object} Obiekt błędu
 */
export const handleProfileError = (error) => handleHttpError(error, 'profile');