import { ResumeTitle } from './ResumeTitle.jsx'
import { CategoryBudgetPanel } from './CategoryBudgetPanel.jsx'
import { CategoriesDoughnutChart } from './CategoriesDoughnutChart.jsx';
import { LoadingDots } from './LoadingDots.jsx';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';


export function ExpensesOverviewView() {   
    const location = useLocation();
    const state = location.state;
    console.log(state);
    
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8000/categories_with_amounts')
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
            <ResumeTitle amount={state.expenses_amount} title="Este mes llevas gastados" card={state.cardExpenses} cash={state.cashExpenses} currency="€"/>

            <div className="divider"></div>

            <div className="max-w-sm mx-auto">
                {categories.length !== 0 ? (
                    <CategoriesDoughnutChart categories={categories} className="max-w-sm mx-auto"/>
                ) : (
                    <LoadingDots />
                )}
            </div>

            <div className="divider"></div>

            <div>
                <p>Presupuestos de gastos del mes</p>
                <div className="divider"></div>
                <CategoryBudgetPanel budgets={categories}/>
            </div>
            
            <div className="divider"></div>

            <div className="panel flex w-full justify-evenly">
                <button onClick={handleAllExpensesViewClick} style={{ background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Ver todos mis gastos</button>
            </div>

            <div className="divider"></div>

        </div>
    );
};