import { LoadingDots } from "./LoadingDots";

export function ResumeTitle({title, amount, card, cash, currency}) {
    return (
        <div>
            <header className="bg-white shadow">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <p>{title}</p>
                {amount !== "loading" ? (
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">{amount} {currency} </h1>
                ) : (
                    <LoadingDots />
                )}
            </div>
            <div className="divider"></div>
            </header>

            <div className="panel flex w-full justify-evenly">
                <div className="card flex h-20 flex-row place-items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
                    </svg>
                    {card !== "loading" ? (
                        <p>Tarjeta {card} {currency}</p>
                    ) : (
                        <p>Tarjeta <LoadingDots /></p>
                    )}
                    
                </div>
                <div className="divider divider-horizontal"></div>
                <div className="card flex h-20 flex-row place-items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
                    </svg>
                    {cash !== "loading" ? (
                        <p>Efectivo {cash} {currency}</p>
                    ) : (
                        <p>Efectivo <LoadingDots /></p>
                    )}
                </div>
            </div>

        </div>  
    );
};