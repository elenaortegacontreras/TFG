import { ResumeTitle } from './ResumeTitle.jsx'
import { PieChart } from './PieChart.jsx';

import { useNavigate } from 'react-router-dom';

import React, { useEffect, useState } from 'react';
import axios from 'axios';


export function HomeView() {
    
    const [expenses_amount, setExpensesAmount] = useState(null);
    const [savings_amount, setSavingsAmount] = useState(null);
    const [incomes_amount, setIncomesAmount] = useState(null);
    const [amount, setAmount] = useState(null);
    const [cashExpenses, setCashExpenses] = useState(0);
    const [cardExpenses, setCardExpenses] = useState(0);
    const [cashIncomes, setCashIncomes] = useState(0);
    const [cardIncomes, setCardIncomes] = useState(0);
    const [cashSavings, setCashSavings] = useState(0);
    const [cardSavings, setCardSavings] = useState(0);
    const [cash, setCash] = useState(0);
    const [card, setCard] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:8000/total_expenses')
            .then(response => {
                setExpensesAmount(response.data.amount);
                setCashExpenses(response.data.cash);
                setCardExpenses(response.data.card);
            })
            .catch(error => {
                console.error('Error fetching the expenses:', error);
            });
    }, []);

    useEffect(() => {
        axios.get('http://localhost:8000/total_savings')
            .then(response => {
                setSavingsAmount(response.data.amount);
                setCashSavings(response.data.cash);
                setCardSavings(response.data.card);
            })
            .catch(error => {
                console.error('Error fetching the savings:', error);
            });
    }, []);

    useEffect(() => {
        axios.get('http://localhost:8000/total_incomes')
            .then(response => {
                setIncomesAmount(response.data.amount);
                setCashIncomes(response.data.cash);
                setCardIncomes(response.data.card);
            })
            .catch(error => {
                console.error('Error fetching the incomes:', error);
            });
    }, []);

    useEffect(() => {
        if (expenses_amount !== null && savings_amount !== null && incomes_amount !== null) {
            setAmount(incomes_amount - savings_amount - expenses_amount);
            setCash(cashIncomes - cashSavings - cashExpenses);
            setCard(cardIncomes - cardSavings - cardExpenses);
        }
    }, [expenses_amount, savings_amount, incomes_amount, cashExpenses, cashSavings, cashIncomes, cardExpenses, cardSavings, cardIncomes]);

    const handleExpensesOverviewClick = () => {
        navigate('/expenses-overview', { state: {cashExpenses, cardExpenses, expenses_amount} });
    };

    const handleSavingsOverviewClick = () => {
        navigate('/savings-overview', { state: {cashSavings, cardSavings, savings_amount} });
    };

    //TODO: valorar hacer las peticiones desde aquí y pasar los datos
    const handleAllIncomesViewClick = () => {
        navigate('/transactions', { state: { transaction_type:"incomes" } });
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

                <button style={{ backgroundColor: "gold" }} onClick={handleExpensesOverviewClick}>
                    <p>Gastos</p>
                    <p>{expenses_amount} €</p>
                </button>
                <button style={{ backgroundColor: "orange" }} onClick={handleSavingsOverviewClick}>
                    <p>Ahorros</p>
                    <p>{savings_amount} €</p>
                </button>
                <button style={{ backgroundColor: "tomato" }} onClick={handleAllIncomesViewClick}>
                    <p>Ingresos</p>
                    <p>{incomes_amount} €</p>
                </button>
                <PieChart expenses_amount={expenses_amount} savings_amount={savings_amount} incomes_amount={incomes_amount} />
                    {/* <PieChart expenses_amount="500" savings_amount="200" incomes_amount="800" /> */}
                
           
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