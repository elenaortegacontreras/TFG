import { ResumeTitle } from './ResumeTitle.jsx'
import { SavingGoalPanel } from './SavingGoalPanel.jsx'
import { SavingsLineChart } from './SavingsLineChart.jsx';
import { LoadingDots } from './LoadingDots.jsx';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export function SavingsOverviewView() {
    const location = useLocation();
    const state = location.state;
    console.log(state); 
    const navigate = useNavigate();

    const [savingGoals, setSavingGoals] = useState([]);
    const [savings, setSavings] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8000/goals_with_amounts')
            .then(response => {
                setSavingGoals(response.data);
            })
            .catch(error => {
                console.error('Error fetching the saving goals:', error);
            });
    }, []);

    useEffect(() => {
        axios.get('http://localhost:8000/savings')
            .then(response => {
                setSavings(response.data);
            })
            .catch(error => {
                console.error('Error fetching the savings:', error);
        });
    }, []);

    const handleAllSavingsViewClick = () => {
        navigate('/transactions', { state: { transaction_type:"savings" } });
    };
    
    return (
        <div>
            <ResumeTitle amount={state.savings_amount} title="Este mes llevas ahorrados" card={state.cardSavings} cash={state.cashSavings} currency="€"/>

            <div className="divider"></div>

            <div className="max-w-sm mx-auto">
                {savings.length !== 0 ? (
                    <SavingsLineChart savings={savings} className="max-w-sm mx-auto"/>
                ) : (
                    <LoadingDots />
                )}
            </div>

            <div className="divider"></div>

            <div>
                <p>Objetivos de ahorro</p>
                <div className="divider"></div>
                <SavingGoalPanel saving_goals={savingGoals}/>
            </div>

            <div className="divider"></div>

            <div className="panel flex w-full justify-evenly">
                <button onClick={handleAllSavingsViewClick} style={{ background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Ver todos mis ahorros</button>
            </div>

            <div className="divider"></div>

        </div>
    );
};