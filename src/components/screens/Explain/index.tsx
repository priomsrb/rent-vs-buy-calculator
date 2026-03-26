import {
  ArrowDown,
  ChevronDown,
  ChevronRight,
  Shield,
  Wallet,
} from "lucide-react";
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
    <div
      className={"flex w-full justify-center relative min-h-[calc(100vh-80px)]"}
    >
      <div className="absolute top-[-20%] left-[10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[10%] w-[40%] h-[40%] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-5xl flex-col items-center justify-center p-6 md:p-10 text-center z-10 transition-all duration-500">
        <CurrentStep />
        <div className="mt-12">
          <StepNavigation step={step} setStep={setStep} />
        </div>
      </div>
    </div>
  );
}

const STEPS = [Step1, Step2];
const INITIAL_STEP = 1;

function StepNavigation({
  step,
  setStep,
}: {
  step: number;
  setStep: (step: number) => void;
}) {
  return (
    <div className="flex justify-between w-full mt-8 max-w-4xl mx-auto px-4">
      {step === 1 ? (
        <Link to={"/start"} draggable={false}>
          <Button
            variant="outline"
            className="px-8 py-6 text-lg rounded-full backdrop-blur-md bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300"
          >
            Exit
          </Button>
        </Link>
      ) : (
        <Button
          variant="outline"
          className="px-8 py-6 text-lg rounded-full backdrop-blur-md bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300"
          onClick={() => setStep(step - 1)}
        >
          Back
        </Button>
      )}
      {step < STEPS.length && (
        <Button
          className="px-8 py-6 text-lg rounded-full bg-white text-black hover:bg-gray-200 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]"
          onClick={() => setStep(step + 1)}
        >
          Next
        </Button>
      )}
      {step >= STEPS.length && (
        <Link to={"/start"} draggable={false}>
          <Button className="px-8 py-6 text-lg rounded-full bg-white text-black hover:bg-gray-200 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]">
            Finish
          </Button>
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
        "mt-3 rounded-2xl border border-white/10 px-5 py-3 not-last:mb-4 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 data-[state=open]:bg-white/10",
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
          "flex w-full cursor-pointer items-center text-lg font-medium text-white/90 data-[state=closed]:hidden"
        }
      >
        <ChevronDown size={20} className="text-white/50" />
        <span className={"flex grow pl-3"}>{props.children}</span>
      </CollapsibleTrigger>
      <CollapsibleTrigger
        className={
          "flex w-full cursor-pointer items-center text-lg font-medium text-white/90 data-[state=open]:hidden"
        }
      >
        <ChevronRight size={20} className="text-white/50" />
        <span className={"flex grow pl-3"}>{props.children}</span>
      </CollapsibleTrigger>
    </>
  );
});

const DetailsContent = memo((props: React.HTMLProps<HTMLDivElement>) => {
  return (
    <CollapsibleContent
      className={
        "overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down pt-2"
      }
    >
      <div className="mx-1 py-4">{props.children}</div>
    </CollapsibleContent>
  );
});

const SummaryRightText = memo((props: React.HTMLProps<HTMLDivElement>) => {
  return (
    <span
      className={twMerge(
        "ml-auto py-1 px-3 bg-white/10 rounded-full text-sm font-semibold text-white/90",
        props.className,
      )}
    >
      {props.children}
    </span>
  );
});

function formDataToSimulationParams(formData: SimulationParams) {
  return getEnrichedSimulationParams({
    ...formData,
  });
}

