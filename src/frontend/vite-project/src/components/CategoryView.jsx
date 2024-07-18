import { Title } from './Title.jsx'
import { TransactionPanel } from './TransactionPanel.jsx'
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

export function CategoryView() {
    const location = useLocation();
    const state = location.state; 
    
    console.log(state); 

    const [expenses, setExpenses] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:8000/expenses/${state.id}`)
            .then(response => {
                setExpenses(response.data);
            })
            .catch(error => {
                console.error('Error fetching the expenses:', error);
            });
    }, []);

    return (        
        <div>
            <Title title={state.name}/>
            <div>
                <p>{state.description}</p>
                <progress className="progress w-56" value={state.current_amount_spent} max={state.budget_amount}></progress>
                <div className="flex justify-center">
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSusawchJOB2j6kQxqZQdFB6BrK5LtquwlLvQ&s" alt="placeholder" />
                </div>

                <div className="divider"></div>

                <div>
                    <p>Movimientos</p>
                    <div className="divider"></div>
                    <TransactionPanel transactions={expenses}/>
                </div>

                <div className="divider"></div>

            </div>
        </div>
    );
};