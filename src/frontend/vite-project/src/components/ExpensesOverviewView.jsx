import { ResumeTitle } from './ResumeTitle.jsx'
import { CategoryBudgetPanel } from './CategoryBudgetPanel.jsx'

export function ExpensesOverviewView() {
    return (
        <div>
            <ResumeTitle amount="250" title="Este mes llevas gastados" card="200" cash="50" currency="€"/>

            <div className="divider"></div>

            <div>
                <div className="flex justify-center">
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSusawchJOB2j6kQxqZQdFB6BrK5LtquwlLvQ&s" alt="placeholder" />
                </div>
                {/* <progress className="progress w-100" value="40" max="100"></progress> */}

                {/* <div className="card grid h-20 place-items-center">
                    <button className="btn">Ingresos</button>
                </div> */}
                
            </div>

            <div className="divider"></div>

            <div>
                <p>Presupuestos de gastos del mes</p>
                <div className="divider"></div>
                <CategoryBudgetPanel />
            </div>
            

        </div>
    );
};