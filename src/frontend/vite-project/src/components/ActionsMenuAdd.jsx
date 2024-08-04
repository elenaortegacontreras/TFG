import { useNavigate } from 'react-router-dom';

export function ActionsMenuAdd( { action, category_id } ) {
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

    const handleAddCategory = () => {
        navigate('/form-category');
    };

    const handleAddGoal = () => {
        navigate('/form-goal');
    };

    const handleAddSubCategory = () => {
        navigate('/form-subcategory', { state: { category_id } });
    };

    return (
        <div className="dropdown dropdown-top dropdown-end">
            <button className="btn rounded-full bg-indigo-600 hover:bg-indigo-500" >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="size-6 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
            </button>

        { action === "home_actions" ? ( 
            <ul tabIndex="0" className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                <li onClick={handleAddIncome}><a>Añadir ingreso</a></li>
                <li onClick={handleAddSaving}><a>Añadir ahorro</a></li>
                <li onClick={handleAddExpense}><a>Añadir gasto</a></li>
            </ul>
        ) : action === "expenses_actions" ? (
            <ul tabIndex="0" className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                <li onClick={handleAddCategory}><a>Crear categoría de gasto</a></li>
                <li onClick={handleAddExpense}><a>Añadir gasto</a></li>
            </ul>

        ) : action === "savings_actions" ? (
            <ul tabIndex="0" className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                <li onClick={handleAddGoal}><a>Crear objetivo de ahorro</a></li>
                <li onClick={handleAddSaving}><a>Añadir ahorro</a></li>
            </ul> 

        ) : action === "add_subcategory" && category_id !== ""? (
            <ul tabIndex="0" className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                <li onClick={handleAddSubCategory}><a>Crear subcategoría</a></li>
            </ul> 

        ) : (
            <div>
                NO BUTTON
        </div>
        )}
        </div>
    );
};