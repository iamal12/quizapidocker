import { Theme, createTheme } from "@mui/material";

export const defaultTheme: Partial<Theme> = createTheme({
    components: {
        MuiTextField: {
            defaultProps: {
                fullWidth: true,
                variant: 'outlined',
                margin: 'dense'
            }
        },
        MuiSelect: {
            defaultProps: {
                fullWidth: true,variant: 'outlined',margin: 'dense'
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