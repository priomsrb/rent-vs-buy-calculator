import { ChevronDown, ChevronRight } from "lucide-react";
import { memo, useCallback, useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";

import {
  type SimulationParams,
  getEnrichedSimulationParams,
} from "@/calculation/EnrichedSimulationParams";
import { RentMovingCost } from "@/calculation/cases/gain-loss/RentMovingCost";
import { RentPaid } from "@/calculation/cases/gain-loss/RentPaid";
import { FormContext } from "@/components/Forms";
import {
  CalculationFieldsContextProvider,
  RentField,
  RentIncreaseField,
  RentMoveCleaningField,
  RentMoveOverlapWeeksField,
  RentMoveRemovalistsField,
  RentMoveYearsBetweenField,
} from "@/components/screens/Results/CalculationDetails/fields";
import { formPresets } from "@/components/screens/Results/formPresets";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { FieldGroup } from "@/components/ui/field";
import { Slider } from "@/components/ui/slider";
import { formatMoney } from "@/utils/formatMoney";
import { parseLocalStorage, writeToLocalStorage } from "@/utils/localStorage";
import { Link } from "@tanstack/react-router";

import { Button } from "../../ui/button";
import { ExplainRentChart } from "./ExplainRentChart";

export function Explain() {
  const [step, setStep] = useState(INITIAL_STEP);

  const CurrentStep = getViewForStep(step);

  return (
    <div className={"flex w-full justify-center"}>
      <div className="md:w-300 flex-col items-center justify-center p-10 text-center">
        <CurrentStep />
        <StepNavigation step={step} setStep={setStep} />
      </div>
    </div>
  );
}

const STEPS = [Step1, Step2];
const INITIAL_STEP = 2;

function StepNavigation({
  step,
  setStep,
}: {
  step: number;
  setStep: (step: number) => void;
}) {
  return (
    <div className="flex justify-between w-full">
      {step === 1 ? (
        <Link to={"/start"} draggable={false}>
          <Button>Exit</Button>
        </Link>
      ) : (
        <Button onClick={() => setStep(step - 1)}>Back</Button>
      )}
      {step < STEPS.length && (
        <Button onClick={() => setStep(step + 1)}>Next</Button>
      )}
      {step >= STEPS.length && (
        <Link to={"/start"} draggable={false}>
          <Button>Finish</Button>
        </Link>
      )}
    </div>
  );
}

function getViewForStep(step: number) {
  return STEPS[step - 1];
}

const Details = memo((props: Parameters<typeof Collapsible>[0]) => {
  return (
    <Collapsible
      {...props}
      className={twMerge(
        props.className,
        "mt-2 rounded-2xl border px-4 py-2 not-last:mb-4 dark:bg-white/5",
      )}
    >
      {props.children}
    </Collapsible>
  );
});

const Summary = memo((props: React.HTMLProps<HTMLDivElement>) => {
  return (
    <>
      <CollapsibleTrigger
        className={
          "flex w-full cursor-pointer items-center data-[state=closed]:hidden"
        }
      >
        <ChevronDown size={18} />
        <span className={"flex grow pl-2"}>{props.children}</span>
      </CollapsibleTrigger>
      <CollapsibleTrigger
        className={
          "flex w-full cursor-pointer items-center data-[state=open]:hidden"
        }
      >
        <ChevronRight size={18} />
        <span className={"flex grow pl-2"}>{props.children}</span>
      </CollapsibleTrigger>
    </>
  );
});

const DetailsContent = memo((props: React.HTMLProps<HTMLDivElement>) => {
  return (
    <CollapsibleContent
      className={
        "overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down"
      }
    >
      <div className="mx-1 py-6">{props.children}</div>
    </CollapsibleContent>
  );
});

const SummaryRightText = memo((props: React.HTMLProps<HTMLDivElement>) => {
  return (
    <small className={twMerge("-my-1.5 grow p-2 text-right", props.className)}>
      {props.children}
    </small>
  );
});

function formDataToSimulationParams(formData: SimulationParams) {
  return getEnrichedSimulationParams({
    ...formData,
  });
}

function Step1() {
  return (
    <div className="text-left">
      <p>Imagine there are 2 people. They both:</p>
      <ul className="list-disc list-inside">
        <li>Have the same income</li>
        <li>Choose to live in identical looking homes</li>
      </ul>
      <p>One decides to buy</p>
      <p>One decides to rent</p>
      <p>Let's see who comes out ahead</p>
    </div>
  );
}

function Step2() {
  const existingFormData = parseLocalStorage("formData") ?? {};
  const defaultValues = {
    ...formPresets.apartment,
    ...existingFormData,
  } as SimulationParams;

  const [formData, setFormDataRaw] = useState<SimulationParams>(defaultValues);
  const [year, setYear] = useState(1);

  const setFormData = useCallback(
    (
      newFormData:
        | SimulationParams
        | ((prev: SimulationParams) => SimulationParams),
    ) => {
      setFormDataRaw((current) => {
        const updated =
          typeof newFormData === "function"
            ? newFormData(current)
            : newFormData;
        const storageFormData = parseLocalStorage("formData") ?? {};
        writeToLocalStorage("formData", {
          ...storageFormData,
          ...updated,
        });
        return updated;
      });
    },
    [],
  );

  const simulationParams = useMemo(
    () => formDataToSimulationParams(formData),
    [formData],
  );

  const rentExpenses = Math.abs(
    RentPaid.calculateForYear({
      params: simulationParams,
      year: year - 1,
      previousBreakdowns: [],
    }),
  );
  const movingCosts = Math.abs(
    RentMovingCost.calculateForYear({
      params: simulationParams,
      year: year - 1,
      previousBreakdowns: [],
    }),
  );
  const rentExpensesFirstYear = simulationParams.rentPerWeek * 52;
  const movingCostsFirstYear = simulationParams.rentMovingCostsFirstYear;
  const totalFirstYear = rentExpensesFirstYear + movingCostsFirstYear;

  const rentDescription =
    typeof RentPaid.description === "function"
      ? RentPaid.description(simulationParams, year - 1)
      : RentPaid.description;
  const movingDescription =
    typeof RentMovingCost.description === "function"
      ? RentMovingCost.description(simulationParams, year - 1)
      : RentMovingCost.description;

  return (
    <FormContext value={{ formData, setFormData }}>
      <CalculationFieldsContextProvider simulationParams={simulationParams}>
        <div className="flex flex-col justify-start text-left flex-1">
          <p className="mb-4">
            First, let's take a look at a renters yearly expenses
          </p>
          <div className="flex flex-col md:flex-row gap-8 text-left w-full justify-center items-start">
            <div className="flex-1 w-full">
              <div className="rounded-3xl border border-white/20 p-6">
                <Details>
                  <Summary>
                    Rent
                    <SummaryRightText>
                      {formatMoney(rentExpensesFirstYear)} / yr
                    </SummaryRightText>
                  </Summary>
                  <DetailsContent>
                    <FieldGroup>
                      <RentField />
                      <RentIncreaseField />
                    </FieldGroup>
                  </DetailsContent>
                </Details>

                <Details>
                  <Summary>
                    Moving costs
                    <SummaryRightText>
                      {formatMoney(movingCostsFirstYear)} / yr
                    </SummaryRightText>
                  </Summary>
                  <DetailsContent>
                    <FieldGroup>
                      <Details>
                        <Summary>
                          Cost per move
                          <SummaryRightText>
                            {formatMoney(simulationParams.rentCostPerMove)}
                          </SummaryRightText>
                        </Summary>
                        <DetailsContent>
                          <FieldGroup>
                            <RentMoveRemovalistsField />
                            <RentMoveCleaningField />
                            <RentMoveOverlapWeeksField />
                          </FieldGroup>
                        </DetailsContent>
                      </Details>
                      <RentMoveYearsBetweenField />
                    </FieldGroup>
                  </DetailsContent>
                </Details>

                <hr className="my-6 border-white/20" />

                <div className="flex justify-between px-4 font-bold text-lg">
                  <span>Total</span>
                  <span>{formatMoney(totalFirstYear)} / yr</span>
                </div>
              </div>
            </div>
            <div className="flex-1 w-full flex flex-col justify-center gap-4">
              <div className="rounded-3xl border border-white/20 p-6 flex flex-col items-center h-150">
                <h2 className="text-xl mb-4 font-semibold text-center mt-2">
                  Expenses in Year {year}
                </h2>
                <div className="w-full h-full flex-grow min-h-[300px]">
                  <ExplainRentChart
                    rent={rentExpenses}
                    rentDescription={rentDescription}
                    moving={movingCosts}
                    movingDescription={movingDescription}
                  />
                </div>
                <div className="w-full flex items-center gap-4 mt-6 px-10">
                  <span className="w-16 whitespace-nowrap">Year {year}</span>
                  <Slider
                    value={[year]}
                    min={1}
                    max={simulationParams.numYears}
                    step={1}
                    onValueChange={([val]: number[]) => setYear(val)}
                    className="flex-grow w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </CalculationFieldsContextProvider>
    </FormContext>
  );
}
