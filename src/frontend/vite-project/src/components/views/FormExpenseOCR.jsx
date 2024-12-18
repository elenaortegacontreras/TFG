import { useState, useEffect } from 'react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { Title } from '../Title.jsx';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { LocationMiniMap } from '../LocationMiniMap.jsx';
import { FindLocationMiniMap } from '../FindLocationMiniMap.jsx';

export function FormExpenseOCR() {
  const location = useLocation();
  const state = location.state;
  console.log(state);

  const [amount, setAmount] = useState('');
  const [name, setConcept] = useState('');
  const [shopLocation, setShopLocation] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [payment_method, setPaymentMethod] = useState('');
  const [insertDate, setInsertDate] = useState('');
  const [find_shop_option, setFindShopOption] = useState('');
  const [showLocationMiniMap, setShowLocationMiniMap] = useState(false);
  const [showFindLocationMiniMap, setShowFindLocationMiniMap] = useState(false);
  const [potentialShops, setPotentialShops] = useState([]);
  const [selectedShop, setSelectedShop] = useState(null);

  const handlePotentialShopsChange = (shops) => {
    setPotentialShops(shops);
  };

  const navigate = useNavigate();

  let categories_list = [];
  let subcategories_list = [];

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/categories')
      .then(response => {
        categories_list = response.data;
        setSelectedCategory(categories_list.find(category => category.name === "Otros"));
        setCategories(categories_list);
      })
      .catch(error => {
        console.error('Error fetching the categories:', error);
      });
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      axios.get(`http://localhost:8000/subcategories/${selectedCategory.id}`)
        .then(response => {
          subcategories_list = response.data;
          setSelectedSubcategory(subcategories_list.find(subcategory => subcategory.name === "Otros"));
          setSubcategories(subcategories_list);
          console.log('subcategoriaaaaaas',response.data)
        })
        .catch(error => {
          console.error('Error fetching the subcategories:', error);
        });
    }
  }, [selectedCategory]);

  useEffect(() => {
    if(state.ticket_data) {
      const ticket_data = state.ticket_data.result;
      console.log('ticket_data:', ticket_data);
      if (ticket_data.total_amount !== "desconocido")
        setAmount(ticket_data.total_amount);
      if (ticket_data.shop_name !== "desconocido")
        setConcept(ticket_data.shop_name);     
      if (ticket_data.shop_postal_code !== "desconocido")
        setShopLocation(ticket_data.shop_postal_code);
      // setSelectedCategory(categories_list.find(category => category.id === expense.category_id));
      // setSelectedSubcategory(subcategories_list.find(subcategory => subcategory.id === expense.subcategory_id));
      if (ticket_data.date !== "desconocido")
        setInsertDate(new Date(ticket_data.date.split('/').reverse().join('-')).toISOString().split('T')[0]);
      else
        setInsertDate(new Date().toISOString().split('T')[0]);
      if (ticket_data.payment_method !== "desconocido")
        if (ticket_data.payment_method === "tarjeta")
          setPaymentMethod('Card');
        else if (ticket_data.payment_method === "efectivo")
          setPaymentMethod('Cash');   
    }
  }, []);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleSubcategoryChange = (subcategory) => {
    setSelectedSubcategory(subcategory);
  };

  const handlePaymentMethodChange = (type) => {
    setPaymentMethod(type);
  };

  const handleFindShopOptionChange = (type) => {
    setFindShopOption(type);
    if (type === 'Geolocation') {
      setShowLocationMiniMap(true);
      setShowFindLocationMiniMap(false);
    } else {
      setShowFindLocationMiniMap(true);
      setShowLocationMiniMap(false);
    };
  };

  const handleShopChange = (shop) => {
    console.log('SELECTED shop:', shop);
    console.log('latitud:', shop.lat);
    console.log('longitud:', shop.lon);
    setSelectedShop({
      id: shop.id,
      name: shop.tags.name ? shop.tags.name : null,
      lat: shop.lat,
      lon: shop.lon,
      postcode: shop.tags['addr:postcode'] ? shop.tags['addr:postcode'] : null,
      street: shop.tags['addr:street'] ? shop.tags['addr:street'] : null
    });
  };

  const handleCancelSelectedShop = () => {
    setSelectedShop(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (selectedShop) {
      console.log('selectedShop:', selectedShop);
    
      try {
        await axios.post('http://localhost:8000/shops', selectedShop);
        console.log('Comercio creado con éxito');
      } catch (error) {
        console.error('Error al crear comercio:', error);
      }
    }

    const newExpense = {
      amount: parseFloat(amount),
      name,
      shop_location_pc: shopLocation ? shopLocation : null,
      category_id: selectedCategory.id,
      subcategory_id: selectedSubcategory.id,
      payment_method,
      user_id: 1,
      transaction_type: "Expense",
      insert_date: insertDate ? insertDate : null,
      shop_id: selectedShop ? selectedShop.id : null,
    };

    console.log('newExpense:', newExpense);

    try {
      await axios.post('http://localhost:8000/transactions', newExpense);
      console.log('Gasto creado con éxito');
      navigate('/transactions', { state: { transaction_type: "expenses" } });
    } catch (error) {
      console.error('Error al crear gasto:', error);
    }
    
  };

  const handleCancel = () => {
    navigate('/transactions', { state: { transaction_type: "expenses" } });
  }

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
                placeholder="Ej. Recarga tarjeta metro"
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
            <label htmlFor="selectedCategory" className="block text-sm font-medium leading-6 text-gray-900">
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
                <MenuItems className="max-h-40 overflow-y-auto absolute z-10 mt-2 w-full origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
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

            <div>
              <label htmlFor="selectedSubcategory" className="block text-sm font-medium leading-6 text-gray-900">
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
                  <MenuItems className="max-h-40 overflow-y-auto absolute z-10 mt-2 w-full origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
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

          <div>
            <label className="block text-sm font-medium leading-6 text-gray-900">Método de pago</label>
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
            <label htmlFor="shop_location_pc" className="block text-sm font-medium leading-6 text-gray-900">
              Código postal del comercio
            </label>
            <div className="mt-2">
              <input
                type="text"
                id="shop_location_pc"
                name="shop_location_pc"
                value={shopLocation}
                onChange={(e) => setShopLocation(e.target.value)}
                // required
                // maxLength={5}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium leading-6 text-gray-900">Comercio</label>
            {shopLocation === '' && (
              <p className="text-red-500 text-sm mt-1">Se necesita indicar código postal</p>
            )}
            <div className="mt-2 flex justify-around">
            <button
              type="button"
              disabled={!shopLocation}
              onClick={() => handleFindShopOptionChange('Geolocation')}
              className={`w-1/3 py-2 rounded-md font-semibold 
                ${find_shop_option === 'Geolocation' ? 'bg-indigo-600 text-white' : 
                  'bg-white text-gray-900 border border-gray-300'} 
                ${!shopLocation ? 'cursor-not-allowed opacity-50' : ''}
              `}
            >
              Usar mi ubicación
            </button>
            <button
              type="button"
              disabled={!shopLocation}
              onClick={() => handleFindShopOptionChange('Search')}
              className={`w-1/3 py-2 rounded-md font-semibold 
                ${find_shop_option === 'Search' ? 'bg-indigo-600 text-white' : 
                  'bg-white text-gray-900 border border-gray-300'} 
                ${!shopLocation ? 'cursor-not-allowed opacity-50' : ''}
              `}
            >
              Buscar
            </button>
            </div>
          </div>

        { showLocationMiniMap && find_shop_option === 'Geolocation' && (
          <div>
            <LocationMiniMap onPotentialShopsChange={handlePotentialShopsChange} selectedShop={selectedShop}/>
          </div>
        )}

        { showFindLocationMiniMap && find_shop_option === 'Search' && (
          <div>
            <FindLocationMiniMap onPotentialShopsChange={handlePotentialShopsChange} postalCode={shopLocation} selectedShop={selectedShop} shopName={name}/>
          </div>
        )}

        { (showFindLocationMiniMap || showLocationMiniMap) && (
          <div>
            Comercios cercanos: {potentialShops.length}
            <div className="mt-2 flex">
              <Menu as="div" className="w-full relative inline-block text-left">
                <div>
                  <MenuButton className="w-full inline-flex justify-between gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                    {selectedShop ? (
                      <>
                      {selectedShop.name || 'Sin Nombre'}
                      {selectedShop.street ? ` - ${selectedShop.street}` : ''}        
                      </>               
                    ) : 'Seleccionar comercio'}
                    <ChevronDownIcon aria-hidden="true" className="-mr-1 h-5 w-5 text-gray-400" />
                  </MenuButton>
                </div>

                <MenuItems className="w-full max-h-40 overflow-y-auto absolute z-10 mt-2 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                {potentialShops.length > 0 ? (
                  potentialShops.map((shop) => (
                    (shop.tags.name || shop.tags.brand) && (
                    <MenuItem
                      key={shop.id}
                      as="button"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      onClick={() => handleShopChange(shop)}
                    >
                      {shop.tags.name || shop.tags.brand}
                      {shop.tags['addr:street'] ? ` - ${shop.tags['addr:street']}` : ''}
                    </MenuItem>
                    )
                  ))
                ) : (
                  <MenuItem as="button">
                  No se encontraron lugares con ese nombre
                  </MenuItem>
                )}
                </MenuItems>
              </Menu>
                <a onClick={handleCancelSelectedShop}>
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                 <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                 </svg>
                </a>
            </div>
          </div>
        )}

          <div>
            <button
              type="submit"
              className="w-full flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 my-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <p>Añadir</p>
            </button>

            <button onClick={handleCancel}
              type="submit"
              className="flex w-full justify-center rounded-md px-3 py-1.5 my-2 text-sm font-semibold leading-6 bg-white text-gray-900 border border-gray-300">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
