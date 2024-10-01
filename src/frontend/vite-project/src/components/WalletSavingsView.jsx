import { Transaction } from './Transaction.jsx'
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export function WalletSavingsView() {

  const [globalSavings, setGlobalSavings] = useState([]);

    useEffect(() => {
      axios.get('http://localhost:8000/global_savings_by_month')
          .then(response => {
              setGlobalSavings(response.data);
          })
          .catch(error => {
              console.error('Error fetching the savings:', error);
          });
    }, []);

    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", 
                        "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    const getMonthName = (monthNumber) => {
      return monthNames[monthNumber - 1];
    };

    return (
      <div className="container mx-auto p-4">
        <div className="bg-white shadow overflow-y-auto sm:rounded-lg">
          <div className="border-t border-gray-200 py-4">
            {globalSavings.map((monthData) => (
              <div key={monthData.month} className="bg-white px-4 grid sm:px-6">
                {monthData.wallet && (
                <>
                  {monthData.wallet.amount != 0 && (
                    <>
                    <h2 className="text-lg font-semibold mb-4">{getMonthName(parseInt(monthData.month)+1)}</h2>
                    {monthData.wallet.cash != 0 && (
                    <div className="mb-4">
                      <Transaction
                        transaction_id={-1}
                        transaction_type="Cash"
                        category_name=""
                        subcategory_name=""
                        name={`Ahorro efectivo del monedero de ${getMonthName(parseInt(monthData.month))}`}
                        saving_goal_name=""
                        payment_method=""
                        amount={monthData.wallet.cash}
                        insert_date={`${monthData.month}/01/${monthData.year}`}
                        currency="€"
                        shop_location_pc="" />
                    </div>
                    )}
                    {monthData.wallet.card != 0 && (
                    <div className="mb-4">
                        <Transaction
                          transaction_id={-1}
                          transaction_type="Card"
                          category_name=""
                          subcategory_name=""
                          name={`Ahorro digital del monedero de ${getMonthName(parseInt(monthData.month))}`}
                          saving_goal_name=""
                          payment_method=""
                          amount={monthData.wallet.card}
                          insert_date={`${monthData.month}/01/${monthData.year}`}
                          currency="€"
                          shop_location_pc="" />
                      </div>
                      )}
                      
                    </>
                  )}
                </>
                )}
                {monthData.global_savings.length > 0 && (
                  <>
                    {monthData.global_savings.map((transaction, index) => (
                      <div key={transaction.id} className="bg-white px-4 grid sm:px-6">
                        <Transaction
                          transaction_id={transaction.id}
                          transaction_type={transaction.transaction_type}
                          category_name={transaction.category_name}
                          subcategory_name={transaction.subcategory_name}
                          name={transaction.name}
                          saving_goal_name={transaction.saving_goal_name}
                          payment_method={transaction.payment_method}
                          amount={`- ${transaction.amount}`}
                          insert_date={transaction.insert_date}
                          currency="€"
                          shop_location_pc={transaction.shop_location_pc}
                        />
                        {index !== monthData.global_savings.length - 1 && <div className="divider"></div>}
                      </div>
                    ))}
                  </>
                )}
                <div className="divider"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
}