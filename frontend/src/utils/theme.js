// src/utils/theme.js
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#00ffff' }, // неоновый голубой
    background: {
      default: '#0d1117',
      paper: '#161b22'
    },
    text: {
      primary: '#c9d1d9'
    }
  },
  typography: {
    fontFamily: '"Roboto", sans-serif',
  },
});
