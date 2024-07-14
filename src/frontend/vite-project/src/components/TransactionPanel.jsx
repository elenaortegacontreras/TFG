import React from 'react';
import { Transaction } from './Transaction.jsx'

// transaction tiene: name, category, subcategory, saving_goal, payment_method, amount, date, currency, shop_id
const transactions = [
    { id: 1, name: 'Transacción 1', transaction_type: 'Expense', category: 'Transporte', subcategory: 'Metro', saving_goal: 'Móvil', payment_method: 'Tarjeta', amount: 30, date: '2022-5-7', currency: '€', shop_id: 1 },
    { id: 2, name: 'Transacción 2', transaction_type: 'Expense', category: 'Alimentación', subcategory: 'Supermercado', saving_goal: 'Casa', payment_method: 'Efectivo', amount: 20, date: '2022-5-7', currency: '€', shop_id: 2 },
    { id: 3, name: 'Transacción 3', transaction_type: 'Income', category: 'Ocio', subcategory: 'Cine', saving_goal: 'Portátil', payment_method: 'Tarjeta', amount: 10, date: '2022-5-7', currency: '€', shop_id: 3 },
    { id: 4, name: 'Transacción 4', transaction_type: 'Saving', category: 'Otros', subcategory: '', saving_goal: 'Otros', payment_method: 'Efectivo', amount: 50, date: '2022-5-7', currency: '€', shop_id: 4 },
    // Agrega más objetos según sea necesario
];
export function TransactionPanel() {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="border-t border-gray-200">
            <dl>
              {transactions.map((transaction) => (
                <div key={transaction.id} className="bg-white px-4 py-5 grid gap-4 sm:px-6">
                  <Transaction
                    transaction_id={transaction.id}
                    name={transaction.name}
                    category={transaction.category}
                    subcategory={transaction.subcategory}
                    payment_method={transaction.payment_method}
                    amount={transaction.amount}
                    date={transaction.date}
                    currency={transaction.currency}
                    shop_id={transaction.shop_id}
                  />
                  {transaction.id < transactions.length && <div className="divider"></div>}
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    );
}