import { useState, useEffect } from 'react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { Title } from './Title.jsx';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

export function FormSaving() {
  const location = useLocation();
  const state = location.state;
  console.log(state);

  const [amount, setAmount] = useState('');
  const [name, setConcept] = useState('');
  const [selectedGoal, setSelectedGoal] = useState('');
  const [payment_method, setPaymentMethod] = useState('');
  const [insertDate, setInsertDate] = useState('');
  const [savingGoals, setSavingGoals] = useState([]);

  const navigate = useNavigate();
  let savingGoals_list = [];

  useEffect(() => {
    axios.get('http://localhost:8000/goals')
        .then(response => {
          savingGoals_list = response.data;
          setSelectedGoal(savingGoals_list.find(goal => goal.name === "Otros"));
          setInsertDate(new Date().toISOString().split('T')[0]);
          setSavingGoals(savingGoals_list);
          })
          .catch(error => {
            console.error('Error fetching the goals:', error);
        });

    if(state.transaction_id) {
      axios.get(`http://localhost:8000/transaction/${state.transaction_id}`)
        .then(response => {
          const saving = response.data;
          setAmount(saving.amount);
          setConcept(saving.name);
          setInsertDate(new Date(saving.insert_date).toISOString().split('T')[0]);
          handleGoalChange(savingGoals_list.find(goal => goal.id === saving.saving_goal_id));
          setPaymentMethod(saving.payment_method);
        })
        .catch(error => {
            console.error('Error fetching saving data:', error);
        });
    }
  }, []);

  const handleGoalChange = (saving_goal) => {
    setSelectedGoal(saving_goal);
  };

  const handlePaymentMethodChange = (type) => {
    setPaymentMethod(type);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const newSaving = {
      amount: parseFloat(amount),
      name,
      saving_goal_id: selectedGoal.id,
      payment_method,
      user_id: 1,
      transaction_type: "Saving",
      insert_date: insertDate ? insertDate : null,
    };

    if (state.transaction_id) {
      try {
        await axios.put(`http://localhost:8000/transaction/${state.transaction_id}`, newSaving);
        console.log('Ahorro actualizado con éxito');
        navigate('/transactions', { state: { transaction_type: "savings" } });
      } catch (error) {
        console.error('Error al actualizar ahorro:', error.response.statusText);
      };

    }else{
      try {
        await axios.post('http://localhost:8000/transactions', newSaving);
        console.log('Ahorro creado con éxito');
        navigate('/transactions', { state: { transaction_type: "savings" } });
      } catch (error) {
        console.error('Error al crear ahorro:', error.response.statusText);
      };
    };
  }

  const handleCancel = () => {
    navigate('/transactions', { state: { transaction_type: "savings" } });
  }
    

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">  
      { state.transaction_id ? (
        <Title title="Editar Ahorro" />
      ) : (
        <Title title="Añadir Ahorro" />
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
                onChange={(e) => setConcept(e.target.value)}
                required
                placeholder='Ej. Ahorro para el viaje'
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
            <label htmlFor="selectedGoal" className="block text-sm font-medium leading-6 text-gray-900">
              Objetivo de Ahorro
            </label>
            <div className="mt-2">
              <Menu as="div" className="relative inline-block text-left w-full">
                <div>
                  <MenuButton className="inline-flex w-full justify-between gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                    {selectedGoal ? selectedGoal.name : 'Seleccionar objetivo'}
                    <ChevronDownIcon aria-hidden="true" className="-mr-1 h-5 w-5 text-gray-400" />
                  </MenuButton>
                </div>
                <MenuItems className="absolute z-10 mt-2 w-full origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  {savingGoals.map((saving_goal) => (
                    <MenuItem
                      key={saving_goal.id}
                      as="button"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      onClick={() => handleGoalChange(saving_goal)}
                    >
                      {saving_goal.name}
                    </MenuItem>
                  ))}
                </MenuItems>
              </Menu>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium leading-6 text-gray-900">Tipo de Ahorro</label>
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
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 my-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
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
