import { Title } from './Title.jsx'
import { TransactionPanel } from './TransactionPanel.jsx'
import { LoadingDots } from "./LoadingDots.jsx";
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

// TODO: añadir aquí posibilidad de mostrar todas las transacciones
// donde según el tipo de transacción cada movimiento
// se muestre de la forma correspondiente a sus campos

export function TransactionsView() {
    const location = useLocation();
    const state = location.state;
    console.log(state); 

    const [savings, setSavings] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [incomes, setIncomes] = useState([]);
    const [allTransactions, setAllTransactions] = useState([]);
    

    useEffect(() => {
        if (state.transaction_type === 'savings') {
            axios.get('http://localhost:8000/savings_with_names')
                .then(response => {
                    setSavings(response.data);
                })
                .catch(error => {
                    console.error('Error fetching the savings:', error);
                });
        } else if (state.transaction_type === 'expenses') {
            axios.get('http://localhost:8000/expenses_with_names')
                .then(response => {
                    setExpenses(response.data);
                })
                .catch(error => {
                    console.error('Error fetching the expenses:', error);
                });
        } else if (state.transaction_type === 'incomes') {
            axios.get('http://localhost:8000/incomes')
                .then(response => {
                    setIncomes(response.data);
                })
                .catch(error => {
                    console.error('Error fetching the incomes:', error);
                });
        } else if (state.transaction_type === 'all') {
            axios.get('http://localhost:8000/transactions')
                .then(response => {
                    setAllTransactions(response.data);
                })
                .catch(error => {
                    console.error('Error fetching all the transactions:', error);
                });
        }
    }, []);

    return (
        <div>
            {state.transaction_type === 'incomes' ? (
                <>
                    <Title title="Ingresos" />
                    <TransactionPanel transactions={incomes} />
                </>
            ) : state.transaction_type === 'savings' ? (
                <>
                    <Title title="Ahorros" />
                    <TransactionPanel transactions={savings} />
                </>
            ) : state.transaction_type === 'expenses' ? (
                <>
                    <Title title="Gastos" />
                    <TransactionPanel transactions={expenses} />
                </>
            ) : (
                <>
                    <Title title="Movimientos" />
                    <LoadingDots />
                </>
            )}
        </div>  
    );
};
