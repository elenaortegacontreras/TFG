import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

export function CategoriesDoughnutChart({ categories }) {
    const budgetNames = categories.map(budget => budget.name);
    const amountsSpent = categories.map(budget => budget.current_amount_spent);

    const colors = [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
        '#FF6384A0', '#36A2EBA0', '#FFCE56A0', '#4BC0C0A0', '#9966FFA0', '#FF9F40A0',
        '#FF6384B0', '#36A2EBB0', '#FFCE56B0', '#4BC0C0B0', '#9966FFB0', '#FF9F40B0'
    ];
    
    const data = {
        labels: budgetNames,
        datasets: [
            {
                label: budgetNames,
                data: amountsSpent,
                backgroundColor: colors,
                hoverBackgroundColor: colors,
            }
        ]
    };

    return (
        <div>
            <Doughnut data={data} />
        </div>
    );
}
