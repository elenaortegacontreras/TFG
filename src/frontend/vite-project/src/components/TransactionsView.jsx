import { Title } from './Title.jsx'
import { TransactionPanel } from './TransactionPanel.jsx'
import { LoadingDots } from "./LoadingDots.jsx";
import { useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export function TransactionsView() {
    const location = useLocation();
    const state = location.state;
    console.log(state); 

    const currentMonth = new Date().getMonth() + 1;
    console.log('currentMonth:', currentMonth);

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
        } 
        else if (state.transaction_type === 'all') {
            axios.get('http://localhost:8000/transactions')
                .then(response => {
                    setAllTransactions(response.data);
                })
                .catch(error => {
                    console.error('Error fetching all the transactions:', error);
                });
        }
    }, []);

    const current_month_incomes = incomes.filter(income => {
        const incomeDate = new Date(income.insert_date);
        return incomeDate.getMonth() + 1 === currentMonth;
    });

    const other_months_incomes = incomes.filter(income => {
        const incomeDate = new Date(income.insert_date);
        return incomeDate.getMonth() + 1 !== currentMonth;
    });

    const current_month_savings = savings.filter(saving => {
        const savingDate = new Date(saving.insert_date);
        return savingDate.getMonth() + 1 === currentMonth;
    });

    const other_months_savings = savings.filter(expense => {
        const expenseDate = new Date(expense.insert_date);
        return expenseDate.getMonth() + 1 !== currentMonth;
    });

    const current_month_expenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.insert_date);
        return expenseDate.getMonth() + 1 === currentMonth;
    });

    const other_months_expenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.insert_date);
        return expenseDate.getMonth() + 1 !== currentMonth;
    });

    const current_month_allTransactions = allTransactions.filter(transaction => {
        const transactionDate = new Date(transaction.insert_date);
        return transactionDate.getMonth() + 1 === currentMonth;
    });

    const other_months_allTransactions = allTransactions.filter(transaction => {
        const transactionDate = new Date(transaction.insert_date);
        return transactionDate.getMonth() + 1 !== currentMonth;
    });

    return (
        <div>
            {state.transaction_type === 'incomes' ? (
                <>
                    <Title title="Todos mis ingresos" />
                    <div>
                        <p><strong>Ingresos de este mes</strong></p>
                        <TransactionPanel transactions={current_month_incomes} />
                        <div className="divider"></div>
                        <p><strong>Otros ingresos</strong></p>
                        <TransactionPanel transactions={other_months_incomes} />
                    </div>                
                </>
            ) : state.transaction_type === 'savings' ? (
                <>
                    <Title title="Todos mis ahorros" />
                    <div>
                        <p><strong>Ahorros de este mes</strong></p>
                        <TransactionPanel transactions={current_month_savings} />
                        <div className="divider"></div>
                        <p><strong>Otros ahorros</strong></p>
                        <TransactionPanel transactions={other_months_savings} />
                    </div>   
                </>
            ) : state.transaction_type === 'expenses' ? (
                <>
                    <Title title="Todos mis gastos" />
                    <div>
                        <p><strong>Gastos de este mes</strong></p>
                        <TransactionPanel transactions={current_month_expenses} />
                        <div className="divider"></div>
                        <p><strong>Otros gastos</strong></p>
                        <TransactionPanel transactions={other_months_expenses} />
                    </div>   
                </>
            ) : state.transaction_type === 'all' ? (
                <>
                    <Title title="Movimientos monedero" />
                    <div>
                        <p><strong>Movimientos de este mes</strong></p>
                        <TransactionPanel transactions={current_month_allTransactions} transaction_view="all"/>
                        <div className="divider"></div>
                        <p><strong>Otros movimientos</strong></p>
                        <TransactionPanel transactions={other_months_allTransactions} transaction_view="all"/>
                    </div>   
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
