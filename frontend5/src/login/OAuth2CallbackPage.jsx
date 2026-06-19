import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { setTokens } from './Authentication';
import { HomeViewUrl, LoginUrl } from '../utils/URLHelper';
import { CircularProgress, Box } from '@mui/material';

export default function OAuth2CallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const accessTokenExpiresAt = searchParams.get('accessTokenExpiresAt');
    const refreshTokenExpiresAt = searchParams.get('refreshTokenExpiresAt');
    const rolesParam = searchParams.get('roles');

    if (!accessTokenExpiresAt || !refreshTokenExpiresAt || !rolesParam) {
      navigate(LoginUrl, { replace: true });
      return;
    }

    const roles = rolesParam.split(',').filter(Boolean);
    setTokens(parseInt(accessTokenExpiresAt), parseInt(refreshTokenExpiresAt), roles);
    navigate(HomeViewUrl, { replace: true });
  }, [searchParams, navigate]);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <CircularProgress />
    </Box>
  );
}
