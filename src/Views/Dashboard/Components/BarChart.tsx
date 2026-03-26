import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

type Props = {
    labels: string[];
    data: number[];
    label: string;
    color: string;
};

const BarChart: React.FC<Props> = ({ labels, data, label, color }) => {
    const chartData = {
        labels,
        datasets: [
            {
                label,
                data,
                backgroundColor: color,
                borderRadius: 1,
                barThickness: 12,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                mode: 'index' as const,
                intersect: false,
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
                border: {
                    display: true,
                    color: '#28C591',
                    width: 2,
                },
                ticks: {
                    color: '#666',
                    font: { size: 14 },
                }
            },
            y: {
                grid: {
                    display: false,
                },
                border: {
                    display: true,
                    color: '#28C591',
                    width: 2,
                },
                ticks: {
                    beginAtZero: true,
                    count: 5, // Exactly 5 labels (4 sections)
                    color: '#666',
                    font: { size: 14 },
                },
            },
        },
    };

    return <Bar data={chartData} options={options} />;
};

export default BarChart;