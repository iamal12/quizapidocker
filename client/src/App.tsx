import { useEffect, useRef, useState } from 'react'
import './App.css'
import { io } from 'socket.io-client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import LoginPage from './pages/Login'
import { ThemeProvider } from '@mui/material'
import { defaultTheme } from './theme/default'

function App() {
  const [count, setCount] = useState(0)

  const socket = useRef(io('https://quizapi.com'))

  useEffect(() => {
    if (socket.current) {
      socket.current.on("connect", () => {
        console.log(socket.current.id);
      });
    }

  }, [socket])


  const router = createBrowserRouter([
    {
      path: "/",
      element: <LoginPage />
    }
  ])


  return (
    <ThemeProvider theme={defaultTheme} >
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}

export default App
