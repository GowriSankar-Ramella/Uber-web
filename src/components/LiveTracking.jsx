import React, { useState, useEffect, useRef } from 'react';
import { OlaMaps } from 'olamaps-web-sdk';

const containerStyle = {
    width: '100%',
    height: '100%',
};

const center = {
    lat: 17.406,
    lng: 78.4514
};

const LiveTracking = () => {
    const [currentPosition, setCurrentPosition] = useState(center);
    const [isMapReady, setIsMapReady] = useState(false);
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
                    zoom: 15,
                });

                mapRef.current = map;

                map.on('load', () => {
                    console.log('Map loaded successfully');
                    setIsMapReady(true);
                    addLocationLayer(currentPosition);
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

    const addLocationLayer = (position) => {
        if (!mapRef.current || !isMapReady) return;

        try {
            // Remove existing layers and sources
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

            // Add main marker layer
            mapRef.current.addLayer({
                'id': 'user-location',
                'type': 'circle',
                'source': 'user-location-source',
                'paint': {
                    'circle-radius': 8,
                    'circle-color': '#FF4444',
                    'circle-stroke-color': '#FFFFFF',
                    'circle-stroke-width': 3,
                    'circle-opacity': 1
                }
            });

            // Add pulsing animation layer
            mapRef.current.addLayer({
                'id': 'user-location-pulse',
                'type': 'circle',
                'source': 'user-location-source',
                'paint': {
                    'circle-radius': 15,
                    'circle-color': '#FF4444',
                    'circle-opacity': 0.4,
                    'circle-stroke-color': '#FF4444',
                    'circle-stroke-width': 1,
                    'circle-stroke-opacity': 0.8
                }
            });

            // Center map on position
            mapRef.current.setCenter([position.lng, position.lat]);

            console.log('Location layer added successfully');

        } catch (error) {
            console.error('Error adding location layer:', error);
        }
    };

    const updateLocationLayer = (position) => {
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

                // Center map on new position
                mapRef.current.setCenter([position.lng, position.lat]);
            } else {
                // Create new layer if source doesn't exist
                addLocationLayer(position);
            }
        } catch (error) {
            console.error('Error updating location layer:', error);
            // Fallback: recreate the layer
            addLocationLayer(position);
        }
    };

    // Initial position and location watching
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const newPosition = { lat: latitude, lng: longitude };
                setCurrentPosition(newPosition);
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
                const { latitude, longitude } = position.coords;
                const newPosition = { lat: latitude, lng: longitude };
                setCurrentPosition(newPosition);
            },
            (error) => {
                console.error('Error watching position:', error);
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 30000,
                distanceFilter: 10
            }
        );

        return () => {
            if (watchId) {
                navigator.geolocation.clearWatch(watchId);
            }
        };
    }, []);

    // Periodic position updates
    // Modified periodic updates with better timeout handling
    useEffect(() => {
        const updatePosition = () => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const newPosition = { lat: latitude, lng: longitude };
                    console.log('Position updated:', latitude, longitude);
                    setCurrentPosition(newPosition);
                },
                (error) => {
                    // Simply log timeout errors without spamming console
                    if (error.code === 3) {
                        console.warn('Position update skipped - GPS timeout');
                    } else {
                        console.error('Error updating position:', error);
                    }
                },
                {
                    enableHighAccuracy: false, // Changed from true to false
                    timeout: 10000, // Increased from 5000 to 10000
                    maximumAge: 120000 // Accept positions up to 2 minutes old
                }
            );
        };

        const intervalId = setInterval(updatePosition, 3000); // Increased from 1000 to 3000ms
        return () => clearInterval(intervalId);
    }, []);


    // Update marker when position changes
    useEffect(() => {
        if (isMapReady && currentPosition) {
            updateLocationLayer(currentPosition);
        }
    }, [currentPosition, isMapReady]);

    return (
        <div
            ref={mapContainerRef}
            style={containerStyle}
            id="ola-map-container"
        />
    );
};

export default LiveTracking;
