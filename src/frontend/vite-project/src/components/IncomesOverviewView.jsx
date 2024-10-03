import { ResumeTitle } from './ResumeTitle.jsx'
import { TransactionPanel } from './TransactionPanel.jsx'
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export function IncomesOverviewView() {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state;
    console.log(state); 

    const [incomes, setIncomes] = useState([]);
    const [incomes_amount, setIncomesAmount] = useState(null);
    const [cashIncomes, setCashIncomes] = useState(0);
    const [cardIncomes, setCardIncomes] = useState(0);
    const currentMonth = new Date().getMonth() + 1;

    useEffect(() => {
        axios.get(`http://localhost:8000/total_incomes/${currentMonth}`)
            .then(response => {
                console.log('response:', response);
                setIncomes(response.data.incomes);
                setIncomesAmount(response.data.amount);
                setCashIncomes(response.data.cash);
                setCardIncomes(response.data.card);
            })
            .catch(error => {
                console.error('Error fetching the incomes:', error);
            });
    }, []);

    const handleAllIncomesViewClick = () => {
        navigate('/transactions', { state: { transaction_type:"incomes" } });
    };

    return (
        <div>
            <ResumeTitle amount={incomes_amount} title="Ingresos este mes" card={cardIncomes} cash={cashIncomes} currency="€"/>

            <div className="divider"></div>

            <div>
                <p><strong>Ingresos de este mes</strong></p>
                <TransactionPanel transactions={incomes}/>
            </div> 

            <div className="divider"></div>

            <div className="panel flex w-full justify-evenly">
                <button onClick={handleAllIncomesViewClick} style={{ background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Ver todos mis ingresos</button>
            </div>

            <div className="divider"></div>


        </div>
    );
}