import React, { useEffect, useState, useRef } from 'react';
import L from 'leaflet';
import 'leaflet.locatecontrol';
import axios from 'axios';

export function FindLocationMiniMap() {
    const mapRef = useRef(null);
    const mapInstance = useRef(null); // Ref para almacenar la instancia del mapa
    const [places, setPlaces] = useState([]);
    const [searchTerm, setSearchTerm] = useState(""); // Campo de búsqueda para el nombre de la tienda
    const [postalCode, setPostalCode] = useState(""); // Campo de búsqueda para el código postal
    const [location, setLocation] = useState(null); // Para almacenar las coordenadas de geocodificación

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

        return () => {
            mapInstance.current.remove(); // Limpiar el mapa al desmontar el componente
            mapInstance.current = null; // Asegurarse de que la referencia se reinicie
        };
    }, []);

    const getCoords = async () => {
        if (!postalCode) return;

        try {
            const response = await axios.get(`http://localhost:8000/latlon/${postalCode}`);
            if (response.data) {
                console.log('Response:', response.data);
                const { latitude, longitude } = response.data;
                setLocation({ lat: latitude, lon: longitude });
                return { lat: latitude, lon: longitude };
            } else {
                console.error('No se encontró una ubicación para ese código postal.');
                return null;
            }
        } catch (error) {
            console.error('Error getting coords from postal code:', error);
            return null;
        }
    };

    // Función para manejar la búsqueda de lugares cuando se hace clic en el botón "Buscar"
    const handleSearchPlace = async (e) => {
        e.preventDefault(); // Evitar comportamiento predeterminado del botón de formulario

        if (!searchTerm || !postalCode) {
            alert("Por favor, ingrese el código postal y el nombre del comercio.");
            return;
        }

        // Obtener las coordenadas del código postal
        const coordinates = await getCoords();
        console.log('Coordinates:', coordinates);
        if (!coordinates) return;

        const { lat, lon } = coordinates;

        const overpassQuery = `
            [out:json];
            (
              node["name"~"${searchTerm}"]["shop"](around:8000,${lat},${lon});
              node["name"~"${searchTerm}"]["amenity"~"restaurant|cafe|bar"](around:8000,${lat},${lon});
              node["name"~"${searchTerm}"]["leisure"](around:8000,${lat},${lon});
            );
            out body;
        `;
        const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`;

        try {
            const response = await axios.get(url);
            setPlaces(response.data.elements); // Actualiza el estado con los lugares encontrados
            if (mapInstance.current) {
                mapInstance.current.setView([lat, lon], 15); // Centrar el mapa en la ubicación del código postal
            }
        } catch (error) {
            console.error('Error fetching places by name:', error);
        }
    };

    return (
        <div>
            <div ref={mapRef} style={{ height: '150px' }}></div>
            <div>
                <h3>Búsqueda de Tiendas</h3>
                <div>
                    <input
                        type="text"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        placeholder="Ingresar código postal..."
                    />
                    <input 
                        type="text" 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)} 
                        placeholder="Buscar por nombre de tienda..." 
                    />
                    <button onClick={handleSearchPlace}>Buscar</button> {/* The button triggers the search */}
                </div>

                <h3>Lugares Encontrados</h3>
                <ul>
                    {places.length > 0 ? (
                        places.map((place) => (
                            <li key={place.id}>
                                {place.tags.name || 'Sin Nombre'} - {place.tags.shop || place.tags.amenity || place.tags.leisure || 'Otro'}
                            </li>
                        ))
                    ) : (
                        <li>No se encontraron lugares con ese nombre.</li>
                    )}
                </ul>
            </div>
        </div>
    );
}
