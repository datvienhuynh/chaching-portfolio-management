const { createMuiTheme } = require('@material-ui/core');

const theme = createMuiTheme({
  palette: {
    type: 'light',
    primary: {
      main: '#006cfa',
    },
    secondary: {
      main: '#1de9b6',
    },
  },
  typography: {
    fontFamily: ['Tahoma', 'sans-serif'].join(','),
  },
});

export default theme;
