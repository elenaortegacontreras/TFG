import { Title } from './Title.jsx'
import { TransactionPanel } from './TransactionPanel.jsx'
import { SavingsLineChart } from './SavingsLineChart.jsx';
import { LoadingDots } from './LoadingDots.jsx';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

export function SavingView(){
    const location = useLocation();
    const state = location.state;
    console.log(state); 

    const [savings, setSavings] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:8000/savings/${state.id}`)
            .then(response => {
                setSavings(response.data);
            })
            .catch(error => {
                console.error('Error fetching the savings:', error);
            });
    }, []);

    return (
        <div>
            <Title title={state.name}/>
            <div>
                <p>{state.description}</p>
                <progress className="progress w-56" value={state.current_amount_saved} max={state.target_amount}></progress>

                <div className="max-w-sm mx-auto">
                    {savings.length !== 0 ? (
                        <SavingsLineChart savings={savings} className="max-w-sm mx-auto"/>
                    ) : (
                        <LoadingDots />
                    )}
                </div>

                <div className="divider"></div>

                <div>
                    <p>Movimientos</p>
                    <div className="divider"></div>
                    <TransactionPanel transactions={savings}/>
                </div>

                <div className="divider"></div>

                <div className="panel flex w-full justify-evenly">
                    <div className="card grid h-20 place-items-center">
                        <p>Fecha comienzo</p>
                        <p>{state.insert_date}</p>
                    </div>
                    <div className="divider divider-horizontal"></div>
                    <div className="card grid h-20 place-items-center">
                        <p>Fecha límite</p>
                        <p>{state.target_date}</p>
                    </div>
                </div>

            </div>
        </div>
    );
};