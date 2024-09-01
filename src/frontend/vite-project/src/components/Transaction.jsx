import { ActionsMenuEditDelete } from "./ActionsMenuEditDelete";

export function Transaction({transaction_id, transaction_type, name, category_name, subcategory_name, saving_goal_name, payment_method, amount, insert_date, currency, shop_location_pc, setSuccessMessage, setErrorMessage}) {
    const modalId = `transaction_info_${transaction_id}`;

    const formattedDate = new Date(insert_date).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });

    return (
        <div>
            <div className="px-2 flex items-center justify-between">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold tracking-tight text-gray-900">{amount}</h1>
                    <p className="text-xl tracking-tight text-gray-900">{currency}</p>
                    <p className="px-4">{name}</p>
                </div>
                <div className="flex items-center justify-between self-end">
                    <p className="px-4">{formattedDate}</p>
                    <button className="btn btn-icon" onClick={()=>document.getElementById(modalId).showModal()} style={{backgroundColor: 'transparent'}}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#4f46e5" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                        </svg>
                    </button>
                    <ActionsMenuEditDelete element_type={transaction_type} element_id={transaction_id} setSuccessMessage={setSuccessMessage} setErrorMessage={setErrorMessage}/>
                    <dialog id={modalId} className="modal">
                        <div className="modal-box">
                            <form method="dialog">
                            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                            </form>
                            <h3 className="font-bold text-lg">{name}</h3>
                            {transaction_type === "Expense" && (
                                <>
                                <div className="py-4">
                                    <p>Categoría</p>
                                    <p>{category_name}</p>
                                </div>
                                <div className="py-4">
                                    <p>Subcategoría</p>
                                    <p>{subcategory_name}</p>
                                </div>
                                </>
                            )}
                            {transaction_type === "Saving" && (
                                <>
                                <div className="py-4">
                                    <p>Objetivo de ahorro</p>
                                    <p>{saving_goal_name}</p>
                                </div>
                                </>
                            )}
                            <div className="py-4">
                                <p>Método de pago</p>
                                <p>{payment_method}</p>
                            </div>
                            <div className="py-4">
                                <p>Cantidad</p>
                                <p>{amount} {currency}</p>
                            </div>
                            <div className="py-4">
                                <p>Fecha</p>
                                <p>{formattedDate}</p>
                            </div>
                            {transaction_type === "Expense" && (
                            <>
                                <div className="py-4">
                                    <p>Código postal</p>
                                    <p>{shop_location_pc}</p>
                                </div>
                            </>
                            )}
                        </div>
                    </dialog>
                </div>
            </div>
        </div>
    );
};
