import React from 'react'

const ConfirmRide = (props) => {
    if (!props.fare || !props.vehicleType || !props.fare[props.vehicleType]) {
        return (
            <div className='h-full flex flex-col'>
                <h5 className='p-1 text-center w-[93%] absolute top-0 z-10' onClick={() => {
                    props.setConfirmRidePanel(false)
                }}><i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i></h5>
                <div className='p-4 pt-12'>
                    <p>Loading ride details...</p>
                </div>
            </div>
        );
    }

    const selectedVehicleFare = props.fare[props.vehicleType];

    return (
        <div className='h-full flex flex-col'>
            <h5 className='p-1 text-center w-[93%] absolute top-0 z-10' onClick={() => {
                props.setConfirmRidePanel(false)
            }}><i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i></h5>

            <div className='flex-1 pt-12 pb-4'>
                <h3 className='text-2xl font-semibold mb-5'>Confirm your Ride</h3>

                <div className='text-center mb-6'>
                    <img className='h-20 mx-auto' src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg" alt="" />
                </div>

                <div className='space-y-3'>
                    <div className='flex items-center gap-5 p-3 border-b-2'>
                        <i className="ri-map-pin-user-fill"></i>
                        <div>
                            <h3 className='text-lg font-medium'>Pick-up</h3>
                            <p className='text-sm -mt-1 text-gray-600'>{props.pickup}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 p-3 border-b-2'>
                        <i className="text-lg ri-map-pin-2-fill"></i>
                        <div>
                            <h3 className='text-lg font-medium'>Destination</h3>
                            <p className='text-sm -mt-1 text-gray-600'>{props.destination}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 p-3'>
                        <i className="ri-currency-line"></i>
                        <div>
                            <h3 className='text-lg font-medium'>₹{selectedVehicleFare.fare}</h3>
                            <p className='text-sm -mt-1 text-gray-600'>Cash • {selectedVehicleFare.duration} • {selectedVehicleFare.distance}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Fixed button positioning */}
            <div className='flex-shrink-0 p-4 bg-white border-t border-gray-200'>
                <button onClick={() => {
                    props.setVehicleFound(true)
                    props.setConfirmRidePanel(false)
                    props.createRide()
                }} className='w-full bg-green-600 text-white font-semibold p-4 rounded-lg'>
                    Confirm
                </button>
            </div>
        </div>
    )
}

export default ConfirmRide
