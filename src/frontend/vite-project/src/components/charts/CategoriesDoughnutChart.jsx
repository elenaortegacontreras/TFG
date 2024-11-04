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
    
    // indigo
    // const colors = [
    //     '#4B0082', '#EDE7F6', '#3A007D', '#D1C4E9', '#31006A', '#B39DDB',
    //     '#260055', '#9575CD', '#20004A', '#7E57C2', '#170036', '#673AB7',
    //     '#0D0022', '#5E35B1', '#7986CB', '#3F51B5', '#3949AB', '#C5CAE9'
    // ];
    

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
