import { useState, useEffect } from 'react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { Title } from '../Title.jsx';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

export function FormCategoryBudget() {
  const location = useLocation();
  const state = location.state;
  console.log(state);

  const [amount, setAmount] = useState('');
  const [name, setConcept] = useState('');
  const [description, setDescription] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    console.log('stateCategory:', state);
    if (state.category_id) {
      axios.get(`http://localhost:8000/category/${state.category_id}`)
        .then(response => {
          const category = response.data;
          console.log('category:', category);
          setAmount(category.budget_amount);
          setConcept(category.name);
          setDescription(category.description);
        })
        .catch(error => {
          console.error('Error fetching category data:', error);
        });
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const newCategory = {
      budget_amount: parseFloat(amount),
      name,
      description,
      user_id: 1,
    };

    console.log('newCategory:', newCategory);
    
    if (state.category_id) {
      try {
        await axios.put(`http://localhost:8000/category/${state.category_id}`, newCategory);
        console.log('Categoría actualizada con éxito');
        navigate('/expenses-overview');
      } catch (error) {
        console.error('Error al actualizar categoría:', error.response.statusText);
      };

    }else{
      try {
        await axios.post('http://localhost:8000/categories', newCategory);
        console.log('Categoría creada con éxito');
        navigate('/expenses-overview');
      } catch (error) {
        console.error('Error al crear categoría:', error.response.statusText);
      };
    };
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      { state.category_id ? (
        <Title title="Editar categoría" />
      ) : (
        <Title title="Crear categoría" />
      )}

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium leading-6 text-gray-900">
              Presupuesto
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
              Pon nombre a la categoría
            </label>
            <div className="mt-2">
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={(e) => setConcept(e.target.value)}
                required
                placeholder="Ej. Casa"
                maxLength={20}
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
                placeholder='Ej. Gastos de la casa'
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              { state.category_id ? (
                <p>Editar</p>
              ) : (
                <p>Crear</p>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
