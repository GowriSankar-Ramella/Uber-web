import React, { useState, useEffect, useRef } from 'react';
import { OlaMaps } from 'olamaps-web-sdk';

const LiveTracking = () => {
    const [currentPosition, setCurrentPosition] = useState({
        lat: 17.406,
        lng: 78.4514
    });
    const [isMapReady, setIsMapReady] = useState(false);
    const [heading, setHeading] = useState(0);
    const mapRef = useRef(null);
    const mapContainerRef = useRef(null);

    useEffect(() => {
        const initializeMap = async () => {
            try {
                const olaMaps = new OlaMaps({
                    apiKey: import.meta.env.VITE_OLA_MAPS_API_KEY,
                });

                const map = olaMaps.init({
                    style: "https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json",
                    container: mapContainerRef.current,
                    center: [currentPosition.lng, currentPosition.lat],
                    zoom: 17,
                    pitch: 45,
                    bearing: 0,
                    antialias: true
                });

                mapRef.current = map;

                map.on('load', () => {
                    console.log('Map loaded successfully');
                    setIsMapReady(true);
                    addUberStyleMarker(currentPosition);
                });

                map.on('error', (e) => {
                    console.error('Map error:', e);
                });

            } catch (error) {
                console.error('Error initializing Ola Maps:', error);
            }
        };

        if (mapContainerRef.current && !mapRef.current) {
            initializeMap();
        }

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []);

    // Create Uber-style car icon SVG
    const createCarIcon = (rotation = 0) => {
        return `data:image/svg+xml;base64,${btoa(`
            <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <g transform="rotate(${rotation} 16 16)">
                    <!-- Car shadow -->
                    <ellipse cx="16" cy="26" rx="8" ry="3" fill="rgba(0,0,0,0.2)"/>
                    
                    <!-- Car body -->
                    <path d="M8 20 L8 16 L10 12 L22 12 L24 16 L24 20 L22 22 L10 22 Z" 
                          fill="#000000" stroke="#FFFFFF" stroke-width="1"/>
                    
                    <!-- Car windows -->
                    <path d="M10 16 L11 13 L21 13 L22 16 Z" fill="#4A90E2"/>
                    
                    <!-- Car wheels -->
                    <circle cx="11" cy="21" r="2" fill="#333333" stroke="#FFFFFF" stroke-width="1"/>
                    <circle cx="21" cy="21" r="2" fill="#333333" stroke="#FFFFFF" stroke-width="1"/>
                    
                    <!-- Car headlights -->
                    <circle cx="16" cy="12" r="1" fill="#FFFF00"/>
                </g>
            </svg>
        `)}`;
    };

    const addUberStyleMarker = (position) => {
        if (!mapRef.current || !isMapReady) return;

        try {
            // Remove existing layers and sources
            if (mapRef.current.getLayer('accuracy-circle')) {
                mapRef.current.removeLayer('accuracy-circle');
            }
            if (mapRef.current.getLayer('user-location-pulse')) {
                mapRef.current.removeLayer('user-location-pulse');
            }
            if (mapRef.current.getLayer('user-location')) {
                mapRef.current.removeLayer('user-location');
            }
            if (mapRef.current.getSource('user-location-source')) {
                mapRef.current.removeSource('user-location-source');
            }

            // Add new source
            mapRef.current.addSource('user-location-source', {
                'type': 'geojson',
                'data': {
                    'type': 'FeatureCollection',
                    'features': [{
                        'type': 'Feature',
                        'geometry': {
                            'type': 'Point',
                            'coordinates': [position.lng, position.lat]
                        }
                    }]
                }
            });

            // Add accuracy circle (light blue background)
            mapRef.current.addLayer({
                'id': 'accuracy-circle',
                'type': 'circle',
                'source': 'user-location-source',
                'paint': {
                    'circle-radius': 25,
                    'circle-color': '#4A90E2',
                    'circle-opacity': 0.1,
                    'circle-stroke-color': '#4A90E2',
                    'circle-stroke-width': 1,
                    'circle-stroke-opacity': 0.3
                }
            });

            // Add pulsing animation layer (subtle)
            mapRef.current.addLayer({
                'id': 'user-location-pulse',
                'type': 'circle',
                'source': 'user-location-source',
                'paint': {
                    'circle-radius': 15,
                    'circle-color': '#4A90E2',
                    'circle-opacity': 0.2
                }
            });

            // Add car icon marker
            if (!mapRef.current.hasImage('car-icon')) {
                const carImage = new Image(32, 32);
                carImage.onload = () => {
                    mapRef.current.addImage('car-icon', carImage);

                    mapRef.current.addLayer({
                        'id': 'user-location',
                        'type': 'symbol',
                        'source': 'user-location-source',
                        'layout': {
                            'icon-image': 'car-icon',
                            'icon-size': 1,
                            'icon-rotation-alignment': 'map',
                            'icon-allow-overlap': true,
                            'icon-ignore-placement': true
                        }
                    });
                };
                carImage.src = createCarIcon(heading);
            } else {
                mapRef.current.addLayer({
                    'id': 'user-location',
                    'type': 'symbol',
                    'source': 'user-location-source',
                    'layout': {
                        'icon-image': 'car-icon',
                        'icon-size': 1,
                        'icon-rotation-alignment': 'map',
                        'icon-allow-overlap': true,
                        'icon-ignore-placement': true
                    }
                });
            }

            // Smooth camera movement like Uber
            mapRef.current.easeTo({
                center: [position.lng, position.lat],
                duration: 1000,
                easing: (t) => t * (2 - t)
            });

            console.log('Uber-style marker added successfully');

        } catch (error) {
            console.error('Error adding Uber-style marker:', error);
        }
    };

    const updateUberStyleMarker = (position) => {
        if (!mapRef.current || !isMapReady) return;

        try {
            const source = mapRef.current.getSource('user-location-source');
            if (source) {
                // Update existing source data
                source.setData({
                    'type': 'FeatureCollection',
                    'features': [{
                        'type': 'Feature',
                        'geometry': {
                            'type': 'Point',
                            'coordinates': [position.lng, position.lat]
                        }
                    }]
                });

                // Update car icon rotation if heading changed
                if (mapRef.current.hasImage('car-icon')) {
                    const carImage = new Image(32, 32);
                    carImage.onload = () => {
                        mapRef.current.updateImage('car-icon', carImage);
                    };
                    carImage.src = createCarIcon(heading);
                }

                // Smooth camera movement
                mapRef.current.easeTo({
                    center: [position.lng, position.lat],
                    duration: 1000,
                    easing: (t) => t * (2 - t)
                });
            } else {
                addUberStyleMarker(position);
            }
        } catch (error) {
            console.error('Error updating Uber-style marker:', error);
            addUberStyleMarker(position);
        }
    };

    // Enhanced geolocation to track heading
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude, heading: deviceHeading } = position.coords;
                const newPosition = { lat: latitude, lng: longitude };
                setCurrentPosition(newPosition);

                // Update heading if available
                if (deviceHeading !== null && deviceHeading !== undefined) {
                    setHeading(deviceHeading);
                }

                console.log('Initial position:', latitude, longitude);
            },
            (error) => {
                console.error('Error getting initial position:', error);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000
            }
        );

        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                const { latitude, longitude, heading: deviceHeading } = position.coords;
                const newPosition = { lat: latitude, lng: longitude };
                setCurrentPosition(newPosition);

                // Update heading if available
                if (deviceHeading !== null && deviceHeading !== undefined) {
                    setHeading(deviceHeading);
                }
            },
            (error) => {
                console.error('Error watching position:', error);
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 30000,
                distanceFilter: 5
            }
        );

        return () => {
            if (watchId) {
                navigator.geolocation.clearWatch(watchId);
            }
        };
    }, []);

    // Periodic position updates with heading
    useEffect(() => {
        const updatePosition = () => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude, heading: deviceHeading } = position.coords;
                    const newPosition = { lat: latitude, lng: longitude };
                    console.log('Position updated:', latitude, longitude);
                    setCurrentPosition(newPosition);

                    // Update heading if available
                    if (deviceHeading !== null && deviceHeading !== undefined) {
                        setHeading(deviceHeading);
                    }
                },
                (error) => {
                    if (error.code === 3) {
                        console.warn('Position update skipped - GPS timeout');
                    } else {
                        console.error('Error updating position:', error);
                    }
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 60000
                }
            );
        };

        const intervalId = setInterval(updatePosition, 2000);
        return () => clearInterval(intervalId);
    }, []);

    // Update marker when position changes
    useEffect(() => {
        if (isMapReady && currentPosition) {
            updateUberStyleMarker(currentPosition);
        }
    }, [currentPosition, isMapReady, heading]);

    return (
        <div className="w-full h-full">
            {/* Map container */}
            <div
                ref={mapContainerRef}
                className="w-full h-full"
                id="ola-map-container"
            />
        </div>
    );
};

export default LiveTracking;
