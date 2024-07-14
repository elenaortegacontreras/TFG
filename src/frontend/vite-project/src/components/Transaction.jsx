import React from 'react';

export function Transaction({transaction_id, name, category, subcategory, payment_method, amount, date, currency, shop_id}) {
    const modalId = `transaction_info_${transaction_id}`;
    
    return (
        <div>
            <div className="px-2 py-3 flex items-center justify-between">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">{amount}</h1>
                    <p>{currency}</p>
                    <p className="px-4">{name}</p>
                </div>
                <div className="flex items-center justify-between self-end">
                    <p className="px-4">{date}</p>
                    <button className="btn" onClick={()=>document.getElementById(modalId).showModal()}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                        </svg>
                    </button>
                    <dialog id={modalId} className="modal">
                        <div className="modal-box">
                            <form method="dialog">
                            {/* if there is a button in form, it will close the modal */}
                            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                            </form>
                            <h3 className="font-bold text-lg">{name}</h3>
                            <div className="py-4">
                                <p>Categoría</p>
                                <p>{category}</p>
                            </div>
                            <div className="py-4">
                                <p>Subcategoría</p>
                                <p>{subcategory}</p>
                            </div>
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
                                <p>{date}</p>
                            </div>
                            <div className="py-4">
                                <p>Comercio</p>
                                <p>{shop_id}</p>
                            </div>
                        </div>
                    </dialog>
                </div>
            </div>
        </div>
    );
};
