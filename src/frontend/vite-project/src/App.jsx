import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css'

import { DarkNav } from './components/DarkNav.jsx'
import { CategoryView } from './components/views/CategoryView.jsx'
import { TransactionsView } from './components/views/TransactionsView.jsx'
import { SavingView } from './components/views/SavingView.jsx'
import { ExpensesOverviewView } from './components/views/ExpensesOverviewView.jsx'
import { SavingsOverviewView } from './components/views/SavingsOverviewView.jsx'
import { IncomesOverviewView } from './components/views/IncomesOverviewView.jsx';
import { FormExpense } from './components/views/FormExpense.jsx'
import { FormExpenseOCR } from './components/views/FormExpenseOCR.jsx'
import { SignInOrRegistration } from './inprogress/SignInOrRegistration.jsx'
import { FormSaving } from './components/views/FormSaving.jsx'
import { FormIncome } from './components/views/FormIncome.jsx'
import { FormCategoryBudget } from './components/views/FormCategoryBudget.jsx'
import { FormSubcategoryBudget } from './components/views/FormSubcategoryBudget.jsx'
import { FormSavingGoal } from './components/views/FormSavingGoal.jsx'
import { HomeView } from './components/views/HomeView.jsx'
import { MapView } from './components/views/MapView.jsx'
import { WalletSavingsView } from './components/WalletSavingsView.jsx'

function App() {

  return (
    <>
    <div>

      <DarkNav />

      <main className="fullHeight bg-white shadow">
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/transactions" element={<TransactionsView />} />
          <Route path="/savings" element={<SavingView />} />
          <Route path="/expenses-overview" element={<ExpensesOverviewView />} />
          <Route path="/category" element={<CategoryView />} />
          <Route path="/savings-overview" element={<SavingsOverviewView />} />
          <Route path="/incomes-overview" element={<IncomesOverviewView />} />
          <Route path="/wallet-savings" element={<WalletSavingsView />} />
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
