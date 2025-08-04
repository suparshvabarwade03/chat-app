import React, { useContext } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import ProfilePage from "./pages/ProfilePage"
import { Toaster } from "react-hot-toast"
import { AuthContext } from '../context/AuthContext'


function App() {
   
  const {authUser} = useContext(AuthContext)
 // authUser is true then home and profile page is available else login page will appear


  return (
    <div className="bg-[url('/bgImage.svg')] bg-contain">
      <Toaster />
        <Routes>
          <Route path='/' element={ authUser ? <HomePage /> : <Navigate to="/login" /> } />
          <Route path='/login' element={ !authUser ? <LoginPage /> : <Navigate to="/" /> } />
          <Route path='/profile' element={ authUser ? <ProfilePage /> : <Navigate to="/login" /> } />
        </Routes>
    </div>
  )
}

export default App

// className="bg-[url(./src/assets/bg.jpg)] bg-contain" bcoz of this class every page get bg img

// gemini start 