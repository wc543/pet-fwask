// theme.js
import { createTheme, PaletteOptions } from '@mui/material/styles';

export const getTheme = () => createTheme({
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
                    '&.formInput, &.loginFormInput, &.signupFormInput' : {
                        '.MuiInputBase-root': {
                            fontSize: '0.875rem', 
                            minHeight: '35px', 
                        }
                    }
                }
            }
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    variants: [
                        {
                            prop: { variant: 'contained'},
                            style: {
                                backgroundColor: '#ED8844'
                            }
                        }
                    ]
                }
            }
        },
    }
});