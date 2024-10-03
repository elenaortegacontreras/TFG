import { SavingGoalCard } from './SavingGoalCard.jsx';

// TODO: añadir la divisa: "currency"

export function SavingGoalPanel( { saving_goals }) {
    return (
        <div className="container mx-auto p-4">
            <div className="flex flex-wrap justify-center">
                {saving_goals.map((saving_goal) => (
                    <div key={saving_goal.id} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 p-2">
                        <SavingGoalCard
                            id={saving_goal.id}
                            name={saving_goal.name} 
                            description={saving_goal.description}
                            current_amount_saved={saving_goal.current_amount_saved} 
                            target_amount={saving_goal.target_amount} 
                            insert_date={saving_goal.insert_date}
                            target_date={saving_goal.target_date}
                            // currency={saving_goal.currency}
                            currency = "€"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
