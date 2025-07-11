import { useEffect, useState } from 'react'
import Start from './pages/Start'
import { Route, Routes } from 'react-router-dom'
import UserLogin from './pages/UserLogin'
import UserSignup from './pages/UserSignup'
import Captainlogin from './pages/Captainlogin'
import CaptainSignup from './pages/CaptainSignup'
import UserProtect from './pages/UserProtect'
import CaptainProtect from './pages/CaptainProtect'
import CaptainHome from "./pages/CaptainHome"
import Home from "./pages/Home"
import { useDispatch } from 'react-redux'
import { checkCaptainStatus } from './utils/captainSlice'
import { checkAuthStatus } from './utils/userSlice'

function App() {
  const dispatch = useDispatch()
  useEffect(() => {
    console.log("Dispatching..")
    dispatch(checkCaptainStatus())
    dispatch(checkAuthStatus())
  }, [])

  return (
    <>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/signup" element={<UserSignup />} />
        <Route path="/home" element={<UserProtect><Home /></UserProtect>} />
        <Route path="/captain-login" element={<Captainlogin />} />
        <Route path="/captain-signup" element={<CaptainSignup />} />
        <Route path="/captain-home" element={<CaptainProtect><CaptainHome /></CaptainProtect>} />
      </Routes>
    </>
  )
}

export default App
