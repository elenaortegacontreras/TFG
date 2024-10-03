import { CategoryBudgetCard } from './CategoryBudgetCard.jsx';

// TODO: añadir la divisa: "currency"

export function CategoryBudgetPanel({ budgets }) {
    return (
        <div className="container mx-auto p-4">
            <div className="flex flex-wrap justify-center">
                {budgets.map((budget) => (
                    <div key={budget.id} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2">
                        <CategoryBudgetCard
                            id={budget.id}
                            name={budget.name} 
                            description={budget.description}
                            current_amount_spent={budget.current_amount_spent} 
                            budget_amount={budget.budget_amount} 
                            currency="€"
                            // currency={budget.currency}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
