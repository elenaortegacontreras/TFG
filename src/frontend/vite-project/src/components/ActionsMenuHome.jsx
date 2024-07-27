import { useNavigate } from 'react-router-dom';

export function ActionsMenuHome() {
    const navigate = useNavigate();

    const handleAddExpense = () => {
        navigate('/form-expense');
    };

    const handleAddIncome = () => {
        navigate('/form-income');
    };

    const handleAddSaving = () => {
        navigate('/form-saving');
    };

    return (
        <div className="dropdown dropdown-top dropdown-end">
            <button className="btn rounded-full bg-indigo-600 hover:bg-indigo-500" >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="size-6 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
            </button>
        <ul tabIndex="0" className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
            <li onClick={handleAddIncome}><a>Añadir ingreso</a></li>
            <li onClick={handleAddSaving}><a>Añadir ahorro</a></li>
            <li onClick={handleAddExpense}><a>Añadir gasto</a></li>
        </ul>
        </div>    
    );
};