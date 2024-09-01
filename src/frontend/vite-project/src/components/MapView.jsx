import { Title } from './Title.jsx'
import { LoadingDots } from './LoadingDots.jsx';

import React, { useEffect, useState } from 'react';
import axios from 'axios';


import { MapContainer, TileLayer, Marker } from 'react-leaflet';


export function MapView() {   
    
    const [expensesByLocation, setExpensesByLocation] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8000/expenses_by_location_and_coordinates')
            .then(response => {
                setExpensesByLocation(response.data);
            })
            .catch(error => {
                console.error('Error fetching the expenses:', error);
            });
    }, []);

    

    // ...

    return (
        <div>
            <Title title="Mapa de gastos por municipio" />

            <div className="divider"></div>

            {expensesByLocation ? (
                <MapContainer center={[37.1512306, -3.6167146]} zoom={13} style={{ height: '400px', width: '100%' }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    {expensesByLocation.map((expense, index) => (
                        <Marker key={index} position={[expense.latitude, expense.longitude]} />
                    ))}
                </MapContainer>
            ) : (
                <LoadingDots />
            )}

            <div className="divider"></div>
        </div>
    );
};