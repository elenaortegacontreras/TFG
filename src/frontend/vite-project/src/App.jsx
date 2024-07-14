import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css'

import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

import { DarkNav } from './components/DarkNav.jsx'
import { CategoryView } from './components/CategoryView.jsx'
import { TransactionsView } from './components/TransactionsView.jsx'
import { SavingView } from './components/SavingView.jsx'
import { ExpensesOverviewView } from './components/ExpensesOverviewView.jsx'
import { SavingsOverviewView } from './components/SavingsOverviewView.jsx'
import { FormExpense } from './inprogress/FormExpense.jsx'
import { SignInOrRegistration } from './inprogress/SignInOrRegistration.jsx'
import { FormSaving } from './inprogress/FormSaving.jsx'
import { FormIncome } from './inprogress/FormIncome.jsx'
import { HomeView } from './components/HomeView.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <div>

      <DarkNav />

      <main className="bg-white shadow">
            {/* <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">{title}</h1>
            </div> */}

            {/* <SignInOrRegistration /> */}

            {/* <CategoryView title="Cat. Transporte"/> */}
            {/* <TransactionsView title="Transacciones"/> */}
            {/* <SavingView title="Móvil nuevo"/> */}
            {/* <TransactionsOverviewView /> */}
            {/* <SavingsOverviewView /> */}
            {/* <FormExpense /> */}
            {/* <FormSaving /> */}
            {/* <FormIncome /> */}
            {/* <HomeView /> */}
            {/* <NewExpenseView /> */}

        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/transactions" element={<TransactionsView />} />
          <Route path="/savings" element={<SavingView />} />
          <Route path="/expenses-overview" element={<ExpensesOverviewView />} />
          <Route path="/category" element={<CategoryView />} />
          <Route path="/savings-overview" element={<SavingsOverviewView />} />
          <Route path="/form-expense" element={<FormExpense />} />
          <Route path="/form-saving" element={<FormSaving />} />
          <Route path="/form-income" element={<FormIncome />} />
          <Route path="/sign-in" element={<SignInOrRegistration />} />

        </Routes>
      </main>
    </div>

      
    </>
  )
}

export default App
