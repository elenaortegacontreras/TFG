import { Title } from '../Title.jsx'
import { TransactionPanel } from '../TransactionPanel.jsx'
import { CategoriesDoughnutChart } from '../charts/CategoriesDoughnutChart.jsx';
import { LoadingDots } from '../LoadingDots.jsx';
import { SubcategoriesList } from '../SubcategoriesList.jsx';
import { ActionsMenuAdd } from '../ActionsMenuAdd.jsx';
import { ActionsMenuEditDelete } from '../ActionsMenuEditDelete.jsx';
import { useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export function CategoryView() {
    const location = useLocation();
    const state = location.state;
    console.log(state);

    const [expenses, setExpenses] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const currentMonth = new Date().getMonth() + 1;

    useEffect(() => {
        axios.get(`http://localhost:8000/expenses/${state.id}`)
            .then(response => {
                setExpenses(response.data);
            })
            .catch(error => {
                console.error('Error fetching the expenses:', error);
            });
    }, []);

    useEffect(() => {
        axios.get(`http://localhost:8000/subcategories_with_amounts/${state.id}/${currentMonth}`)
            .then(response => {
                setSubcategories(response.data);
                console.log(`http://localhost:8000/subcategories_with_amounts/${state.id}/${currentMonth}`);
                console.log('subcategories:', response.data);
            })
            .catch(error => {
                console.error('Error fetching the subcategories:', error);
            });
    }, []);

    const current_month_expenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.insert_date);
        return expenseDate.getMonth() + 1 === currentMonth;
    });

    return (
        <div>
            <Title title={state.name} />
            <div>
                <p>{state.description}</p>
                <progress className="progress w-56" value={state.current_amount_spent} max={state.budget_amount}></progress>
                <p className="text-center">{state.current_amount_spent} / {state.budget_amount} {state.currency}</p>

                <div className="max-w-sm mx-auto">
                    {subcategories.length !== 0 ? (
                        <CategoriesDoughnutChart categories={subcategories} className="max-w-sm mx-auto" />
                    ) : (
                        <LoadingDots />
                    )}
                </div>

                <div className="flex justify-end px-20">
                    <SubcategoriesList subcategories={subcategories} />
                    <ActionsMenuAdd action="add_subcategory" category_id={state.id} />
                    {state.name !== "Otros" && (
                        <ActionsMenuEditDelete element_type="category" element_id={state.id}/>
                    )}
                </div>

                <div className="divider"></div>

                <div>
                    <p><strong>Gastos de este mes</strong></p>
                    <TransactionPanel transactions={current_month_expenses}/>
                </div>

            </div>
        </div>
    );
};