import React, { useEffect, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

export function BarChart({ incomes_amount, expenses_amount, savings_amount }) {
    const chartRef = useRef(null);

    const data = {
        labels: ['Ingresos', 'Ahorros', 'Gastos'],
        datasets: [
            {
                // label: 'Distribución Financiera',
                data: [incomes_amount, savings_amount, expenses_amount],
                backgroundColor: ['#111827', '#374151', '#6b7280'],
                hoverBackgroundColor: ['#111827B0', '#374151B0', '#6b7280B0']
            }
        ]
    };

    const options = {
        // scales: {
        //     y: {
        //         beginAtZero: true
        //     }
        // },
        plugins: {
            legend: {
                display: false
            },
        }
    };

    useEffect(() => {
        const chart = chartRef.current;

        return () => {
            if (chart) {
                chart.destroy();
            }
        };
    }, []);

    return (
        <div>
            <Bar ref={chartRef} data={data} options={options} />
        </div>
    );
}

