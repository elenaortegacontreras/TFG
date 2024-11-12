import React from 'react';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const processData = (savings) => {
    const dataByMonth = savings.reduce((acc, transaction) => {
        const date = new Date(transaction.insert_date);
        const yearMonth = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`; // Ensure month is 2 digits
        if (!acc[yearMonth]) {
            acc[yearMonth] = 0;
        }
        acc[yearMonth] += transaction.amount;
        return acc;
    }, {});

    const labels = Object.keys(dataByMonth).sort();
    const data = labels.map(month => dataByMonth[month]);

    return { labels, data };
};

export function SavingsLineChart({ savings }) {
    const { labels, data } = processData(savings);

    const chartData = {
        labels: labels.map(date => {
            const [year, month] = date.split('-');
            const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
            const monthName = monthNames[parseInt(month) - 1];
            const currentYear = new Date().getFullYear();
            const displayYear = year < currentYear ? `, ${year}` : '';
            return `${monthName}${displayYear}`;
        }),
        datasets: [
            {
                label: 'Ahorros Mensuales',
                data: data,
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99, 102, 241, 0.2)',
                pointBackgroundColor: '#6366f1',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: '#6366f1',
            }
        ]
    };

    const options = {
        scales: {
            x: {
                ticks: {
                    font: {
                        size: 16 // Tamaño de letra para las etiquetas del eje X
                    }
                }
            },
            y: {
                ticks: {
                    font: {
                        size: 16 // Tamaño de letra para las etiquetas del eje Y
                    }
                }
            }
        },
        plugins: {
            legend: {
                labels: {
                    font: {
                        size: 16 // Tamaño de letra para las etiquetas de la leyenda
                    }
                }
            }
        }
    };

    return (
        <div>
            <Line data={chartData} options={options} />
        </div>
    );
}
