import { useNavigate } from 'react-router-dom';

export function SavingGoalCard({ id, name, description, current_amount_saved, target_amount, insert_date, target_date, currency }) {
    const navigate = useNavigate();
    const percentage = current_amount_saved === 0 ? 0 : (current_amount_saved / target_amount) * 100;

    const handleSavingGoalClick = () => {
        navigate('/savings', { state: { id, name, description, current_amount_saved, target_amount, insert_date, target_date, currency } });
    };

    let badgeType;
    if (percentage >= 90) {
        badgeType = (
            <div className="badge badge-error gap-2">
                Queda poco
            </div>
        );
    } else if (percentage >= 70) {
        badgeType = (
            <div className="badge badge-warning gap-2">
                Ánimo
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
        <div onClick={handleSavingGoalClick} className="btn card bg-base-100 w-full h-auto min-h-[300px] shadow-xl">
            <figure className="h-32 flex justify-center items-center">
                <div className="radial-progress bg-ghost text-ghost-content border-ghost border-4"
                    style={{ "--value": percentage }} role="progressbar">
                    {percentage.toFixed(0)}%
                </div>
            </figure>
            <div className="card-body flex flex-col justify-center items-center">
                <h2 className="card-title flex justify-center items-center">
                    <div className="flex items-center space-x-2">
                        {name === "Viaje" ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 64 64"><path fill="black" d="M61.22 4.387C60.286 2.869 58.659 2 56.754 2c-1.108 0-2.248.292-3.388.867c-3.855 1.948-8.762 5.468-13.911 9.919l-10.446-1.161l1.893-1.894l-1.909-1.91l-3.422 3.421l-10.891-1.209l2.27-2.27l-1.911-1.911l-3.797 3.799l-7.97-.886c-1.968-.219-1.588 4.727.7 5.794l22.869 10.66c-4.408 4.925-10.354 12.196-12.55 17.771L4.262 41.876c-.678-.074-.548 1.625.239 1.992c5.061 2.358 7.717 3.597 9.113 4.248c.032.105.075.205.116.305c-1.924 2.323-3.005 4.085-2.614 4.473c.386.385 2.138-.69 4.451-2.608c.104.044.212.087.328.124l4.236 9.091c.368.788 2.068.915 1.993.239l-1.109-10.001c4.861-1.944 11.521-6.907 17.784-12.543l10.639 22.83c1.068 2.293 6.016 2.669 5.797.699l-.886-7.971l3.797-3.796l-1.911-1.911l-2.268 2.269l-1.209-10.892l3.419-3.418l-1.911-1.912l-1.891 1.892l-1.16-10.441c4.453-5.149 7.973-10.056 9.919-13.911c1.125-2.233 1.156-4.51.086-6.247M59.421 9.77c-2.676 5.302-8.707 13.08-16.521 20.892c-8.438 8.44-16.827 14.79-22.108 17.087l-.232-2.098c3.957-4.042 6.65-7.701 6.076-8.283c-.582-.578-4.242 2.117-8.285 6.075l-2.111-.235c2.303-5.28 8.667-13.675 17.1-22.108c7.813-7.812 15.59-13.843 20.891-16.521c.904-.455 1.76-.661 2.524-.661c2.73-.001 4.293 2.625 2.666 5.852"></path><path fill="black" d="m52.743 6.057l-3.295 2.047c1.505-.52 3.557.125 4.748 1.076l2.643-2.642c-1.09-.841-2.61-.981-4.096-.481m2.077 3.747c.95 1.191 1.595 3.243 1.075 4.747l2.047-3.295c.5-1.487.359-3.006-.48-4.095z"></path></svg>
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
                        <p className="py-2">{name}</p>
                    </div>
                </h2>
                <p className="text-center truncate">{description || "Sin descripción"}</p>
                <p className="text-center">{current_amount_saved} / {target_amount} {currency}</p>
                {badgeType}
            </div>
        </div>
    );
}