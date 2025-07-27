
import React, { useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { disconnectSocket } from '../utils/socket'

export const CaptainLogout = () => {
    const navigate = useNavigate()

    useEffect(() => {
        const logoutCaptain = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/captain/logout`, {
                    withCredentials: true
                })

                if (response.status === 200) {
                    // Disconnect socket before navigating
                    disconnectSocket()
                    localStorage.removeItem('captain-token')
                    navigate('/captain-login')
                }
            } catch (error) {
                console.error('Captain logout error:', error)
                // Still disconnect socket and clear storage on error
                disconnectSocket()
                localStorage.removeItem('captain-token')
                navigate('/captain-login')
            }
        }

        logoutCaptain()
    }, [navigate])

    return (
        <div>Logging out...</div>
    )
}

export default CaptainLogout