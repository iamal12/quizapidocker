import { useEffect, useRef } from 'react'
import './App.css'
import { io } from 'socket.io-client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LoginPage from './pages/Login'
import { Alert, ThemeProvider } from '@mui/material'
import { defaultTheme } from './theme/default'
import Layout from './layout/Layout'
import Snackbar from '@mui/material/Snackbar';
import { useSnackbarStore } from './store/snackbar.store'

function App() {

  const { anchorOrigin, open, ...snackbarProps } = useSnackbarStore((state) => state.snackbar)
  const closeSnackbar = useSnackbarStore((state) => state.closeSnackbar)
  // const [count, setCount] = useState(0)

  // const socket = useRef(io('https://quizapi.com'))

  // useEffect(() => {
  //   if (socket.current) {
  //     // socket.current.on("connect", () => {
  //     //   console.log(socket.current.id);
  //     // });
  //   }

  // }, [socket])

  return (
    <ThemeProvider theme={defaultTheme} >
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<LoginPage />} />
            <Route path="*" element={<Layout />} />
          </Routes>
        </BrowserRouter>
        <Snackbar open={open} autoHideDuration={2000} anchorOrigin={anchorOrigin} onClose={closeSnackbar} >
          <Alert {...snackbarProps} />
        </Snackbar>
    </ThemeProvider>
  )
}

export default App
