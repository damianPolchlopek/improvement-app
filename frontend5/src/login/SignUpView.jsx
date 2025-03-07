import { useTranslation } from 'react-i18next';

import {
  Button,
  Typography
} from '@mui/material';

import Grid from '@mui/material/Unstable_Grid2';
import CenteredContainer from '../component/CenteredContainer';
import Input from './Input';
import { useInput } from './useInput';
import StyledPaper from '../component/StyledPaper';

export default function SignUpView() {
  const { t } = useTranslation();

  const {
    value: enteredUsername,
    handleInputChange: handleUsernameChange,
    handleInputBlur: handleUsernameBlur,
    hasError: usernameIsInvalid,
  } = useInput('', (value) => value.trim() !== '');

  const {
    value: enteredEmail,
    handleInputChange: handleEmailChange,
    handleInputBlur: handleEmailBlur,
    hasError: emailIsInvalid,
  } = useInput('', (value) => value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i));

  const {
    value: enteredPassword,
    handleInputChange: handlePasswordChange,
    handleInputBlur: handlePasswordBlur,
    hasError: passwordIsInvalid,
  } = useInput('', (value) => value.length >= 4);

  const {
    value: enteredConfirmPassword,
    handleInputChange: handleConfirmPasswordChange,
    handleInputBlur: handleConfirmPasswordBlur,
    hasError: confirmPasswordIsInvalid,
  } = useInput('', (value) => value === enteredPassword);

  const submitSignUpReq = () => {
    // console.log(userDetails);
  }

  return(
    <CenteredContainer>
      <StyledPaper>

        <Typography variant="h5" component="div"> {t('signup.title')} </Typography>
        <p>{t('signup.alreadyHaveAccount')} <a href="/login">{t('signup.login')}</a></p>
        
        <Grid item sx={{margin: '1rem'}}>
          <Input
            label={t('signup.username')}
            id="username"
            name="username"
            onBlur={handleUsernameBlur}
            onChange={handleUsernameChange}
            value={enteredUsername}
            error={usernameIsInvalid && t('signup.usernameError')}
          />

          <Input
            label={t('signup.email')}
            id="email"
            name="email"
            onBlur={handleEmailBlur}
            onChange={handleEmailChange}
            value={enteredEmail}
            error={emailIsInvalid && t('signup.emailError')}
          />
        </Grid>

        <Grid item>
          <Input
            label={t('signup.password')}
            id="password"
            name="password"
            type="password"
            onBlur={handlePasswordBlur}
            onChange={handlePasswordChange}
            value={enteredPassword}
            error={passwordIsInvalid && t('signup.passwordError')}
          />

          <Input
            label={t('signup.confirmPassword')}
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            onBlur={handleConfirmPasswordBlur}
            onChange={handleConfirmPasswordChange}
            value={enteredConfirmPassword}
            error={confirmPasswordIsInvalid && t('signup.confirmPasswordError')}
          />
        </Grid>
                    
        <Button variant="contained" sx={{width: '25vh'}} onClick={submitSignUpReq}>{t('signup.signUp')}</Button>
        
      </StyledPaper>
    </CenteredContainer>
  );
}