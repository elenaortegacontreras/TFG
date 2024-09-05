import { Title } from './Title.jsx';
import React, { useEffect, useRef } from 'react';
import axios from 'axios';
import L from 'leaflet';

export function MapView() {
    const mapRef = useRef(null);

    useEffect(() => {
        if (!mapRef.current) return;

        const map = L.map(mapRef.current).setView([40.4637, -3.7492], 6);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
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
