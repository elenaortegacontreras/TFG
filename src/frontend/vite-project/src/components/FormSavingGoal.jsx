import { useState, useEffect } from 'react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { Title } from './Title.jsx';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export function FormSavingGoal() {
  const [amount, setAmount] = useState('');
  const [name, setConcept] = useState('');
  const [description, setDescription] = useState('');
  const [targetDate, setTargetDate] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const newGoal = {
      target_amount: parseFloat(amount),
      name,
      description,
      user_id: 1,
      target_date: targetDate ? targetDate : null,
    };
    
    try {
      await axios.post('http://localhost:8000/goals', newGoal);
      console.log('Goal created successfully');
      navigate('/savings-overview');
    } catch (error) {
      console.error('Error creating goal:', error.response.statusText);
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <Title title="Añadir objetivo de ahorro" />

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium leading-6 text-gray-900">
              Objetivo
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
              Pon nombre a tu objetivo
            </label>
            <div className="mt-2">
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={(e) => setConcept(e.target.value)}
                required
                placeholder="Ej. Viaje a Noruega"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
              Descripción
            </label>
            <div className="mt-2">
              <textarea
                id="description"
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                // required
                placeholder='Ej. Ahorro para viajar a Noruega con amigos'
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label htmlFor="target_date" className="block text-sm font-medium leading-6 text-gray-900">
              Marca una fecha límite para conseguirlo
            </label>
            <div className="mt-2">
              <input
                type="date"
                id="target_date"
                name="target_date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                required
                placeholder='dd/mm/aaaa'
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
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
