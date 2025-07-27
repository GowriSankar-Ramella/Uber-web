import React, { useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import axios from 'axios';
import 'remixicon/fonts/remixicon.css'
import LocationSearchPanel from '../components/LocationSearchPanel';
import VehiclePanel from '../components/VehiclePanel';
import ConfirmRide from '../components/ConfirmRide';
import LookingForDriver from '../components/LookingForDriver';
import WaitingForDriver from '../components/WaitingForDriver';
import { useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux"
import { createSocketConnection } from '../utils/socket';
import LiveTracking from '../components/LiveTracking';


const Home = () => {
    const [pickup, setPickup] = useState('')
    const [destination, setDestination] = useState('')
    const [panelOpen, setPanelOpen] = useState(false)
    const vehiclePanelRef = useRef(null)
    const confirmRidePanelRef = useRef(null)
    const vehicleFoundRef = useRef(null)
    const waitingForDriverRef = useRef(null)
    const panelRef = useRef(null)
    const panelCloseRef = useRef(null)
    const [vehiclePanel, setVehiclePanel] = useState(false)
    const [confirmRidePanel, setConfirmRidePanel] = useState(false)
    const [vehicleFound, setVehicleFound] = useState(false)
    const [waitingForDriver, setWaitingForDriver] = useState(false)
    const [pickupSuggestions, setPickupSuggestions] = useState([])
    const [destinationSuggestions, setDestinationSuggestions] = useState([])
    const [activeField, setActiveField] = useState(null)
    const [fare, setFare] = useState({})
    const [vehicleType, setVehicleType] = useState(null)
    const [ride, setRide] = useState(null)

    const navigate = useNavigate()
    const user = useSelector(store => store.user?.user)

    useEffect(() => {
        if (!user) return
        const socketInstance = createSocketConnection()
        socketInstance.on('connect', () => {
            socketInstance.emit("join", { userType: "user", userId: user._id })
        })
        socketInstance.on('ride-confirmed', (data) => {
            setVehicleFound(false)
            setWaitingForDriver(true)
            setRide(data)
        })
        socketInstance.on('ride-started', (data) => {
            setWaitingForDriver(false)
            navigate('/riding', { state: { ride: data } })
        })
        socketInstance.on('disconnect', () => {
            console.log('Disconnected from server')
        })

        // Cleanup function - only remove specific listeners, don't disconnect
        return () => {
            if (socketInstance) {
                socketInstance.off('ride-confirmed')
                socketInstance.off('ride-started')
            }
        }
    }, [user])

    const handlePickupChange = async (e) => {
        setPickup(e.target.value)
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/map/autocomplete`, {
                params: { input: e.target.value },
                withCredentials: true
            })
            setPickupSuggestions(response.data.suggestions)
        } catch (error) {
            console.log(error)
        }
    }

    const handleDestinationChange = async (e) => {
        setDestination(e.target.value)
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/map/autocomplete`, {
                params: { input: e.target.value },
                withCredentials: true
            })
            setDestinationSuggestions(response.data.suggestions)
        } catch (error) { // Fixed: Added error parameter
            console.log(error)
        }
    }

    const submitHandler = (e) => {
        e.preventDefault()
    }

    // Updated GSAP effects with better state management
    useGSAP(function () {
        if (panelOpen) {
            gsap.to(panelRef.current, {
                height: '70%',
                padding: 24
            })
            gsap.to(panelCloseRef.current, {
                opacity: 1
            })
        } else {
            gsap.to(panelRef.current, {
                height: '0%',
                padding: 0
            })
            gsap.to(panelCloseRef.current, {
                opacity: 0
            })
        }
    }, [panelOpen])

    useGSAP(function () {
        if (vehiclePanel) {
            gsap.to(vehiclePanelRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(vehiclePanelRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [vehiclePanel])

    useGSAP(function () {
        if (confirmRidePanel) {
            gsap.to(confirmRidePanelRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(confirmRidePanelRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [confirmRidePanel])

    // Fixed: Better state management for vehicleFound panel
    useGSAP(function () {
        if (vehicleFound && !confirmRidePanel && !vehiclePanel) {
            gsap.to(vehicleFoundRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(vehicleFoundRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [vehicleFound, confirmRidePanel, vehiclePanel])

    useGSAP(function () {
        if (waitingForDriver) {
            gsap.to(waitingForDriverRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(waitingForDriverRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [waitingForDriver])

    async function findTrip() {
        // Close all other panels first
        setPanelOpen(false)
        setConfirmRidePanel(false)
        setVehicleFound(false)
        setWaitingForDriver(false)

        setVehiclePanel(true)

        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/ride/get-fare`, {
                params: { pickup, destination },
                withCredentials: true
            })
            setFare(response?.data?.fares)
        } catch (error) {
            console.log('Error fetching fares:', error)
        }
    }

    async function createRide() {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/ride/create`, {
                pickup,
                destination,
                vehicleType
            }, {
                withCredentials: true
            })
        } catch (error) {
            console.log('Error creating ride:', error)
        }
    }

    return (
        <div className='h-screen relative overflow-hidden'>
            {/* Hide logo and logout button when panel is open */}
            <img
                className={`w-16 absolute left-5 top-5 z-50 transition-opacity duration-300 ${panelOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
                alt=""
            />
            <button
                onClick={() => navigate('/user/logout')}
                className={`absolute right-5 top-5 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-all duration-300 z-50 ${panelOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                title="Logout"
            >
                <i className="ri-logout-box-r-line text-xl text-gray-700"></i>
            </button>
            <div className='h-screen w-screen'>
                {/* <img className='h-full w-full object-cover' src='https://miro.medium.com/v2/resize:fit:1280/0*gwMx05pqII5hbfmX.gif' alt='map-image' /> */}
                <LiveTracking />
            </div>
            <div className=' flex flex-col justify-end h-screen absolute top-0 w-full'>
                <div className='h-[30%] p-6 bg-white relative'>
                    <h5 ref={panelCloseRef} onClick={() => {
                        setPanelOpen(false)
                    }} className='absolute opacity-0 right-6 top-6 text-2xl'>
                        <i className="ri-arrow-down-wide-line"></i>
                    </h5>
                    <h4 className='text-2xl font-semibold'>Find a trip</h4>
                    <form className='relative py-3' onSubmit={(e) => {
                        submitHandler(e)
                    }}>
                        <div className="line absolute h-16 w-1 top-[50%] -translate-y-1/2 left-5 bg-gray-700 rounded-full"></div>
                        <input
                            onClick={() => {
                                setPanelOpen(true)
                                setActiveField('pickup')
                            }}
                            value={pickup}
                            onChange={handlePickupChange}
                            className='bg-[#eee] px-12 py-2 text-lg rounded-lg w-full'
                            type="text"
                            placeholder='Add a pick-up location'
                        />
                        <input
                            onClick={() => {
                                setPanelOpen(true)
                                setActiveField('destination')
                            }}
                            value={destination}
                            onChange={handleDestinationChange}
                            className='bg-[#eee] px-12 py-2 text-lg rounded-lg w-full  mt-3'
                            type="text"
                            placeholder='Enter your destination' />
                    </form>
                    <button
                        onClick={findTrip}
                        className='bg-black text-white px-4 py-2 rounded-lg mt-3 w-full'>
                        Find Trip
                    </button>
                </div>
                <div ref={panelRef} className='bg-white h-0'>
                    <LocationSearchPanel
                        suggestions={activeField === 'pickup' ? pickupSuggestions : destinationSuggestions}
                        setPanelOpen={setPanelOpen}
                        setVehiclePanel={setVehiclePanel}
                        setPickup={setPickup}
                        setDestination={setDestination}
                        activeField={activeField}
                    />
                </div>
            </div>

            {/* Updated z-index values to prevent overlapping */}
            <div ref={vehiclePanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12 max-h-[85vh] overflow-y-auto'>
                <VehiclePanel
                    selectVehicle={setVehicleType}
                    fare={fare}
                    setConfirmRidePanel={setConfirmRidePanel}
                    setVehiclePanel={setVehiclePanel} />
            </div>

            <div ref={confirmRidePanelRef} className='fixed w-full z-20 bottom-0 translate-y-full bg-white px-3 py-6 pt-12 max-h-[85vh] overflow-y-auto'>
                <ConfirmRide
                    createRide={createRide}
                    pickup={pickup}
                    destination={destination}
                    fare={fare}
                    vehicleType={vehicleType}
                    setConfirmRidePanel={setConfirmRidePanel}
                    setVehicleFound={setVehicleFound} />
            </div>

            <div ref={vehicleFoundRef} className='fixed w-full z-30 bottom-0 translate-y-full bg-white px-3 py-6 pt-12 max-h-[85vh] overflow-y-auto'>
                <LookingForDriver
                    createRide={createRide}
                    pickup={pickup}
                    destination={destination}
                    fare={fare}
                    vehicleType={vehicleType}
                    setVehicleFound={setVehicleFound} />
            </div>

            <div ref={waitingForDriverRef} className='fixed w-full z-40 bottom-0 translate-y-full bg-white px-3 py-6 pt-12 max-h-[85vh] overflow-y-auto'>
                <WaitingForDriver
                    ride={ride}
                    setVehicleFound={setVehicleFound}
                    setWaitingForDriver={setWaitingForDriver}
                    waitingForDriver={waitingForDriver} />
            </div>
        </div>
    )
}

export default Home
