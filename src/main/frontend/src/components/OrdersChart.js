import React, {useEffect, useState} from 'react';
import {Line} from 'react-chartjs-2';
import 'chart.js/auto';
import {fetchOrderCountData} from "../api/order";

const OrdersChart = () => {
    const [orderData, setOrderData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrderData = async () => {
            try {
                const data = await fetchOrderCountData();
                setOrderData(data);
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch order data', error);
                setLoading(true);
            }
        };

        fetchOrderData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    const labels = orderData.map(order => order.date);
    const orderCounts = orderData.map(order => order.count);

    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Orders per day',
                data: orderCounts,
                fill: false,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true,
            },
        },
        plugins: {
            legend: {
                position: 'top',
                align: 'end',
            },
        },
    };

    return (
        <div>
            <h2>Weekly Orders</h2>
            <Line data={data} options={options} />
        </div>
    );
};

export default OrdersChart;
