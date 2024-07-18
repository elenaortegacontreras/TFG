import { VictoryPie, VictoryTheme } from 'victory';

export function PieChart({ incomes_amount, expenses_amount, savings_amount }) {
    // diagrama de sectores para representar los ingresos, gastos y ahorros (3 números decimales)
    return (
        <VictoryPie
            // theme={VictoryTheme.material}
            //continuar con colores vivos y atractivos pastel
            // colorScale={["tomato", "orange", "gold", "cyan", "navy", ""
            colorScale={["tomato","gold", "orange"]}
            // colorScale={["tomato", "cyan", "navy", "orange"]}
            // colorScale={["#D8BFD8", "#DDA0DD", "#EE82EE", "#BA55D3", "#9932CC", "#9400D3", "#8A2BE2", "#800080"]}
            // colorScale={["tomato", "orange", "gold", "magenta", "purple"]}
            // colorScale="qualitative"
            data={[
                { y: incomes_amount },
                { y: expenses_amount },
                { y: savings_amount },
            ]}
            labels={() => null}  // Ocultar etiquetas
            // data={[
            //     { x: "Ingresos", y: incomes_amount },
            //     { x: "Gastos", y: expenses_amount },
            //     { x: "Ahorros", y: savings_amount },
            // ]}
            events={[
                {
                    target: "data",
                    eventHandlers: {
                        onClick: () => {
                            return [
                                {
                                    target: "data",
                                    mutation: (props) => {
                                        // Aquí puedes realizar alguna acción cuando se hace clic en un sector
                                        console.log(props.datum);
                                    }
                                }
                            ];
                        }
                    }
                }
            ]}
        />
    );
}

