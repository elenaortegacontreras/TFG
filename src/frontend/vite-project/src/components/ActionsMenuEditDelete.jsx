import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function ActionsMenuEditDelete({ element_type, element_id, setSuccessMessage, setErrorMessage }) {

    const [showSubcategoryMenu, setShowSubcategoryMenu] = useState(false);
    const [subcategories, setSubcategories] = useState([]);

    const navigate = useNavigate();

    // ---------------------------- Handle delete click ----------------------------

    const handleDeleteClick = async () => {
        if ( element_type === 'Expense' || element_type === 'Income' || element_type === 'Saving') {  // ya no es con transaction -> Expense /Saving /Income
            try {
                await axios.delete(`http://localhost:8000/transactions/${element_id}`);
                setSuccessMessage('Movimiento eliminado');
                setErrorMessage('');
            } catch (error) {
                console.error(error);
                setErrorMessage('No se pudo eliminar el movimiento');
                setSuccessMessage('');
            }
        } else if ( element_type === 'category') {
            try {
                await axios.delete(`http://localhost:8000/categories/${element_id}`);
                console.log('Categoría eliminada');
            } catch (error) {
                console.error(error);
                console.log('No se pudo eliminar la categoría');
            }         
        } else if ( element_type === 'goal') {
            try {
                await axios.delete(`http://localhost:8000/goals/${element_id}`);
                console.log('Objetivo eliminado');
            } catch (error) {
                console.error(error);
                console.log('No se pudo eliminar el objetivo');
            }         
        }
    };

    const handleDeleteClickSubcategory = async (id) => {
        if (id !== null) {
            try {
                await axios.delete(`http://localhost:8000/subcategories/${id}`);
                console.log('Subcategoría eliminada');
            } catch (error) {
                console.error(error);
                console.log('No se pudo eliminar la subcategoría');
            } 
        }
    };

    useEffect(() => {
        axios.get(`http://localhost:8000/subcategories/${element_id}`)
            .then(response => {
                setSubcategories(response.data);
            })
            .catch(error => {
                console.error('Error fetching the subcategories:', error);
            });
    }, []);

    const handleDeleteSubcategory = () => {
        setShowSubcategoryMenu(true);
    };
    // ---------------------------- Handle delete click ----------------------------

    // const closeSubcategoryMenu = () => {
    //     setShowSubcategoryMenu(false);
    // };


    // ---------------------------- Handle edit click ----------------------------

    const handleEditClick = async () => {
        if (element_type === 'Saving') {
            navigate('/form-saving', { state: { transaction_id: element_id } });
        } else if (element_type === 'Expense') {
            navigate('/form-expense', { state: { transaction_id: element_id } });
        } else if (element_type === 'Income') {
            navigate('/form-income', { state: { transaction_id: element_id } });
        } else if (element_type === 'category') {
            navigate('/form-category', { state: { category_id: element_id } });
        } else if (element_type === 'goal') {
            navigate('/form-goal', { state: { goal_id: element_id } });
        };
    };
    // ---------------------------- Handle edit click ----------------------------

    return (
        <div>
            {element_type === 'Expense' || element_type === 'Income' || element_type === 'Saving' ? (
                <div className="dropdown dropdown-end">
                    <div role="button" tabIndex="0" className="btn m-1" style={{backgroundColor: 'transparent'}}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#4f46e5" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                        </svg>
                    </div>
                    <ul tabIndex="0" className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                        <li onClick={handleEditClick}>
                            <a>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                </svg>
                                Editar
                            </a>
                        </li>
                        <li onClick={handleDeleteClick}>
                            <a>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                                Eliminar
                            </a>
                        </li>
                    </ul>
                </div>
            ) : element_type === 'goal' ? (
                <div className="dropdown dropdown-end">
                    <div role="button" tabIndex="0" className="btn m-1" style={{backgroundColor: 'transparent'}}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#4f46e5" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                        </svg>
                    </div>
                    <ul tabIndex="0" className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                        <li onClick={handleEditClick}>
                            <a>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                </svg>
                                Editar objetivo
                            </a>
                        </li>
                        <li onClick={handleDeleteClick}>
                            <a>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                                Eliminar objetivo
                            </a>
                        </li>
                    </ul>
                </div>
            ) : element_type === 'category' ? (
                <div className="dropdown dropdown-end">
                    <div role="button" tabIndex="0" className="btn m-1">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#4f46e5" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                        </svg>
                    </div>
                    <ul tabIndex="0" className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                        <li onClick={handleEditClick}>
                            <a>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                </svg>
                                Editar categoría
                            </a>
                        </li>
                        <li onClick={handleDeleteClick}>
                            <a>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                                Eliminar categoría
                            </a>
                        </li>
                        <li onClick={handleDeleteSubcategory}>
                            <a>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                                Eliminar subcategoría
                            </a>
                        </li>

                        {showSubcategoryMenu && (
                            <>
                            <h2 className="font-medium">Eliminar subcategoría</h2>
                            {subcategories.map((subcategory) => (
                                <li key={subcategory.id} >
                                    <a onClick={() => handleDeleteClickSubcategory(subcategory.id)} className="text-left w-full">{subcategory.name}</a>  
                                </li>
                            ))}
                            </>
                        )}

                    </ul>
                </div>
            ) : null}

        </div>
        );
};