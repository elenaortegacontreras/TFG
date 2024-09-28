import { Title } from './Title.jsx'
import { TransactionPanel } from './TransactionPanel.jsx'
import { SavingsLineChart } from './SavingsLineChart.jsx';
import { LoadingDots } from './LoadingDots.jsx';
import { ActionsMenuEditDelete } from './ActionsMenuEditDelete.jsx';
import { useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
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
                <p className="text-center">{state.current_amount_saved} / {state.target_amount} {state.currency}</p>

                <div className="max-w-sm mx-auto">
                    {savings.length !== 0 ? (
                        <SavingsLineChart savings={savings} className="max-w-sm mx-auto"/>
                    ) : (
                        <LoadingDots />
                    )}
                </div>
                
                { state.name !== "Otros" && (
                    <div className="flex justify-end px-20">
                        <ActionsMenuEditDelete element_type="goal" element_id={state.id}/>
                    </div>
                )}

                <div className="divider"></div>

                <div>
                    <p>Movimientos</p>
                    <div className="divider"></div>
                    <TransactionPanel transactions={savings}/>
                </div>

                <div className="divider"></div>

                <div className="panel flex w-full justify-evenly">
                    <div className="card grid h-20 place-items-center">
                        <p className="font-semibold" >Fecha comienzo</p>
                        <p>{new Date(state.insert_date).toLocaleDateString('es-ES')}</p>
                    </div>
                    <div className="divider divider-horizontal"></div>
                    <div className="card grid h-20 place-items-center">
                        <p className="font-semibold" >Fecha límite</p>
                        <p>{new Date(state.target_date).toLocaleDateString('es-ES')}</p>
                    </div>
                </div>

            </div>
        </div>
    );
};