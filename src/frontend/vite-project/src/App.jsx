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
import { FormExpense } from './components/FormExpense.jsx'
import { FormExpenseOCR } from './components/FormExpenseOCR.jsx'
import { SignInOrRegistration } from './inprogress/SignInOrRegistration.jsx'
import { FormSaving } from './components/FormSaving.jsx'
import { FormIncome } from './components/FormIncome.jsx'
import { FormCategoryBudget } from './components/FormCategoryBudget.jsx'
import { FormSubcategoryBudget } from './components/FormSubcategoryBudget.jsx'
import { FormSavingGoal } from './components/FormSavingGoal.jsx'
import { HomeView } from './components/HomeView.jsx'
import { MapView } from './components/MapView.jsx'

function App() {

  return (
    <>
    <div>

      <DarkNav />

      <main className="fullHeight bg-white shadow">

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
          <Route path="/form-expense-ocr" element={<FormExpenseOCR />} />
          <Route path="/form-saving" element={<FormSaving />} />
          <Route path="/form-income" element={<FormIncome />} />
          <Route path="/form-category" element={<FormCategoryBudget />} />
          <Route path='/form-subcategory' element={<FormSubcategoryBudget />} />
          <Route path="/form-goal" element={<FormSavingGoal />} />
          <Route path="/map" element={<MapView />} />
          <Route path="/sign-in" element={<SignInOrRegistration />} />
        </Routes>
      </main>
    </div>

      
    </>
  )
}

export default App
