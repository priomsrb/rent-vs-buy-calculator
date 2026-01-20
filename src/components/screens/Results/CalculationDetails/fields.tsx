import { createContext, useContext } from "react";

import type { EnrichedSimulationParams } from "@/calculation/EnrichedSimulationParams";
// TODO: Don't use test constants here
import { emptySimulationParams } from "@/calculation/cases/gain-loss/testConstants";
import { PercentField } from "@/components/Forms";
import { formatMoney } from "@/utils/formatMoney";

export const CalculationFieldsContext = createContext<{
  simulationParams: EnrichedSimulationParams;
}>({
  simulationParams: emptySimulationParams,
});

export const CalculationFieldsContextProvider = ({
  children,
  simulationParams,
}: {
  children: React.ReactNode;
  simulationParams: EnrichedSimulationParams;
}) => {
  return (
    <CalculationFieldsContext.Provider value={{ simulationParams }}>
      {children}
    </CalculationFieldsContext.Provider>
  );
};

export const DepositPercentField = () => {
  const { simulationParams } = useContext(CalculationFieldsContext);

  return (
    <PercentField
      name={"depositPercent"}
      label={"Deposit"}
      description={`Deposit: ${formatMoney(
        (simulationParams.depositPercent / 100) *
          simulationParams.propertyPrice,
      )}`}
    />
  );
};
