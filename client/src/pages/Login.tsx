import { Box, Button, Paper, TextField, Typography, styled } from "@mui/material";
import { useEffect, useState } from "react";
import { axiosInstance } from "../controller/axios/axios";
import { appRoutes, userRoutes } from "../constants/routes";
import { useNavigate } from "react-router";
import { useSnackbarStore } from "../store/snackbar.store";
import { SESSION } from "../constants/common";

const StyledPaper = styled(Paper)`
    max-width: 300px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateY(-50%) translateX(-50%);
`

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const setSnackbar = useSnackbarStore(state => state.setSnackbar)


    const navigate = useNavigate();

    useEffect(() => {
        const session = localStorage.getItem(SESSION)
        if (session) {
            navigate(appRoutes.DASHBOARD, { replace: true })
        }
    }, [])

    const onSubmit = async () => {
        if (email && password) {
            try {
                const result = await axiosInstance.post<{ access_token: string }>(userRoutes.LOGIN_ROUTE, { email, password })
                localStorage.setItem(SESSION, result.data.access_token)
                navigate(appRoutes.DASHBOARD, { replace: true })
                setSnackbar({ children: 'Signed in successfully' })
            } catch {
                setSnackbar({ children: 'Wrong credentials', severity: 'error' })
            }
        }
    }
    return <Box>
        <StyledPaper sx={{ padding: 2 }}>
            <Typography variant="h5" color="primary" align="center" sx={{ marginBottom: 2 }}>Quiz</Typography>
            <TextField value={email} onChange={e => setEmail(e.target.value)} sx={{ marginBottom: 2 }} label="Email" />
            <TextField value={password} sx={{ marginBottom: 2 }} onChange={e => setPassword(e.target.value)} type="password" label="Password" />
            <Button onClick={onSubmit}>Login</Button>
        </StyledPaper>
    </Box>
}