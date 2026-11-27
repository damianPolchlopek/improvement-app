import { alpha, createTheme } from '@mui/material/styles';
import { ACCENTS, FONT_FAMILY, HAIRLINE, LINE_COLOR, ROW_LINE, STATUS, SURFACE } from './tokens';

// Jeden kolor przewodni aplikacji: przyciski, zaznaczenia, linki, wskaźnik w toolbarze.
// Jasny odcień zieleni z palety akcentów – czytelny na ciemnym tle (przyciski dostają ciemny tekst).
const PRIMARY = ACCENTS.teal.light;

let theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: PRIMARY,
    },
    success: {
      main: STATUS.done,
    },
    warning: {
      main: STATUS.due,
    },
    error: {
      main: STATUS.down,
    },
    // Przezroczyste odcienie koloru przewodniego (rozwinięty / zaznaczony wiersz, plakietka).
    primaryTint: {
      subtle: alpha(PRIMARY, 0.06),
      selected: alpha(PRIMARY, 0.08),
      strong: alpha(PRIMARY, 0.16),
    },
    background: {
      default: SURFACE.page,
      paper: SURFACE.card,
    },
    // Tokeny z tokens.js – dostępne w `sx` jako np. 'surface.field', 'status.up', 'accent.teal.dot'.
    accent: ACCENTS,
    status: STATUS,
    surface: SURFACE,
    line: LINE_COLOR,
    // Toolbar „grafit + zieleń”: neutralny, prawie czarny pasek; akcent to kolor przewodni.
    toolbar: {
      background: '#1c2329',
      subBackground: '#161c21',
      border: '1px solid rgba(255, 255, 255, 0.07)',
      indicator: PRIMARY,
      accent: PRIMARY,
      accentHover: alpha(PRIMARY, 0.1),
      text: '#8b98a5',
      hover: 'rgba(255, 255, 255, 0.05)',
      selected: '#2a333b',
      subSelected: '#2a333b',
    },
  },
  typography: {
    h6: {
      fontWeight: '600',
    },
    h5: {
      fontWeight: 500,
      fontSize: 26,
      letterSpacing: 0.5,
    },
    // Arial wprost (świadomy wybór zamiast Roboto) – taki sam wygląd na każdym systemie.
    fontFamily: FONT_FAMILY,
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
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: theme.palette.background.default,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: theme.palette.background.paper,
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
    // Płaska karta jak `surfaceSx`: cienka jasna ramka, bez nakładki elevation i bez cienia.
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: HAIRLINE,
          backgroundImage: 'none',
        },
      },
    },
    // Tabele: cienkie linie, nagłówek 12px, liczby o stałej szerokości cyfr – w całej aplikacji.
    // Tabela z innymi odstępami nadpisuje je przez `sx` na <Table> ('& .MuiTableCell-root').
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '9px 16px',
          verticalAlign: 'middle',
          borderBottom: ROW_LINE,
          fontVariantNumeric: 'tabular-nums',
        },
        head: {
          paddingTop: 8,
          paddingBottom: 8,
          fontSize: 12,
          fontWeight: 500,
          color: theme.palette.text.secondary,
          whiteSpace: 'nowrap',
          borderBottom: HAIRLINE,
        },
        // Przywracają odstępy MUI, które nadpisałby `root.padding`.
        paddingCheckbox: {
          width: 48,
          padding: '0 0 0 4px',
        },
        paddingNone: {
          padding: 0,
        },
      },
    },
    MuiTableBody: {
      styleOverrides: {
        root: {
          '& .MuiTableRow-root:last-of-type .MuiTableCell-root': { borderBottom: 0 },
          '& .MuiTableRow-root:hover .MuiTableCell-root': { backgroundColor: SURFACE.hover },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&.Mui-selected, &.Mui-selected:hover': {
            backgroundColor: theme.palette.primaryTint.selected,
          },
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
  },
};

export default theme;
