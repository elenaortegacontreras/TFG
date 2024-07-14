import { ResumeTitle } from './ResumeTitle.jsx'
import { SavingGoalPanel } from './SavingGoalPanel.jsx'

export function SavingsOverviewView() {
    return (
        <div>
            <ResumeTitle amount="250" title="Este mes llevas ahorrados" card="200" cash="50" currency="€"/>

            <div className="divider"></div>

            <div>
                <div className="flex justify-center">
                    <img src="https://tudashboard.com/wp-content/uploads/2021/06/Barras-y-linea.jpg" alt="placeholder" />
                </div>
            </div>

            <div className="divider"></div>

            <div>
                <p>Objetivos de ahorro</p>
                <div className="divider"></div>
                <SavingGoalPanel />
            </div>

        </div>
    );
};