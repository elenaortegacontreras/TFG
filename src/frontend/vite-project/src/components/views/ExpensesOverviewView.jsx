import { ResumeTitle } from '../ResumeTitle.jsx'
import { CategoryBudgetPanel } from '../CategoryBudgetPanel.jsx'
import { CategoriesDoughnutChart } from '../charts/CategoriesDoughnutChart.jsx';
import { LoadingDots } from '../LoadingDots.jsx';
import { ActionsMenuAdd } from '../ActionsMenuAdd.jsx';

import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';


export function ExpensesOverviewView() {   
    
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [expenses_amount, setExpensesAmount] = useState(null);
    const [cashExpenses, setCashExpenses] = useState(0);
    const [cardExpenses, setCardExpenses] = useState(0);
    const currentMonth = new Date().getMonth() + 1;

    useEffect(() => {
        axios.get(`http://localhost:8000/total_expenses/${currentMonth}`)
            .then(response => {
                // setExpenses(response.data.expenses);
                setExpensesAmount(response.data.amount);
                setCashExpenses(response.data.cash);
                setCardExpenses(response.data.card);
            })
            .catch(error => {
                console.error('Error fetching the expenses:', error);
            });
    }, []);

    useEffect(() => {
        axios.get(`http://localhost:8000/categories_with_amounts/${currentMonth}`)
            .then(response => {
                setCategories(response.data);
            })
            .catch(error => {
                console.error('Error fetching the categories:', error);
            });
    }, []);

    const handleAllExpensesViewClick = () => {
        navigate('/transactions', { state: { transaction_type:"expenses" } });
    };

    return (
        <div>
            <ResumeTitle amount={expenses_amount} title="Este mes llevas gastados" card={cardExpenses} cash={cashExpenses} currency="€"/>

            <div className="divider"></div>

            <div className="max-w-sm mx-auto">
                {categories.length !== 0 ? (
                    <CategoriesDoughnutChart categories={categories} className="max-w-sm mx-auto"/>
                ) : (
                    <LoadingDots />
                )}
            </div>

            <div className="flex justify-end px-20">
                <ActionsMenuAdd action="expenses_actions" category_id=""/>
            </div>

            <div className="divider"></div>

            <div>
                <p>Presupuestos de gastos del mes</p>
                <div className="divider"></div>
                <CategoryBudgetPanel budgets={categories}/>
                <p></p>
            </div>
            
            <div className="divider"></div>

            <div className="panel flex w-full justify-evenly">
                <button onClick={handleAllExpensesViewClick} style={{ background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
                <p>Ver todos mis gastos</p></button>
            </div>

            <div className="divider"></div>

        </div>
    );
};