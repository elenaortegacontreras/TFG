import { ResumeTitle } from '../ResumeTitle.jsx'
import { SavingGoalPanel } from '../SavingGoalPanel.jsx'
import { SavingsLineChart } from '../charts/SavingsLineChart.jsx';
import { LoadingDots } from '../LoadingDots.jsx';
import { ActionsMenuAdd } from '../ActionsMenuAdd.jsx';
import { MonederoSavingsGoalCard } from '../MonederoSavingsGoalCard.jsx';

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
    // const [savings, setSavings] = useState([]);
    const [allSavings, setAllSavings] = useState([]);
    const [savings_amount, setSavingsAmount] = useState(null);
    const [cashSavings, setCashSavings] = useState(0);
    const [cardSavings, setCardSavings] = useState(0);
    const currentMonth = new Date().getMonth() + 1;

    useEffect(() => {
        axios.get(`http://localhost:8000/total_savings/${currentMonth}`)
            .then(response => {
                // setSavings(response.data.savings);
                setSavingsAmount(response.data.amount);
                setCashSavings(response.data.cash);
                setCardSavings(response.data.card);
            })
            .catch(error => {
                console.error('Error fetching the savings:', error);
            });
    }, []);

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
                setAllSavings(response.data);
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
            <ResumeTitle amount={savings_amount} title="Este mes llevas ahorrados" card={cardSavings} cash={cashSavings} currency="€"/>

            <div className="divider"></div>

            <div className="max-w-sm mx-auto">
                {allSavings.length !== 0 ? (
                    <SavingsLineChart savings={allSavings} className="max-w-sm mx-auto"/>
                ) : (
                    <LoadingDots />
                )}
            </div>

            <div className="flex justify-end px-20">
                <ActionsMenuAdd action="savings_actions" category_id=""/>
            </div>

            <div className="divider"></div>

            <div>
                <p>Objetivos de ahorro</p>
                <div className="divider"></div>
                <SavingGoalPanel saving_goals={savingGoals}/>
            </div>

            <MonederoSavingsGoalCard currency="€"/>

            <div className="divider"></div>

            <div className="panel flex w-full justify-evenly">
                <button onClick={handleAllSavingsViewClick} style={{ background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Ver todos mis ahorros</button>
            </div>

            <div className="divider"></div>

        </div>
    );
};