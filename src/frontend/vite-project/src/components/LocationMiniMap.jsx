import React, { useEffect, useState, useRef } from 'react';
import L from 'leaflet';
import 'leaflet.locatecontrol';
import axios from 'axios';

export function LocationMiniMap(props) { // Ej: marisol: 37.1438607 -3.6273500
    const mapRef = useRef(null);
    const mapInstance = useRef(null); // Amacenar la instancia del mapa
    const [potentialShops, setPotentialShops] = useState([]);
    const [userLocation, setUserLocation] = useState(null);

    useEffect(() => {
        if (mapInstance.current) return; // Verifica si el mapa ya ha sido inicializado

        mapInstance.current = L.map(mapRef.current, {
            center: [40.4637, -3.7492], // Coordenadas iniciales centradas en España
            zoom: 10,
            minZoom: 10,
            maxZoom: 20,
            dragging: false,
            scrollWheelZoom: false,
            doubleClickZoom: false,
            boxZoom: false,
            keyboard: false,
            tap: false
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(mapInstance.current);

        const locateControl = L.control.locate({
            position: 'topleft',
            flyTo: true,
            setView: 'untilPanOrZoom',
            keepCurrentZoomLevel: false,
            circleStyle: {
                weight: 1,
                clickable: false
            },
            locateOptions: {
                maxZoom: 15,
                enableHighAccuracy: true
            }
        }).addTo(mapInstance.current);

        mapInstance.current.on('locationfound', (e) => {
            const { lat, lng } = e.latlng; // Obtener las coordenadas de la ubicación encontrada
            // const lat = 37.1438607;
            // const lng = -3.6273500;
            setUserLocation({ lat, lon: lng });
            fetchNearbyPlaces(lat, lng);
        });

        locateControl.start();

        const fetchNearbyPlaces = async (lat, lon) => {
            const overpassQuery = `
                [out:json];
                (
                  node["shop"](around:400,${lat},${lon});
                  node["amenity"~"restaurant|cafe|bar"](around:400,${lat},${lon});
                  node["leisure"](around:400,${lat},${lon});
                );
                out body;
            `;
            const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`;

            try {
                const response = await axios.get(url);
                setPotentialShops(response.data.elements);
                props.onPotentialShopsChange(response.data.elements);
            } catch (error) {
                console.error('Error fetching places:', error);
            }
        };

        return () => {
            mapInstance.current.remove();
            mapInstance.current = null;
        };
    }, []);

    return (
        <div>
            <div ref={mapRef} style={{ height: '150px' }}></div>
        </div>
    );
}