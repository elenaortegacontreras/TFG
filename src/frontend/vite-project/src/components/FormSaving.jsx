import { useState, useEffect } from 'react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { Title } from './Title.jsx';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export function FormSaving() {
  const [amount, setAmount] = useState('');
  const [name, setConcept] = useState('');
  const [date, setDate] = useState('');
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [savingGoals, setSavingGoals] = useState([]);
  const [payment_method, setPaymentMethod] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:8000/goals')
        .then(response => {
          setSavingGoals(response.data);
          setSelectedGoal(response.data[0]);
        })
        .catch(error => {
            console.error('Error fetching the goals:', error);
        });
  }, []);

  const handleGoalChange = (saving_goal_id) => {
    setSelectedGoal(saving_goal_id);
  };

  const handlePaymentMethodChange = (type) => {
    setPaymentMethod(type);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const newSaving = {
      amount: parseFloat(amount),
      name,
      date,
      saving_goal_id: selectedGoal.id,
      payment_method,
      user_id: 1,
      transaction_type: "Saving",
    };
    
    try {
      await axios.post('http://localhost:8000/transactions', newSaving);
      console.log('Savings created successfully');
      navigate('/transactions', { state: { transaction_type: "savings" } });
    } catch (error) {
      console.error('Error creating savings:', error.response.statusText);
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <Title title="Añadir Ahorro" />

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
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium leading-6 text-gray-900">
              Fecha
            </label>
            <div className="mt-2">
              <input
                type="date"
                id="date"
                name="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label htmlFor="saving_goal_id" className="block text-sm font-medium leading-6 text-gray-900">
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
                  {savingGoals.map((saving_goal_id) => (
                    <MenuItem
                      key={saving_goal_id.id}
                      as="button"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      onClick={() => handleGoalChange(saving_goal_id)}
                    >
                      {saving_goal_id.name}
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
                className={`w-1/3 py-2 rounded-md font-semibold ${payment_method === 'Tarjeta' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-900 border border-gray-300'}`}
              >
                Tarjeta
              </button>
              <button
                type="button"
                onClick={() => handlePaymentMethodChange('Cash')}
                className={`w-1/3 py-2 rounded-md font-semibold ${payment_method === 'Efectivo' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-900 border border-gray-300'}`}
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
              Añadir
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
