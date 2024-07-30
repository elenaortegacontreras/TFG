import { Title } from './Title.jsx'
import { TransactionPanel } from './TransactionPanel.jsx'
import { CategoriesDoughnutChart } from './CategoriesDoughnutChart.jsx';
import { LoadingDots } from './LoadingDots.jsx';
import { ErrorAlert } from './ErrorAlert';
import { SuccessAlert } from './SuccessAlert';

import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

export function CategoryView() {
    const location = useLocation();
    const state = location.state;
    console.log(state);

    const [expenses, setExpenses] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

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
        axios.get(`http://localhost:8000/subcategories_with_amounts/${state.id}`)
            .then(response => {
                setSubcategories(response.data);
            })
            .catch(error => {
                console.error('Error fetching the subcategories:', error);
            });
    }, []);

    return (        
        <div>
            <Title title={state.name}/>
            <div>
                <p>{state.description}</p>
                <progress className="progress w-56" value={state.current_amount_spent} max={state.budget_amount}></progress>
                <div className="max-w-sm mx-auto">
                {subcategories.length !== 0 ? (
                    <CategoriesDoughnutChart categories={subcategories} className="max-w-sm mx-auto"/>
                ) : (
                    <LoadingDots />
                )}
            </div>

                <div className="divider"></div>

                <div>
                    <p>Movimientos</p>
                    <div className="divider"></div>
                    {successMessage && <SuccessAlert message={successMessage} />}
                    {errorMessage && <ErrorAlert message={errorMessage} />}
                    <TransactionPanel transactions={expenses} setSuccessMessage={setSuccessMessage} setErrorMessage={setErrorMessage}/>
                </div>

                <div className="divider"></div>

            </div>
        </div>
    );
};