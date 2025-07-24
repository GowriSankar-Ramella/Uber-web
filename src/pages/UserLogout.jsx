import React, { useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { disconnectSocket } from '../utils/socket'

export const UserLogout = () => {
    const navigate = useNavigate()

    useEffect(() => {
        const logoutUser = async () => {
            try {
                const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/logout`, {}, {
                    withCredentials: true
                })

                if (response.status === 200) {
                    // Disconnect socket before navigating
                    disconnectSocket()
                    localStorage.removeItem('token')
                    navigate('/login')
                }
            } catch (error) {
                console.error('Logout error:', error)
                // Still disconnect socket and clear storage on error
                disconnectSocket()
                localStorage.removeItem('token')
                navigate('/login')
            }
        }

        logoutUser()
    }, [navigate])

    return (
        <div>Logging out...</div>
    )
}

export default UserLogout