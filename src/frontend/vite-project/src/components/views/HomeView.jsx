import { ResumeTitle } from '../ResumeTitle.jsx'
import { useNavigate } from 'react-router-dom';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart } from '../charts/BarChart.jsx';
import { ActionsMenuAdd } from '../ActionsMenuAdd.jsx';


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

    const currentMonth = new Date().getMonth() + 1;
    const [currentMonthAmount, setCurrentMonthAmount] = useState(null);
    const [currentMonthCash, setCurrentMonthCash] = useState(null);
    const [currentMonthCard, setCurrentMonthCard] = useState(null);

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
        axios.get(`http://localhost:8000/wallet/${currentMonth}`)
            .then(response => {
                setCurrentMonthAmount(response.data.amount);
                setCurrentMonthCash(response.data.cash);
                setCurrentMonthCard(response.data.card);
            })
            .catch(error => {
                console.error('Error fetching the expenses:', error);
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
        navigate('/expenses-overview');
    };

    const handleSavingsOverviewClick = () => {
        navigate('/savings-overview');
    };

    //TODO: valorar hacer las peticiones desde aquí y pasar los datos
    const handleIncomesViewClick = () => {
        navigate('/incomes-overview');
    };

    const handleLocationMapViewClick = () => {
        navigate('/map', { state: { type:"location" } });
    };

    const handleShopMapViewClick = () => {
        navigate('/map', { state: { type:"shop" } });
    };

    const handleAllTransactionsViewClick = () => {
        navigate('/transactions', { state: { transaction_type:"all" } });
    };

    return (
        <div>
            {amount !== null ? (
                <>
                <ResumeTitle amount={currentMonthAmount} title="Monedero del mes" card={currentMonthCard} cash={currentMonthCash} currency="€"/>
                </>
            ) : (
                <ResumeTitle amount="loading" title="Monedero" card="loading" cash="loading" currency="€"/>
            )}

            <div className="panel flex w-full justify-evenly">
                <button onClick={handleAllTransactionsViewClick} style={{ background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
                <p>Ver todos mis movimientos</p></button>
            </div>

            <div>

                <div className="divider"></div>
             
                <div className="text-white flex justify-evenly py-12">
                    <div>
                        <button className="bg-gray-700 rounded-full" onClick={handleIncomesViewClick}>
                            <p>Ingresos</p>
                            <p>{incomes_amount} €</p>
                        </button>
                    </div>
                    <div>
                        <button className="bg-gray-600 rounded-full" onClick={handleSavingsOverviewClick}>
                            <p>Ahorros</p>
                            <p>{savings_amount} €</p>
                        </button>
                    </div>
                    <div>
                        <button className="bg-gray-500 rounded-full" onClick={handleExpensesOverviewClick}>
                            <p>Gastos</p>
                            <p>{expenses_amount} €</p>
                        </button>
                    </div>
                </div>

                <div className="max-w-sm mx-auto">
                    <BarChart expenses_amount={expenses_amount} savings_amount={savings_amount} incomes_amount={incomes_amount} />
                </div>

                <div className="flex justify-end px-20">
                    <ActionsMenuAdd action="home_actions" category_id=""/>
                </div>
            
                <div className="divider"></div>

            
                <div className="panel flex w-full justify-evenly">
                    <div className="panel flex w-full justify-evenly">
                    <button onClick={handleLocationMapViewClick} style={{ background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
                        <p>Mapa municipios</p></button>
                    </div>
                    <div className="divider divider-horizontal"></div>
                    <div className="panel flex w-full justify-evenly">
                    <button onClick={handleShopMapViewClick} style={{ background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
                        <p>Mapa comercios</p></button>
                    </div>
                </div>

            </div>
        </div>
    );
}