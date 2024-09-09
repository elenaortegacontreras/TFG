import React, { useEffect, useState, useRef } from 'react';
import L from 'leaflet';
import 'leaflet.locatecontrol';

export function LocationMiniMap() {
    const mapRef = useRef(null);
    // const [places, setPlaces] = useState([]);

    useEffect(() => {
        if (!mapRef.current) return; // 37.14348360812482, -3.6323339037885454

        // const southWest = L.latLng(25.5, -20.0); // Suroeste (Islas Canarias)
        // const northEast = L.latLng(47.0, 15.0);   // Noreste (noreste de España)
        // const bounds = L.latLngBounds(southWest, northEast);

        const map = L.map(mapRef.current, {
            center: [40.4637, -3.7492], // Coordenadas iniciales centradas en España
            zoom: 10,
            minZoom: 10,
            maxZoom: 20,
            // maxBounds: bounds,
            // maxBoundsViscosity: 1.0,
            // zoomControl: false, // Desactivar controles de zoom
            dragging: false, // Desactivar arrastre del mapa
            scrollWheelZoom: false, // Desactivar zoom con la rueda del ratón
            doubleClickZoom: false, // Desactivar zoom con doble clic
            boxZoom: false, // Desactivar zoom con la selección de una caja
            keyboard: false, // Desactivar controles del teclado
            tap: false // Desactivar interacciones táctiles
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

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
        }).addTo(map).start();

        return () => {
            map.remove(); // Limpiar el mapa y sus listeners cuando el componente se desmonte
        };
    }, []);

    return (
        <div>
            <div ref={mapRef} style={{ height: '150px'}}></div>
        </div>
    );
}
