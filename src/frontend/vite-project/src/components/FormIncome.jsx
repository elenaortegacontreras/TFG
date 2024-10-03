import { useState, useEffect } from 'react';
import { Title } from './Title.jsx';

import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

export function FormIncome() {
  const location = useLocation();
  const state = location.state;
  console.log(state);
  
  const [amount, setAmount] = useState('');
  const [name, setDescription] = useState('');
  const [payment_method, setPaymentMethod] = useState('');
  const [insertDate, setInsertDate] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    console.log('stateIncome:', state);
    if (state.transaction_id) {
      axios.get(`http://localhost:8000/transaction/${state.transaction_id}`)
        .then(response => {
          const income = response.data;
          console.log('income:', income);
          setAmount(income.amount);
          setDescription(income.name);
          setInsertDate(new Date(income.insert_date).toISOString().split('T')[0]);
          setPaymentMethod(income.payment_method);
        })
        .catch(error => {
          console.error('Error fetching income data:', error);
        });
    }
  }, []);


  const handlePaymentMethodChange = (type) => {
    setPaymentMethod(type);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const newIncome = {
      amount: parseFloat(amount),
      name,
      payment_method,
      user_id: 1,
      transaction_type: "Income",
      insert_date: insertDate ? insertDate : null,
    };

    console.log('newIncome:', newIncome);

    if (state.transaction_id) {
      try {
        await axios.put(`http://localhost:8000/transaction/${state.transaction_id}`, newIncome);
        console.log('Ingreso actualizado con éxito');
        navigate('/transactions', { state: { transaction_type: "incomes" } });
      } catch (error) {
        console.error('Error al actualizar ingreso:', error.response.statusText);
      };

    }else{
      try {
        await axios.post('http://localhost:8000/transactions', newIncome);
        console.log('Ingreso creado con éxito');
        navigate('/transactions', { state: { transaction_type: "incomes" } });
      } catch (error) {
        console.error('Error al crear ingreso:', error.response.statusText);
      };
    };
  };

  const handleCancel = () => {
    navigate('/transactions', { state: { transaction_type: "incomes" } });
  }

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
    { state.transaction_id ? (
      <Title title="Editar Ingreso" />
    ) : (
      <Title title="Añadir Ingreso" />
    )}
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium leading-6 text-gray-900">
              Cantidad
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
              />
            </div>
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
              Concepto
            </label>
            <div className="mt-2">
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={(e) => setDescription(e.target.value)}
                placeholder='Ej. Nómina'
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label htmlFor="insert_date" className="block text-sm font-medium leading-6 text-gray-900">
              Fecha
            </label>
            <div className="mt-2">
              <input
                type="date"
                id="insert_date"
                name="insert_date"
                value={insertDate}
                onChange={(e) => setInsertDate(e.target.value)}
                // required
                placeholder='dd/mm/aaaa'
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium leading-6 text-gray-900">Tipo de Ingreso</label>
            <div className="mt-2 flex justify-around">
              <button
                type="button"
                onClick={() => handlePaymentMethodChange('Card')}
                className={`w-1/3 py-2 rounded-md font-semibold ${payment_method === 'Card' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-900 border border-gray-300'}`}
              >
                Tarjeta
              </button>
              <button
                type="button"
                onClick={() => handlePaymentMethodChange('Cash')}
                className={`w-1/3 py-2 rounded-md font-semibold ${payment_method === 'Cash' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-900 border border-gray-300'}`}
              >
                Efectivo
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              { state.transaction_id ? (
                <p>Editar</p>
              ) : (
                <p>Añadir</p>
              )}
            </button>

            <button onClick={handleCancel}
              type="submit"
              className="flex w-full justify-center rounded-md px-3 py-1.5 my-2 text-sm font-semibold leading-6 bg-white text-gray-900 border border-gray-300"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
