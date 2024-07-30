import React from 'react';
import { Transaction } from './Transaction.jsx'

export function TransactionPanel({ transactions , setSuccessMessage, setErrorMessage}) {
    return (
      <div className="container mx-auto p-4">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="border-t border-gray-200 py-4">
        <dl>
          {transactions.map((transaction, index) => (
          <div key={transaction.id} className="bg-white px-4 grid sm:px-6">
            <Transaction
            transaction_id={transaction.id}
            transaction_type={transaction.transaction_type}
            category_name={transaction.category_name}
            subcategory_name={transaction.subcategory_name}
            name={transaction.name}
            saving_goal_name={transaction.saving_goal_name}
            payment_method={transaction.payment_method}
            amount={transaction.amount}
            insert_date={transaction.insert_date}
            // currency={transaction.currency}
            currency = "€"
            shop_id={transaction.shop_id}

            setSuccessMessage={setSuccessMessage} 
            setErrorMessage={setErrorMessage}
            />
            {index !== transactions.length - 1 && <div className="divider"></div>}
          </div>
          ))}
        </dl>
        </div>
      </div>
      </div>
    );
}