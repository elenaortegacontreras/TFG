import { useNavigate } from 'react-router-dom';

export function CategoryBudgetCard({ id, name, description, current_amount_spent, budget_amount, currency }) {
    const navigate = useNavigate();
    const percentage = current_amount_spent === 0 ? 0 : (current_amount_spent / budget_amount) * 100;

    const handleCategoryClick = () => {
        navigate('/category', { state: { id, name, description, current_amount_spent, budget_amount, currency } });
    };

    let badgeType;
    if (percentage >= 90) {
        badgeType = (
            <div className="badge badge-error gap-2">
                Al límite
            </div>
        );
    } else if (percentage >= 70) {
        badgeType = (
            <div className="badge badge-warning gap-2">
                Cerca del límite
            </div>
        );
    } else {
        badgeType = (
            <div className="badge badge-success gap-2">
                Bien hecho
            </div>
        );
    }

    return (
        // <div onClick={handleCategoryClick} className="btn card bg-base-100 w-full h-auto min-h-[300px] shadow-xl">
        <div onClick={handleCategoryClick} className="btn card bg-base-100 w-auto h-auto min-h-[300px] min-w-[150px] shadow-xl">
            <figure className="h-32 flex justify-center items-center">
                <div className="radial-progress bg-ghost text-ghost-content border-ghost border-4"
                    style={{ "--value": percentage }} role="progressbar">
                    {percentage.toFixed(0)}%
                </div>
            </figure>
            <div className="card-body flex flex-col justify-center items-center">
                <h2 className="card-title flex justify-center items-center">
                    <div className="flex items-center space-x-2">
                        {name === "Transporte" ? (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                            </svg>
                        ) : name === "Alimentación" ? (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                            </svg>
                        ) : name === "Ocio" ? (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
                            </svg>
                        )}
                        <p className="py-1.5 text-ghost-content">{name}</p>
                    </div>
                </h2>
                <p className="text-center truncate text-ghost-content">{description || "Sin descripción"}</p>
                <p className="text-center text-ghost-content">{current_amount_spent} / {budget_amount} {currency}</p>
                {badgeType}
            </div>
        </div>
    );
}