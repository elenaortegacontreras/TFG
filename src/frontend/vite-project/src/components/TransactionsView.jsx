import { Title } from './Title.jsx'
import { TransactionPanel } from './TransactionPanel.jsx'



export function TransactionsView({title}) {
    return (
        <div>
            {/* <Title title={title} /> */}
            <Title title="Transacciones, movimientos..." />
            <TransactionPanel />
        </div>  
    );
};
