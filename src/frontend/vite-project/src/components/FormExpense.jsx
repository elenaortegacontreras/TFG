import { useState, useEffect } from 'react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { Title } from './Title.jsx';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export function FormExpense() {
  const [amount, setAmount] = useState('');
  const [name, setConcept] = useState('');
  const [date, setDate] = useState('');
  const [shopId, setShopId] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [payment_method, setPaymentMethod] = useState('');
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/categories')
      .then(response => {
        setCategories(response.data);
        setSelectedCategory(response.data[0]);
      })
      .catch(error => {
        console.error('Error fetching the categories:', error);
      });
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      axios.get(`http://localhost:8000/subcategories/${selectedCategory.id}`)
        .then(response => {
          setSubcategories(response.data);
          setSelectedSubcategory(response.data[0]);
        })
        .catch(error => {
          console.error('Error fetching the subcategories:', error);
        });
    }
  }, [selectedCategory]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSelectedSubcategory(null);
  };

  const handleSubcategoryChange = (subcategory) => {
    setSelectedSubcategory(subcategory);
  };

  const handlePaymentMethodChange = (type) => {
    setPaymentMethod(type);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const newExpense = {
      amount: parseFloat(amount),
      name,
      date,
      shop_id: shopId ? shopId : null,
      category_id: selectedCategory.id,
      subcategory_id: selectedSubcategory ? selectedSubcategory.id : null,
      payment_method,
      user_id: 1,
      transaction_type: "Expense",
    };

    try {
      await axios.post('http://localhost:8000/transactions', newExpense);
      console.log('Gasto creado con éxito');
      navigate('/transactions', { state: { transaction_type: "expenses" } });
    } catch (error) {
      console.error('Error al crear gasto:', error.response.statusText);
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <Title title="Añadir Gasto" />

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
            <label htmlFor="shop_id" className="block text-sm font-medium leading-6 text-gray-900">
              Shop ID
            </label>
            <div className="mt-2">
              <input
                type="text"
                id="shop_id"
                name="shop_id"
                value={shopId}
                onChange={(e) => setShopId(e.target.value)}
                // required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label htmlFor="category_id" className="block text-sm font-medium leading-6 text-gray-900">
              Categoría
            </label>
            <div className="mt-2">
              <Menu as="div" className="relative inline-block text-left w-full">
                <div>
                  <MenuButton className="inline-flex w-full justify-between gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                    {selectedCategory ? selectedCategory.name : 'Seleccionar categoría'}
                    <ChevronDownIcon aria-hidden="true" className="-mr-1 h-5 w-5 text-gray-400" />
                  </MenuButton>
                </div>
                <MenuItems className="absolute z-10 mt-2 w-full origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  {categories.map((category) => (
                    <MenuItem
                      key={category.id}
                      as="button"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      onClick={() => handleCategoryChange(category)}
                    >
                      {category.name}
                    </MenuItem>
                  ))}
                </MenuItems>
              </Menu>
            </div>
          </div>

          {selectedCategory && subcategories.length > 0 && (
            <div>
              <label htmlFor="subcategory_id" className="block text-sm font-medium leading-6 text-gray-900">
                Subcategoría
              </label>
              <div className="mt-2">
                <Menu as="div" className="relative inline-block text-left w-full">
                  <div>
                    <MenuButton className="inline-flex w-full justify-between gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                      {selectedSubcategory ? selectedSubcategory.name : 'Seleccionar subcategoría'}
                      <ChevronDownIcon aria-hidden="true" className="-mr-1 h-5 w-5 text-gray-400" />
                    </MenuButton>
                  </div>
                  <MenuItems className="absolute z-10 mt-2 w-full origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    {subcategories.map((subcategory) => (
                      <MenuItem
                        key={subcategory.id}
                        as="button"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        onClick={() => handleSubcategoryChange(subcategory)}
                      >
                        {subcategory.name}
                      </MenuItem>
                    ))}
                  </MenuItems>
                </Menu>
              </div>
            </div>
          )}

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
              className="w-full flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Añadir Gasto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
