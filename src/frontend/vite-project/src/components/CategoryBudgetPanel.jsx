import { CategoryBudgetCard } from './CategoryBudgetCard.jsx';

const budgets = [
    { id: 1, name: 'Transporte', description: "Gastos bus y coche", amount_spent: 45, budget_amount: 50, currency: "€"},
    { id: 2, name: 'Alimentación', description: "", amount_spent: 35, budget_amount: 50, currency: "€"},
    { id: 3, name: 'Ocio', description: "descripción categoría", amount_spent: 10, budget_amount: 40, currency: "€" },
    { id: 4, name: 'Otro', description: "descripción si la hubiera", amount_spent: 45, budget_amount: 100, currency: "€" },
    // Agrega más objetos según sea necesario
];

export function CategoryBudgetPanel() {
    return (
        <div className="container mx-auto p-4">
            <div className="flex flex-wrap justify-center">
                {budgets.map((budget) => (
                    <div key={budget.id} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 p-2">
                        <CategoryBudgetCard
                            name={budget.name} 
                            description={budget.description}
                            amount_spent={budget.amount_spent} 
                            budget_amount={budget.budget_amount} 
                            currency={budget.currency}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
