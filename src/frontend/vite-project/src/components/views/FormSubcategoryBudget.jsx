import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { Title } from '../Title.jsx';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

export function FormSubcategoryBudget() {
  const location = useLocation();
  const state = location.state;
  console.log(state);

  const [name, setConcept] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const newGoal = {
      name,
      category_id: state.category_id,
      // user_id: 1,
    };
    try {
      await axios.post('http://localhost:8000/subcategories', newGoal);
      console.log('Subcategory created successfully');
      navigate('/expenses-overview');
    } catch (error) {
      console.log('newGoal:', newGoal); 
      console.error('Error creating subcategory:', error.response?.data?.message || error.response.statusText);
    }
    
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <Title title="Crear subcategoría" />

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
            <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
              Pon nombre a la subcategoría
            </label>
            <div className="mt-2">
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={(e) => setConcept(e.target.value)}
                required
                placeholder="Ej. Mantenimiento coche"
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
