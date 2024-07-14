import { Title } from './Title.jsx'
import { TransactionPanel } from './TransactionPanel.jsx'
import { useLocation } from 'react-router-dom';

export function SavingView(){ // {name, description, current_amount_saved, target_amount, target_date, currency }) {
    const location = useLocation();
    const state = location.state; // Aquí tienes acceso al estado pasado
  
    console.log(state); // { key: 'value' }

    return (
        <div>
            <Title title={state.name}/>
            <div>
                <p>{state.description}</p>
                <progress className="progress w-56" value={state.current_amount_saved} max={state.target_amount}></progress>
                <div className="flex justify-center">
                    <img src="https://tudashboard.com/wp-content/uploads/2021/06/Barras-y-linea.jpg" alt="placeholder" />
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

                <div className="divider"></div>

                <div className="panel flex w-full justify-evenly">
                    <div className="card grid h-20 place-items-center">
                        <p>Fecha comienzo</p>
                        <p>{state.insert_date}</p>
                    </div>
                    <div className="divider divider-horizontal"></div>
                    <div className="card grid h-20 place-items-center">
                        <p>Fecha límite</p>
                        <p>{state.target_date}</p>
                    </div>
                </div>

            </div>
        </div>
    );
};