'use client'

import { useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import axios from 'axios';

import { useNavigate } from 'react-router-dom';

export function DeleteModal({ element_type, element_id }) {
    const navigate = useNavigate();

    const [open, setOpen] = useState(true);
    const handleDeleteClick = async (how_many) => {
        if ( element_type === 'Expense' || element_type === 'Income' || element_type === 'Saving'){
            try {
                await axios.delete(`http://localhost:8000/transactions/${element_id}`);
                console.log('Movimiento eliminado');

            } catch (error) {
                console.error(error);
                console.log('No se pudo eliminar el movimiento');
            }
            setOpen(false);
            how_many = "";
            if (element_type === 'Expense') {
                navigate('/transactions', { state: { transaction_type:"expenses" } });
            } else if (element_type === 'Income') {
                navigate('/transactions', { state: { transaction_type:"incomes" } });
            } else if (element_type === 'Saving') {
                navigate('/transactions', { state: { transaction_type:"savings" } });
            }

        } else if (element_type === 'category') {
            if (how_many === "all") {
                try {
                    await axios.delete(`http://localhost:8000/categories/${element_id}/delete_transactions`);
                    console.log('Categoría y movimientos eliminados');

                } catch (error) {
                    console.error(error);
                    console.log('No se pudo eliminar el objetivo');
                }
            }

            if (how_many === "not_all") {
                try {
                    await axios.delete(`http://localhost:8000/categories/${element_id}/move_transactions`);
                    console.log('Categoría eliminada y movimientos transferidos');

                } catch (error) {
                    console.error(error);
                    console.log('No se pudo eliminar el objetivo');
                }
            }

            setOpen(false);
            how_many = "";
            navigate('/expenses-overview');

        } else if (element_type === 'goal') {
            if (how_many === "all") {
                try {
                    await axios.delete(`http://localhost:8000/goals/${element_id}/delete_transactions`);
                    console.log('Objetivo y movimientos eliminados');

                } catch (error) {
                    console.error(error);
                    console.log('No se pudo eliminar el objetivo');
                }
            }

            if (how_many === "not_all") {
                try {
                    await axios.delete(`http://localhost:8000/goals/${element_id}/move_transactions`);
                    console.log('Objetivo eliminado y movimientos transferidos');

                } catch (error) {
                    console.error(error);
                    console.log('No se pudo eliminar el objetivo');
                }
            }

            setOpen(false);
            how_many = "";
            navigate('/savings-overview');

        } else if (element_type = 'subcategory') {
            try {
                await axios.delete(`http://localhost:8000/subcategories/${element_id}/move_transactions`);
                console.log('Subcategoría eliminada');

            } catch (error) {
                console.error(error);
                console.log('No se pudo eliminar la subcategoría');
            }

            setOpen(false);
            navigate('/expenses-overview');
        }
    };

    return (
        <Dialog open={open} onClose={setOpen} className="relative z-10">
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
            />

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <DialogPanel
                        transition
                        className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
                    >
                        <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                            <div className="sm:flex sm:items-start">
                                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                    <ExclamationTriangleIcon aria-hidden="true" className="h-6 w-6 text-red-600" />
                                </div>
                                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                    <DialogTitle as="h3" className="text-base font-semibold leading-6 text-gray-900">
                                        {element_type === 'goal' ? (
                                            <p>Eliminar objetivo de ahorro</p>
                                        ) : element_type === 'category' ? (
                                            <p>Eliminar categoría de gasto</p>
                                        ) : element_type === 'subcategory' ? (
                                            <p>Eliminar subcategoría de gasto</p>
                                        ) : element_type === 'Expense' || element_type === 'Income' || element_type === 'Saving' ? (
                                            <p>Eliminar movimiento</p>
                                        ) : (
                                            <p>Delete Account</p>
                                        )}
                                    </DialogTitle>
                                    <div className="mt-2">
                                        {element_type === 'goal' ? (
                                            <p className="text-sm text-gray-500">¿Estás seguro? Al eliminar tu objetivo tú decides qué hacer con los movimientos,
                                                puedes eliminarlos permanentemente o transferirlos al objetivo de ahorro "Otros".</p>
                                        ) : element_type === 'category' ? (
                                            <p className="text-sm text-gray-500">¿Estás seguro? Al eliminar tu categoría tú decides qué hacer con los movimientos,
                                                puedes eliminarlos permanentemente o transferirlos a la categoría de gasto "Otros".</p>
                                        ) : element_type === 'subcategory' ? (
                                            <p className="text-sm text-gray-500">¿Estás seguro? Al eliminar tu subcategoría tus movimientos se 
                                            transfieren a la subcategoría de gasto "Otros".</p>
                                        ) : element_type === 'Expense' || element_type === 'Income' || element_type === 'Saving' ? (
                                            <p className="text-sm text-gray-500">¿Estás seguro? Esta acción es irreversible.</p>
                                        ) : (
                                            <p className="text-sm text-gray-500">Are you sure you want to deactivate your account? All of your data will be permanently removed.
                                                This action cannot be undone.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                            {element_type === 'goal' ? (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteClick("not_all")}
                                        className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                                    >
                                        Eliminar y transferir
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteClick("all")}
                                        className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                                    >
                                        Eliminar todo
                                    </button>
                                </>
                            ) : element_type === 'category' ? (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteClick("not_all")}
                                        className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                                    >
                                        Eliminar y transferir
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteClick("all")}
                                        className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                                    >
                                        Eliminar todo
                                    </button>
                                </>
                            ) : element_type === 'subcategory' || element_type === 'Expense' || element_type === 'Income' || element_type === 'Saving' ? (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteClick("")}
                                        className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                                    >
                                        Eliminar
                                    </button>
                                </>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setOpen(false)}
                                    className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                                >
                                    Eliminar
                                </button>
                            )}
                            <button
                                type="button"
                                data-autofocus
                                onClick={() => setOpen(false)}
                                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                            >
                                Cancelar
                            </button>
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    )
}