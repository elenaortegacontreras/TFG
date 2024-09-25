import React, { useEffect, useState, useRef } from 'react';
import L from 'leaflet';
import 'leaflet.locatecontrol';
import axios from 'axios';
import { LoadingDots} from './LoadingDots.jsx';

export function FindLocationMiniMap(props) {
    const mapRef = useRef(null);
    const mapInstance = useRef(null); // Almacenar la instancia del mapa
    const [searchStr, setSearchStr] = useState(""); 
    const [potentialShops, setPotentialShops] = useState([]);
    const [location, setLocation] = useState(null);
    const [showLoadingDots, setShowLoadingDots] = useState(false);

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

        const loadAndAddShop = async () => {
            if (props.selectedShop ) {
                L.marker([props.selectedShop.lat, props.selectedShop.lon]).addTo(mapInstance.current)
                  .bindPopup(props.selectedShop.name);
                  mapInstance.current.setView([props.selectedShop.lat, props.selectedShop.lon], 13);
            }
        };

        console.log('Selected Shop:', props.selectedShop);

        loadAndAddShop();

        return () => {
            mapInstance.current.remove();
            mapInstance.current = null;
        };
    }, [props.selectedShop]);

    const capitalize = (str) => {
        const exceptions = ["de", "la", "los", "del", "y", "o", "en", "a", "el", "al"];
    
        return str
            .split(' ')
            .map((word, index, arr) => {
                // Si la palabra está en las excepciones y no es la primera palabra, no la capitaliza
                if (exceptions.includes(word.toLowerCase()) && index !== 0 && index !== arr.length - 1) {
                    return word.toLowerCase();
                } else {
                    // Capitaliza la primera letra y mantiene el resto de la palabra // en minúsculas
                    return word.charAt(0).toUpperCase() + word.slice(1); //.toLowerCase();
                }
            })
            .join(' ');
    };

    const getCoords = async () => {
        if (!props.postalCode) return;

        try {
            const response = await axios.get(`http://localhost:8000/latlon/${props.postalCode}`);
            if (response.data) {
                console.log('Response:', response.data);
                const { latitude, longitude } = response.data;
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

    const handleSearchPlace = async (e) => {
        setShowLoadingDots(true);
        e.preventDefault();

        if (!searchStr || !props.postalCode) {
            alert("Por favor, ingrese el código postal y el nombre del comercio.");
            return;
        }

        const coordinates = await getCoords();
        console.log('Postal Code:', props.postalCode);
        console.log('Coordinates:', coordinates);
        if (!coordinates) return;

        const { lat, lon } = coordinates;
        // const lat = 37.1438607;
        // const lng = -3.6273500;
        const meters = 2000; // Radio de búsqueda

        const overpassQuery = `
            [out:json];
            (
            node["name"~"${capitalize(searchStr)}"](around:${meters}, ${lat}, ${lon});
            node["shop"~"${capitalize(searchStr)}"](around:${meters}, ${lat}, ${lon});
            node["amenity"~"${capitalize(searchStr)}"](around:${meters}, ${lat}, ${lon});
            node["addr:street"~"${capitalize(searchStr)}"](around:${meters}, ${lat}, ${lon});
            );
            out body;

        `;
        const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`;

        try {
            const response = await axios.get(url);
            setPotentialShops(response.data.elements);
            props.onPotentialShopsChange(response.data.elements);
            if (mapInstance.current) {
                mapInstance.current.setView([lat, lon], 13); // Centrar el mapa en la ubicación del código postal
            }
        } catch (error) {
            console.error('Error fetching places:', error);
        }
        setShowLoadingDots(false);
    };

    return (
        <div>
            <div ref={mapRef} style={{ height: '150px' }}></div>
            <div className="mt-2 flex">
                <input
                    type="text" 
                    value={searchStr} 
                    onChange={(e) => setSearchStr(e.target.value)} 
                    placeholder="Buscar por nombre de comercio / calle" 
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                <button onClick={handleSearchPlace} className="ml-2">Buscar</button>
            </div>
                
            {showLoadingDots && <LoadingDots />}
        </div>
    );
}
