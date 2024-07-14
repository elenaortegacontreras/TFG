import { Title } from './Title.jsx'
import { TransactionPanel } from './TransactionPanel.jsx'
import { useLocation } from 'react-router-dom';

export function CategoryView() {
        const location = useLocation();
        const state = location.state; // Aquí tienes acceso al estado pasado
    
        console.log(state); // { key: 'value' }

    return (        
        <div>
            <Title title={state.name}/>
            <div>
                <p>{state.description}</p>
                <progress className="progress w-56" value={state.amount_spent} max={state.budget_amount}></progress>
                <div className="flex justify-center">
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSusawchJOB2j6kQxqZQdFB6BrK5LtquwlLvQ&s" alt="placeholder" />
                </div>

                <div className="divider"></div>

                {/* solo una preview (limitar ej. a 3) de las últimas transacciones de esta categoría */}
                <div>
                    <p>Movimientos</p>
                    <div className="divider"></div>
                    <TransactionPanel />
                </div>

                <div className="divider"></div>

                <div className="panel flex w-full justify-evenly">
                    <a href="/transactions">Ver más</a>
                </div>

            </div>
        </div>
    );
};