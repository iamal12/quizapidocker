import { Box, Button, Paper, TextField, Typography, styled } from "@mui/material";
import { useState } from "react";
import { axiosInstance } from "../controller/axios/axios";
import { userRoutes } from "../constants/routes";

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

    const onSubmit = async () => {
        if (email && password) {
            try {
                const result = await axiosInstance.post<{ access_token: string }>(userRoutes.LOGIN_ROUTE, { email, password })
                localStorage.setItem('quiz_app_session', result.data.access_token)

            } catch {

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