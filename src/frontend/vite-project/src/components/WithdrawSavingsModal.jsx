
import { useNavigate } from 'react-router-dom';
import { useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import axios from 'axios';

export function WithdrawSavingsModal( {type, max_amount, currency} ){
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('submitting form');
    // si es menor o igual a la cantidad máxima permitida
    //ejecutar la transaccion con el endpoint
    if (amount) {
        console.log('amount:', amount);
  
      const newGlobalSaving = {
        amount: parseFloat(amount),
        name: "De ahorro global a monedero mes",
        payment_method: type,
        user_id: 1,
        transaction_type: "GlobalSaving",
      };
  
      console.log('newGlobalSaving:', newGlobalSaving);
  
      try {
        await axios.post('http://localhost:8000/transactions', newGlobalSaving);
        console.log('Ahorro sacado con éxito');
        navigate('/wallet-savings');
      } catch (error) {
        console.error('Error al sacar ahorro:', error);
      }
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
                            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                <DialogTitle as="h3" className="text-base font-semibold leading-6 text-gray-900">
                                    Sacar dinero del ahorro global
                                </DialogTitle>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-500">
                                        La cantidad que saques irá al monedero de este mes
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="col-span-full bg-gray-50">
                        <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                            <div className="text-center">
                                <label htmlFor="amount" className="block text-sm font-medium leading-6 text-gray-900">
                                {type === "Card" ? <p> Cantidad digital</p> : <p>Cantidad efectivo</p>}
                                </label>
                                <div className="mt-2">
                                <input
                                    type="number"
                                    id="amount"
                                    name="amount"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    step="0.01"
                                    required
                                    placeholder='0.00'
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    max={max_amount}
                                />
                                <p>Cantidad máxima {max_amount} {currency}</p>
                            </div>
                            
                                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                    <button
                                        type="submit"
                                        data-autofocus //?
                                        onClick={() => {
                                            setOpen(false);
                                        }}
                                        className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto"
                                        disabled={parseFloat(amount) > parseFloat(max_amount)}
                                    >
                                        Sacar ahorro
                                    </button>
                                    <button
                                        type="button"
                                        data-autofocus
                                        onClick={() => setOpen(false)}
                                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                        >
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    </form>
                </DialogPanel>
            </div>
        </div>
    </Dialog>
)
}