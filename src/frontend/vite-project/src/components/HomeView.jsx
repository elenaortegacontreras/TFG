import { ResumeTitle } from './ResumeTitle.jsx'
import { useNavigate } from 'react-router-dom';

import React, { useEffect, useState } from 'react';
import axios from 'axios';

export function HomeView() {
    
    const [expenses_amount, setExpensesAmount] = useState(null);
    const [savings_amount, setSavingsAmount] = useState(null);
    const [incomes_amount, setIncomesAmount] = useState(null);
    const [amount, setAmount] = useState(null);
    const [cash, setCash] = useState(0);
    const [card, setCard] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:8000/total_expenses')
            .then(response => {
                setExpensesAmount(response.data.amount);
                setCash(cash + response.data.cash);
                setCard(card + response.data.card);
            })
            .catch(error => {
                console.error('Error fetching the expenses:', error);
            });
    }, []);

    useEffect(() => {
        axios.get('http://localhost:8000/total_savings')
            .then(response => {
                setSavingsAmount(response.data.amount);
                setCash(cash + response.data.cash);
                setCard(card + response.data.card);
            })
            .catch(error => {
                console.error('Error fetching the savings:', error);
            });
    }, []);

    useEffect(() => {
        axios.get('http://localhost:8000/total_incomes')
            .then(response => {
                setIncomesAmount(response.data.amount);
                setCash(cash + response.data.cash);
                setCard(card + response.data.card);
            })
            .catch(error => {
                console.error('Error fetching the incomes:', error);
            });
    }, []);

    useEffect(() => {
        if (expenses_amount !== null && savings_amount !== null && incomes_amount !== null) {
            setAmount(expenses_amount - savings_amount - incomes_amount);
        }
    }, [expenses_amount, savings_amount, incomes_amount]);

    const handleExpensesOverviewClick = () => {
        navigate('/expenses-overview');
    };

    const handleSavingsOverviewClick = () => {
        navigate('/savings-overview');
    };



    return (
        <div>
            {amount !== null ? (
                <ResumeTitle amount={amount} title="Monedero" card={card} cash={cash} currency="€"/>
            ) : (
                <ResumeTitle amount="loading" title="Monedero" card="loading" cash="loading" currency="€"/>
            )}

            <div>

                <div className="divider"></div>

                <button onClick={handleExpensesOverviewClick}>Gastos</button>{expenses_amount}
                <button onClick={handleSavingsOverviewClick}>Ahorros</button>{savings_amount}
                {/* <button onClick={handleIncomesOverviewClick}>Ingresos</button>{incomes_amount} */}
                <button>Ingresos</button>{incomes_amount}

            
                <div className="flex justify-center">
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSusawchJOB2j6kQxqZQdFB6BrK5LtquwlLvQ&s" alt="placeholder" />
                </div>
           
                <div className="divider"></div>

            
                <div className="panel flex w-full justify-evenly">
                    <a>Ver más</a>
                    <div className="divider divider-horizontal"></div>
                    <a>Ver mapa</a>
                </div>

            </div>
        </div>
    );
}