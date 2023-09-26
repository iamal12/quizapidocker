import { AlertProps } from '@mui/material';
import { SnackbarProps as MuiSnackbarProps } from '@mui/material/Snackbar';
import { create } from 'zustand'


interface SnackbarProps extends AlertProps {
    anchorOrigin?: MuiSnackbarProps['anchorOrigin'],
    open?: boolean
}

interface ISnackbarInterface {
    snackbar: SnackbarProps;
    setSnackbar: (snackbar: Partial<SnackbarProps>) => void
    closeSnackbar: () => void
}

const defaultProps: Partial<SnackbarProps> = {
    open: true,
    severity: 'success',
    children: '',
    variant: 'filled',
    anchorOrigin: { vertical: 'top', horizontal: 'left' }
}

export const useSnackbarStore = create<ISnackbarInterface>((set) => ({
    snackbar: {
    },
    setSnackbar: (snackbar) => set((state => ({ ...state, snackbar: { ...defaultProps, ...snackbar } }))),
    closeSnackbar: () => set((state) => ({ ...state, snackbar: { open: false } }))
}))
