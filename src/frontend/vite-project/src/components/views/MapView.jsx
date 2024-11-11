import { Title } from '../Title.jsx';
import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet.locatecontrol';

export function MapView() {
    const location = useLocation();
    const state = location.state;
    const mapRef = useRef(null);

    useEffect(() => {
        if (!mapRef.current) return;

        const southWest = L.latLng(25.5, -20.0); // Suroeste (Islas Canarias)
        const northEast = L.latLng(47.0, 15.0);   // Noreste (noreste de España)
        const bounds = L.latLngBounds(southWest, northEast);

        // const map = L.map(mapRef.current).setView([40.4637, -3.7492], 6);

        const map = L.map(mapRef.current, {
            center: [40.4637, -3.7492], // Coordenadas iniciales centradas en España
            zoom: 6,
            minZoom: 5,
            maxZoom: 18,
            maxBounds: bounds,
            maxBoundsViscosity: 1.0
        });


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
            metric: true,
            strings: {
                title: "Mostrar mi ubicación"
            },
            locateOptions: {
                maxZoom: 18,
                enableHighAccuracy: true
            }
        }).addTo(map);

        const loadAndAddMarkers = async () => {
            if (state.type === 'location') {
                try {
                    const response = await axios.get('http://localhost:8000/expenses_by_location');
                    response.data.forEach(item => {
                        L.marker([item.latitude, item.longitude]).addTo(map)
                            .bindPopup(`${item.entidad_nombre}: ${item.current_amount_spent}€`);
                    });
                } catch (error) {
                    console.error('Error al cargar los datos de la API:', error);
                }
            } else if (state.type === 'shop') {
                try {
                    const response = await axios.get('http://localhost:8000/expenses_by_shop');
                    response.data.forEach(item => {
                        L.marker([item.shop_latitude, item.shop_longitude]).addTo(map)
                            .bindPopup(`${item.shop_name}: ${item.current_amount_spent}€`);
                    });
                } catch (error) {
                    console.error('Error al cargar los datos de la API:', error);
                }
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
            {state.type === 'location' ? (
            <Title title="Mapa de gastos por localidad" />
            ) : state.type === 'shop' ? (
            <Title title="Mapa de gastos por tienda" />
            ) : null}
            <div ref={mapRef} style={{ height: '500px', width: '100%' }}></div>
        </div>
    );
}
