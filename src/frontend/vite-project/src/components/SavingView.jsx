import { Title } from './Title.jsx'
import { TransactionPanel } from './TransactionPanel.jsx'
import { SavingsLineChart } from './charts/SavingsLineChart.jsx';
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
    const currentMonth = new Date().getMonth() + 1;
    const [currentMonthAmount, setCurrentMonthAmount] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:8000/savings/${state.id}`)
            .then(response => {
                setSavings(response.data);
            })
            .catch(error => {
                console.error('Error fetching the savings:', error);
            });
    }, []);

    useEffect(() => {
        axios.get(`http://localhost:8000/total_savings_goal/${state.id}/${currentMonth}`)
            .then(response => {
                setCurrentMonthAmount(response.data.amount);
            })
            .catch(error => {
                console.error('Error fetching the savings:', error);
            });
    }, []);

    const current_month_savings = savings.filter(saving => {
        const savingDate = new Date(saving.insert_date);
        return savingDate.getMonth() + 1 === currentMonth;
    });

    const other_months_savings = savings.filter(expense => {
        const expenseDate = new Date(expense.insert_date);
        return expenseDate.getMonth() + 1 !== currentMonth;
    });

    return (
        <div>
            <Title title={state.name}/>
            <div>
                <p>{state.description}</p>
                <progress className="progress w-56" value={state.current_amount_saved} max={state.target_amount}></progress>
                <p className="text-center">{state.current_amount_saved} / {state.target_amount} {state.currency}</p>
                <p className="text-indigo-600"> Este mes: {currentMonthAmount} {state.currency}</p>

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
                    <div>
                        <p><strong>Ahorros de este mes</strong></p>
                        <TransactionPanel transactions={current_month_savings}/>
                        <div className="divider"></div>
                        <p><strong>Otros ahorros</strong></p>
                        <TransactionPanel transactions={other_months_savings}/>
                    </div> 
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