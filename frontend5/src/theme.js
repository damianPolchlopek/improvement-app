import { createTheme } from '@mui/material/styles';

let theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
    background: {
      default: 'radial-gradient( #123146, #202c34)',
      second: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      paper: '#1d1d1d',
    },
    card: {
      header: 'linear-gradient(90deg, #1e3a52 0%, #2d5374 100%)',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    }
  },
  typography: {
    h6: {
      fontWeight: "600",
      color: "text.primary"
    },
    h5: {
      fontWeight: 500,
      fontSize: 26,
      letterSpacing: 0.5,
    },
    fontFamily: 'Roboto, sans-serif',
  },
  shape: {
    borderRadius: 8,
  },
  mixins: {
    toolbar: {
      minHeight: 48,
    },
  },
});

theme = {
  ...theme,
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1d1d1d',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
        contained: {
          boxShadow: 'none',
          '&:active': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          marginLeft: theme.spacing(1),
        },
        indicator: {
          height: 3,
          borderTopLeftRadius: 3,
          borderTopRightRadius: 3,
          backgroundColor: theme.palette.primary.main,
        },
      },
    },
    MuiTab: {
      defaultProps: {
        disableRipple: true,
      },
      styleOverrides: {
        root: {
          textTransform: 'none',
          margin: '0 16px',
          minWidth: 0,
          padding: 0,
          [theme.breakpoints.up('md')]: {
            padding: 0,
            minWidth: 0,
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          padding: theme.spacing(1),
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: 4,
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255,255,255,0.15)',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            color: theme.palette.primary.main,
          },
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          fontSize: 14,
          fontWeight: theme.typography.fontWeightMedium,
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: 'inherit',
          minWidth: 'auto',
          marginRight: theme.spacing(2),
          '& svg': {
            fontSize: 20,
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          width: 32,
          height: 32,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          textAlign: 'center', 
          borderRadius: 16,
          transition: 'all 0.3s ease',
          border: '1px solid rgba(0,0,0,0.08)',
          '&:hover': {
            boxShadow: '0 8px 25px rgba(0,0,0,0.12)'          
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 'bold',
          fontSize: '0.9rem',
          minWidth: 45,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          width: '100%',
        },
      },
    },
    MuiDesktopDatePicker: {
      defaultProps: {
        inputFormat: 'DD/MM/YYYY',
      },
    },
   MuiAlert: {
      styleOverrides: {
        root: {
          marginBottom: '16px',
          textAlign: 'center'
        },
        message: {
          width: '100%',
          textAlign: 'center'
        }
      }
    },
    MuiGrid2: {
      defaultProps: {
        spacing: 3,
        justifyContent: 'center',
        alignItems: 'center',
      },
    },
  },
};

export default theme;