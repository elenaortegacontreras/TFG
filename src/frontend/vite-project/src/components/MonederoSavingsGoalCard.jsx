import iconoAhorro from '../assets/hucha_ahorro-bg.png';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export function MonederoSavingsGoalCard({ currency}) { //currentMonthAmount,  currentMonthCashSavings, currentMonthCardSavings, currency}) {
    const navigate = useNavigate();

    const [walletAmount, setWalletAmount] = useState(null);
    const [walletCash, setWalletCash] = useState(null);
    const [walletCard, setWalletCard] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:8000/global_wallet')
            .then(response => {
                setWalletAmount(response.data.amount);
                setWalletCash(response.data.cash);
                setWalletCard(response.data.card);
            })
            .catch(error => {
                console.error('Error fetching the savings:', error);
            });
    }, []);

    const handleWalletSavingsViewClick = () => {
        navigate('/wallet-savings');
    };

    return (
        <div className="card-body flex flex-col justify-center items-center">
            <h2 className="card-title flex flex-col justify-center items-center">
                <div className="flex flex-row">   
                    <img
                        className="h-14"
                        src={iconoAhorro}
                        alt="ahorro"
                        />
                    <p style={{ paddingTop: '10px' }}><strong>Ahorro global</strong></p>
                </div>     
                <p>Ahorro acumulado de los monederos de meses anteriores</p>
            </h2>
            <div className="flex items-center space-x-2">
                <div className="stats stats-vertical lg:stats-horizontal shadow">
                    <div className="stat">
                        <div className="stat-title">Total ahorrado</div>
                        <div className="stat-value">{walletAmount} {currency}</div>
                        <div className="stat-actions">
                        <button onClick={handleWalletSavingsViewClick} style={{ background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Ver movimientos</button>
                        </div>
                    </div>
                    <div className="stat">
                        <div className="stat-title">Digital</div>
                        <div className="stat-value">{walletCard} {currency}</div>
                        <div className="stat-actions">
                            <button className="btn btn-sm btn-primary">Sacar ahorro</button>
                        </div>
                    </div>
                        <div className="stat">
                        <div className="stat-title">Efectivo</div>
                        <div className="stat-value">{walletCash} {currency}</div>
                        <div className="stat-actions">
                            <button className="btn btn-sm btn-primary">Sacar ahorro</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}