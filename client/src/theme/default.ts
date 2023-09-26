import { Theme, createTheme } from "@mui/material";

export const defaultTheme: Partial<Theme> = createTheme({
    components: {
        MuiTextField: {
            defaultProps: {
                fullWidth: true,
                variant: 'outlined'
            }
        },
        MuiButton: {
            defaultProps: {
                fullWidth: true,
                variant: 'contained'
            }
        },
        MuiFormControl: {
            defaultProps: {
                fullWidth: true,
                variant: 'outlined'
            }
        }
    }
})