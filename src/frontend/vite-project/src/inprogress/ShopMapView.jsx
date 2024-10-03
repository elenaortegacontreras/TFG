import { Title } from '../components/Title.jsx';
import React, { useEffect, useRef } from 'react';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet.locatecontrol';

export function MapView() {
    const mapRef = useRef(null);

    useEffect(() => {
        if (!mapRef.current) return;

        // Coordenadas aproximadas de un rectángulo que cubre España y sus islas
        const southWest = L.latLng(27.6, -18.5); // Suroeste (Islas Canarias)
        const northEast = L.latLng(43.8, 4.5);   // Noreste (noreste de España)
        const bounds = L.latLngBounds(southWest, northEast);

        const map = L.map(mapRef.current).setView([40.4637, -3.7492], {zoom:6}, { maxBounds: bounds }, { maxBoundsViscosity: 0.5 });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        L.control.locate({
            position: 'topleft',
            flyTo: true,
            setView: 'untilPanOrZoom',
            keepCurrentZoomLevel: false,
            markerStyle: {
                weight: 2,
                opacity: 0.8,
                fillOpacity: 0.8
            },
            circleStyle: {
                weight: 1,
                clickable: false
            },
            // icon: 'fa fa-location-arrow',
            // metric: true,
            // strings: {
            //     title: "Mostrar mi ubicación"
            // },
            locateOptions: {
                maxZoom: 15,
                enableHighAccuracy: true
            }
        }).addTo(map);

        const loadAndAddMarkers = async () => {
            try {
                const response = await axios.get('http://localhost:8000/expenses_by_location');
                response.data.forEach(item => {
                    L.marker([item.latitude, item.longitude]).addTo(map)
                        .bindPopup(`${item.entidad_nombre}: ${item.current_amount_spent}€`);
                });
            } catch (error) {
                console.error('Error al cargar los datos de la API:', error);
            }
        };

        // Llamar a la función después de que el mapa esté listo
        loadAndAddMarkers();

        return () => {
            map.remove(); // Limpiar el mapa y sus listeners cuando el componente se desmonte
        };
    }, []);

    return (
        <div>
            <Title title="Mapa de gastos por municipio" />
            <div ref={mapRef} style={{ height: '500px', width: '100%' }}></div>
        </div>
    );
}