function Step1() {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-16 py-12 animate-fade-in">
      <div className="space-y-6 max-w-3xl">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent pb-2">
          The Great Debate: Rent vs. Buy
        </h1>
        <p className="text-xl md:text-2xl text-white/60 leading-relaxed font-light">
          Imagine two individuals with the exact same income, who both choose
          entirely identical homes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl px-4">
        {/* Person 1 - Buyer */}
        <div className="relative group overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-500 p-10 shadow-2xl backdrop-blur-md hover:-translate-y-2">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10 flex flex-col items-center space-y-6 text-center">
            <div className="p-5 bg-blue-500/20 rounded-full text-blue-400 ring-1 ring-blue-500/30 group-hover:scale-110 transition-transform duration-500">
              <Shield
                size={40}
                className="drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-white mb-2">
                The Buyer
              </h2>
              <p className="text-base text-white/60 leading-relaxed">
                Decides to lock in a mortgage, building equity over time but
                paying upfront costs.
              </p>
            </div>
          </div>
        </div>

        {/* Person 2 - Renter */}
        <div className="relative group overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-500 p-10 shadow-2xl backdrop-blur-md hover:-translate-y-2">
          <div className="absolute inset-0 bg-gradient-to-bl from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10 flex flex-col items-center space-y-6 text-center">
            <div className="p-5 bg-purple-500/20 rounded-full text-purple-400 ring-1 ring-purple-500/30 group-hover:scale-110 transition-transform duration-500">
              <Wallet
                size={40}
                className="drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-white mb-2">
                The Renter
              </h2>
              <p className="text-base text-white/60 leading-relaxed">
                Chooses flexibility, investing the difference between rent and a
                mortgage payment.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center space-y-6 pt-12">
        <h3 className="text-2xl font-semibold text-white/80">
          Let's see who comes out ahead
        </h3>
        <div className="animate-bounce text-white/40 bg-white/5 p-3 rounded-full border border-white/10">
          <ArrowDown size={28} />
        </div>
      </div>
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
        <div className="flex flex-col justify-start text-left flex-1 animate-fade-in w-full">
          <div className="mb-12 text-center md:text-left space-y-4 max-w-2xl mx-auto md:mx-0">
            <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-sm font-medium text-white/80 backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-purple-500 mr-2" />
              Renting Profile
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
              Renter's Yearly Expenses
            </h1>
            <p className="text-xl text-white/60">
              Breaking down the costs associated with renting over time.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-10 text-left w-full justify-center items-stretch">
            <div className="flex-1 w-full flex flex-col">
              <div className="rounded-[2.5rem] border border-white/10 bg-white/5 backdrop-blur-md p-8 shadow-2xl flex-grow h-full">
                <h3 className="text-2xl font-semibold text-white/90 mb-6 px-1">
                  Expense Breakdown
                </h3>
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
                          <SummaryRightText className="bg-white/5">
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

                <hr className="my-8 border-white/10" />

                <div className="flex justify-between items-center px-6 py-4 rounded-2xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-white/10 shadow-inner">
                  <span className="font-bold text-xl text-white">
                    Total Year 1
                  </span>
                  <span className="font-bold text-2xl text-white tracking-tight">
                    {formatMoney(totalFirstYear)}{" "}
                    <span className="text-lg text-white/60 font-medium">
                      / yr
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex-1 w-full flex flex-col justify-center gap-4">
              <div className="rounded-[2.5rem] border border-white/10 bg-white/5 backdrop-blur-md p-8 flex flex-col items-center shadow-2xl h-full min-h-[500px]">
                <div className="flex flex-col items-center mb-8">
                  <h2 className="text-2xl font-bold tracking-tight text-white mb-2">
                    Visualizing Expenses
                  </h2>
                  <div className="px-4 py-1.5 rounded-full bg-white/10 border border-white/5 text-sm font-medium text-white/80">
                    Year {year} of {simulationParams.numYears}
                  </div>
                </div>

                <div className="w-full h-full flex-grow relative min-h-[300px] flex items-center justify-center p-4 bg-black/20 rounded-3xl border border-white/5 inner-shadow">
                  <ExplainRentChart
                    rent={rentExpenses}
                    rentDescription={rentDescription}
                    moving={movingCosts}
                    movingDescription={movingDescription}
                  />
                </div>

                <div className="w-full flex items-center gap-6 mt-10 px-6 bg-black/20 py-4 rounded-2xl border border-white/5">
                  <span className="font-medium text-white/80 whitespace-nowrap bg-white/10 px-3 py-1 rounded-full text-sm">
                    Year {year}
                  </span>
                  <Slider
                    value={[year]}
                    min={1}
                    max={simulationParams.numYears}
                    step={1}
                    onValueChange={([val]: number[]) => setYear(val)}
                    className="flex-grow w-full cursor-pointer"
                  />
                  <span className="font-medium text-white/50 text-sm">
                    Year {simulationParams.numYears}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CalculationFieldsContextProvider>
    </FormContext>
  );
}
