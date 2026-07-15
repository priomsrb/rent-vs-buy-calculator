import {
  ArrowDown,
  ChevronDown,
  ChevronRight,
  Shield,
  TrendingDown,
  Wallet,
} from "lucide-react";
import { memo, useCallback, useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";

import {
  type SimulationParams,
  getEnrichedSimulationParams,
} from "@/calculation/EnrichedSimulationParams";
import { simulate } from "@/calculation/Simulator";
import { BuyCase } from "@/calculation/cases/BuyCase";
import { RentCase } from "@/calculation/cases/RentCase";
import { BuyMovingCost } from "@/calculation/cases/gain-loss/BuyMovingCost";
import { CouncilRatesPaid } from "@/calculation/cases/gain-loss/CouncilRatesPaid";
import { ExtraSavings } from "@/calculation/cases/gain-loss/ExtraSavings";
import { ExtraSavingsInvestment } from "@/calculation/cases/gain-loss/ExtraSavingsInvestment";
import { InsurancePaid } from "@/calculation/cases/gain-loss/InsurancePaid";
import { MaintenanceCost } from "@/calculation/cases/gain-loss/MaintenanceCost";
import { MortgagePaid } from "@/calculation/cases/gain-loss/MortgagePaid";
import { PrincipalPaid } from "@/calculation/cases/gain-loss/PrincipalPaid";
import { PropertyAppreciation } from "@/calculation/cases/gain-loss/PropertyAppreciation";
import { RentMovingCost } from "@/calculation/cases/gain-loss/RentMovingCost";
import { RentPaid } from "@/calculation/cases/gain-loss/RentPaid";
import { StrataPaid } from "@/calculation/cases/gain-loss/StrataPaid";
import { ChartNetWorth } from "@/components/ChartNetWorth";
import { FormContext } from "@/components/Forms";
import { StepIndicator } from "@/components/StepIndicator";
import {
  AgentFeesField,
  BuyMoveInspectionField,
  BuyMoveOtherCostsField,
  BuyMoveYearsBetweenField,
  CalculationFieldsContextProvider,
  CouncilRatesField,
  InsuranceField,
  InterestRateField,
  InvestmentReturnField,
  LegalFeesField,
  LoanTermField,
  MaintenanceCostField,
  MoversField,
  NextPropertyPriceField,
  NextPropertyStampDutyField,
  PropertyGrowthRateField,
  RentField,
  RentIncreaseField,
  RentMoveCleaningField,
  RentMoveOverlapWeeksField,
  RentMoveRemovalistsField,
  RentMoveYearsBetweenField,
  StrataField,
} from "@/components/screens/Results/CalculationDetails/fields";
import { basePreset } from "@/components/screens/Results/formPresets";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { FieldGroup } from "@/components/ui/field";
import {
  ScreenBackdrop,
  pillOutlineClass,
  pillPrimaryClass,
} from "@/components/ui/glass";
import { Slider } from "@/components/ui/slider";
import { formatMoney } from "@/utils/formatMoney";
import { parseLocalStorage, writeToLocalStorage } from "@/utils/localStorage";
import { Link } from "@tanstack/react-router";

import { Button } from "../../ui/button";
import { ExplainBuyChart } from "./ExplainBuyChart";
import { ExplainBuyGainsChart } from "./ExplainBuyGainsChart";
import { ExplainRentChart } from "./ExplainRentChart";
import { ExplainRentGainsChart } from "./ExplainRentGainsChart";

export function Explain({ step }: { step: number }) {
  const CurrentStep = getViewForStep(step);

  return (
    <div
      className={"flex w-full justify-center relative min-h-[calc(100vh-80px)]"}
    >
      <ScreenBackdrop />

      <div className="w-full max-w-5xl flex-col items-center justify-center p-6 md:p-10 text-center z-10 transition-all duration-500">
        <div className="mb-8 flex justify-center">
          <StepIndicator
            step={step}
            totalSteps={STEPS.length}
            label={STEP_TITLES[step - 1]}
          />
        </div>
        <CurrentStep />
        <div className="mt-12">
          <StepNavigation step={step} />
        </div>
      </div>
    </div>
  );
}

const STEPS = [
  Step1,
  Step2,
  Step3,
  Step4,
  StepRenterGains,
  StepBuyerGains,
  StepFinalSummary,
];

const STEP_TITLES = [
  "The setup",
  "Renting costs",
  "Buying costs",
  "Year-one comparison",
  "Renter's gains",
  "Buyer's gains",
  "The full picture",
];

/** Where "back to results" should land: the results page for the property
 *  the user picked, or the start of the flow if that's somehow missing. */
function BackToResultsLink({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const presetId = parseLocalStorage("formData")?.id;
  if (presetId) {
    return (
      <Link
        to={"/results/$presetId"}
        params={{ presetId }}
        draggable={false}
        className={className}
      >
        {children}
      </Link>
    );
  }
  return (
    <Link to={"/start"} draggable={false} className={className}>
      {children}
    </Link>
  );
}

function StepNavigation({ step }: { step: number }) {
  return (
    <div className="flex justify-between w-full mt-8 max-w-4xl mx-auto px-4">
      {step === 1 ? (
        <BackToResultsLink>
          <Button variant="outline" className={pillOutlineClass}>
            ← Back to results
          </Button>
        </BackToResultsLink>
      ) : (
        <Link
          to={"/explain/$step"}
          params={{ step: String(step - 1) }}
          draggable={false}
        >
          <Button variant="outline" className={pillOutlineClass}>
            Back
          </Button>
        </Link>
      )}
      {step < STEPS.length && (
        <Link
          to={"/explain/$step"}
          params={{ step: String(step + 1) }}
          draggable={false}
        >
          <Button className={pillPrimaryClass}>
            Next: {STEP_TITLES[step]} →
          </Button>
        </Link>
      )}
      {step >= STEPS.length && (
        <BackToResultsLink>
          <Button className={pillPrimaryClass}>Back to results</Button>
        </BackToResultsLink>
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
        "mt-3 rounded-2xl border border-foreground/10 px-5 py-3 not-last:mb-4 bg-foreground/5 backdrop-blur-sm transition-all duration-300 hover:bg-foreground/10 data-[state=open]:bg-foreground/10",
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
          "flex w-full cursor-pointer items-center text-lg font-medium text-foreground/90 data-[state=closed]:hidden"
        }
      >
        <ChevronDown size={20} className="text-foreground/50 shrink-0" />
        <span className={"flex grow items-center pl-3 gap-2 text-left"}>
          {props.children}
        </span>
      </CollapsibleTrigger>
      <CollapsibleTrigger
        className={
          "flex w-full cursor-pointer items-center text-lg font-medium text-foreground/90 data-[state=open]:hidden"
        }
      >
        <ChevronRight size={20} className="text-foreground/50 shrink-0" />
        <span className={"flex grow items-center pl-3 gap-2 text-left"}>
          {props.children}
        </span>
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
        "ml-auto py-1 px-3 bg-foreground/10 rounded-full text-sm font-semibold text-foreground/90 whitespace-nowrap shrink-0",
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
        <h1 className="gradient-title text-4xl md:text-6xl">
          The Great Debate: Rent vs. Buy
        </h1>
        <p className="text-xl md:text-2xl text-foreground/60 leading-relaxed font-light">
          Imagine two individuals with the exact same income, who both choose
          entirely identical homes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl px-4">
        {/* Person 1 - Buyer */}
        <div className="relative group overflow-hidden rounded-[2.5rem] border border-foreground/10 bg-foreground/5 hover:bg-foreground/10 transition-all duration-500 p-10 shadow-2xl backdrop-blur-md hover:-translate-y-2">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10 flex flex-col items-center space-y-6 text-center">
            <div className="p-5 bg-blue-500/20 rounded-full text-blue-600 dark:text-blue-400 ring-1 ring-blue-500/30 group-hover:scale-110 transition-transform duration-500">
              <Shield
                size={40}
                className="drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground mb-2">
                The Buyer
              </h2>
              <p className="text-base text-foreground/60 leading-relaxed">
                Decides to lock in a mortgage, building equity over time but
                paying upfront costs.
              </p>
            </div>
          </div>
        </div>

        {/* Person 2 - Renter */}
        <div className="relative group overflow-hidden rounded-[2.5rem] border border-foreground/10 bg-foreground/5 hover:bg-foreground/10 transition-all duration-500 p-10 shadow-2xl backdrop-blur-md hover:-translate-y-2">
          <div className="absolute inset-0 bg-gradient-to-bl from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10 flex flex-col items-center space-y-6 text-center">
            <div className="p-5 bg-green-500/20 rounded-full text-green-600 dark:text-green-400 ring-1 ring-green-500/30 group-hover:scale-110 transition-transform duration-500">
              <Wallet
                size={40}
                className="drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground mb-2">
                The Renter
              </h2>
              <p className="text-base text-foreground/60 leading-relaxed">
                Chooses flexibility, investing the difference between rent and a
                mortgage payment.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center space-y-6 pt-12">
        <h3 className="text-2xl font-semibold text-foreground/80">
          Let's see who comes out ahead
        </h3>
        <div className="animate-bounce text-foreground/40 bg-foreground/5 p-3 rounded-full border border-foreground/10">
          <ArrowDown size={28} />
        </div>
      </div>
    </div>
  );
}

function Step2() {
  const existingFormData = parseLocalStorage("formData") ?? {};
  const defaultValues = {
    ...basePreset,
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
      year,
      previousBreakdowns: [],
    }),
  );
  const movingCosts = Math.abs(
    RentMovingCost.calculateForYear({
      params: simulationParams,
      year,
      previousBreakdowns: [],
    }),
  );
  const rentExpensesFirstYear = simulationParams.rentPerWeek * 52;
  const movingCostsFirstYear = simulationParams.rentMovingCostsFirstYear;
  const totalFirstYear = rentExpensesFirstYear + movingCostsFirstYear;

  const rentDescription =
    typeof RentPaid.description === "function"
      ? RentPaid.description(simulationParams, year)
      : RentPaid.description;
  const movingDescription =
    typeof RentMovingCost.description === "function"
      ? RentMovingCost.description(simulationParams, year)
      : RentMovingCost.description;

  return (
    <FormContext value={{ formData, setFormData }}>
      <CalculationFieldsContextProvider simulationParams={simulationParams}>
        <div className="flex flex-col justify-start text-left flex-1 animate-fade-in w-full">
          <div className="mb-12 text-center md:text-left space-y-4 max-w-2xl mx-auto md:mx-0">
            <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full border border-foreground/10 bg-foreground/5 text-sm font-medium text-foreground/80 backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2" />
              Renting Profile
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              Renter's Yearly Expenses
            </h1>
            <p className="text-xl text-foreground/60">
              Breaking down the costs associated with renting over time.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-10 text-left w-full justify-center items-stretch">
            <div className="flex-1 w-full flex flex-col">
              <div className="rounded-[2.5rem] border border-foreground/10 bg-foreground/5 backdrop-blur-md p-8 shadow-2xl flex-grow h-full">
                <h3 className="text-2xl font-semibold text-foreground/90 mb-6 px-1">
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
                          <SummaryRightText className="bg-foreground/5">
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

                <hr className="my-8 border-foreground/10" />

                <div className="flex justify-between items-center px-4 sm:px-6 py-4 rounded-2xl bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-foreground/10 shadow-inner gap-2 sm:gap-4">
                  <span className="font-bold text-lg sm:text-xl text-foreground whitespace-nowrap">
                    Total Year 1
                  </span>
                  <span className="font-bold text-xl sm:text-2xl text-foreground tracking-tight text-right pt-0.5 sm:pt-0">
                    {formatMoney(totalFirstYear)}{" "}
                    <span className="text-base sm:text-lg text-foreground/60 font-medium whitespace-nowrap">
                      / yr
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex-1 w-full flex flex-col justify-center gap-4">
              <div className="rounded-[2.5rem] border border-foreground/10 bg-foreground/5 backdrop-blur-md p-8 flex flex-col items-center shadow-2xl h-full min-h-[500px]">
                <div className="flex flex-col items-center mb-8">
                  <h2 className="text-2xl font-bold tracking-tight text-foreground mb-2">
                    Visualizing Expenses
                  </h2>
                  <div className="px-4 py-1.5 rounded-full bg-foreground/10 border border-foreground/10 text-sm font-medium text-foreground/80">
                    Year {year} of {simulationParams.numYears}
                  </div>
                </div>

                <div className="w-full h-full flex-grow relative min-h-[300px] bg-foreground/5 rounded-3xl border border-foreground/10 inner-shadow">
                  <div className="absolute inset-0 p-4">
                    <ExplainRentChart
                      rent={rentExpenses}
                      rentDescription={rentDescription}
                      moving={movingCosts}
                      movingDescription={movingDescription}
                    />
                  </div>
                </div>

                <div className="w-full flex items-center gap-6 mt-10 px-6 bg-foreground/5 py-4 rounded-2xl border border-foreground/10">
                  <span className="font-medium text-foreground/80 whitespace-nowrap bg-foreground/10 px-3 py-1 rounded-full text-sm">
                    Year {year}
                  </span>
                  <Slider
                    value={[year]}
                    min={0}
                    max={simulationParams.numYears}
                    step={1}
                    onValueChange={([val]: number[]) => setYear(val)}
                    className="flex-grow w-full cursor-pointer"
                  />
                  <span className="font-medium text-foreground/50 text-sm">
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

function StepRenterGains() {
  const existingFormData = parseLocalStorage("formData") ?? {};
  const defaultValues = {
    ...basePreset,
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

  const simulationResult = useMemo(
    () => simulate(simulationParams, [BuyCase, RentCase]),
    [simulationParams],
  );

  const rentBreakdown = simulationResult.cases.rent!;
  const buyBreakdown = simulationResult.cases.buy!;
  const { breakdownInfo } = simulationResult;

  const getTotalExpenses = (breakdown: Record<string, number>) =>
    Math.abs(
      Object.entries(breakdown)
        .filter(([key, value]) => !breakdownInfo[key]?.asset && value < 0)
        .reduce((sum, [, value]) => sum + value, 0),
    );

  const yearBreakdown = rentBreakdown.breakdownByYear[year];
  const extraSavings = yearBreakdown[ExtraSavings.key] ?? 0;
  const extraSavingsInvestmentGain =
    yearBreakdown[ExtraSavingsInvestment.key] ?? 0;

  const year1RentBreakdown = rentBreakdown.breakdownByYear[1];
  const year1BuyBreakdown = buyBreakdown.breakdownByYear[1];
  const rentExpensesYear1 = getTotalExpenses(year1RentBreakdown);
  const buyExpensesYear1 = getTotalExpenses(year1BuyBreakdown);
  const extraSavingsFirstYear = year1RentBreakdown[ExtraSavings.key] ?? 0;
  const totalFirstYear = extraSavingsFirstYear;

  return (
    <FormContext value={{ formData, setFormData }}>
      <CalculationFieldsContextProvider simulationParams={simulationParams}>
        <div className="flex flex-col justify-start text-left flex-1 animate-fade-in w-full">
          <div className="mb-12 text-center md:text-left space-y-4 max-w-2xl mx-auto md:mx-0">
            <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full border border-foreground/10 bg-foreground/5 text-sm font-medium text-foreground/80 backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2" />
              Renting Profile
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              Renter's Yearly Gains
            </h1>
            <p className="text-xl text-foreground/60">
              Breaking down the financial gains a renter accumulates over time.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-10 text-left w-full justify-center items-stretch">
            <div className="flex-1 w-full flex flex-col">
              <div className="rounded-[2.5rem] border border-foreground/10 bg-foreground/5 backdrop-blur-md p-8 shadow-2xl flex-grow h-full">
                <h3 className="text-2xl font-semibold text-foreground/90 mb-6 px-1">
                  Gain Breakdown
                </h3>
                <Details>
                  <Summary>
                    {ExtraSavings.label}
                    <SummaryRightText>
                      {formatMoney(extraSavingsFirstYear)} / yr
                    </SummaryRightText>
                  </Summary>
                  <DetailsContent>
                    <p className="text-foreground/60 text-sm mb-4">
                      {ExtraSavings.description as string}
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center text-foreground/70">
                        <span>Renting costs</span>
                        <span className="font-medium text-red-600 dark:text-red-400">
                          {formatMoney(rentExpensesYear1)} / yr
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-foreground/70">
                        <span>Owning costs</span>
                        <span className="font-medium text-red-600 dark:text-red-400">
                          {formatMoney(buyExpensesYear1)} / yr
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-foreground/10 font-semibold text-foreground/90">
                        <span>You save</span>
                        <span className="text-green-600 dark:text-green-400">
                          {formatMoney(extraSavingsFirstYear)} / yr
                        </span>
                      </div>
                    </div>
                  </DetailsContent>
                </Details>

                <Details>
                  <Summary>
                    {ExtraSavingsInvestment.label}
                    <SummaryRightText className="text-foreground/40">
                      {formatMoney(extraSavingsInvestmentGain)} / yr
                    </SummaryRightText>
                  </Summary>
                  <DetailsContent>
                    <p className="text-foreground/60 text-sm">
                      {ExtraSavingsInvestment.description as string}
                    </p>
                    <FieldGroup>
                      <InvestmentReturnField />
                    </FieldGroup>
                  </DetailsContent>
                </Details>

                <hr className="my-8 border-foreground/10" />

                <div className="flex justify-between items-center px-4 sm:px-6 py-4 rounded-2xl bg-gradient-to-r from-green-500/20 to-teal-500/20 border border-foreground/10 shadow-inner gap-2 sm:gap-4">
                  <span className="font-bold text-lg sm:text-xl text-foreground whitespace-nowrap">
                    Total Year 1
                  </span>
                  <span className="font-bold text-xl sm:text-2xl text-foreground tracking-tight text-right pt-0.5 sm:pt-0">
                    {formatMoney(totalFirstYear)}{" "}
                    <span className="text-base sm:text-lg text-foreground/60 font-medium whitespace-nowrap">
                      / yr
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex-1 w-full flex flex-col justify-center gap-4">
              <div className="rounded-[2.5rem] border border-foreground/10 bg-foreground/5 backdrop-blur-md p-8 flex flex-col items-center shadow-2xl h-full min-h-[500px]">
                <div className="flex flex-col items-center mb-8">
                  <h2 className="text-2xl font-bold tracking-tight text-foreground mb-2">
                    Visualizing Gains
                  </h2>
                  <div className="px-4 py-1.5 rounded-full bg-foreground/10 border border-foreground/10 text-sm font-medium text-foreground/80">
                    Year {year} of {simulationParams.numYears}
                  </div>
                </div>

                <div className="w-full h-full flex-grow relative min-h-[300px] bg-foreground/5 rounded-3xl border border-foreground/10 inner-shadow">
                  <div className="absolute inset-0 p-4">
                    <ExplainRentGainsChart
                      extraSavings={extraSavings}
                      extraSavingsDescription={
                        ExtraSavings.description as string
                      }
                      extraSavingsInvestment={extraSavingsInvestmentGain}
                      extraSavingsInvestmentDescription={
                        ExtraSavingsInvestment.description as string
                      }
                    />
                  </div>
                </div>

                <div className="w-full flex items-center gap-6 mt-10 px-6 bg-foreground/5 py-4 rounded-2xl border border-foreground/10">
                  <span className="font-medium text-foreground/80 whitespace-nowrap bg-foreground/10 px-3 py-1 rounded-full text-sm">
                    Year {year}
                  </span>
                  <Slider
                    value={[year]}
                    min={0}
                    max={simulationParams.numYears}
                    step={1}
                    onValueChange={([val]: number[]) => setYear(val)}
                    className="flex-grow w-full cursor-pointer"
                  />
                  <span className="font-medium text-foreground/50 text-sm">
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

function StepBuyerGains() {
  const existingFormData = parseLocalStorage("formData") ?? {};
  const defaultValues = {
    ...basePreset,
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

  const simulationResult = useMemo(
    () => simulate(simulationParams, [BuyCase, RentCase]),
    [simulationParams],
  );

  const buyBreakdown = simulationResult.cases.buy!;
  const rentBreakdown = simulationResult.cases.rent!;
  const { breakdownInfo } = simulationResult;

  const getTotalExpenses = (breakdown: Record<string, number>) =>
    Math.abs(
      Object.entries(breakdown)
        .filter(([key, value]) => !breakdownInfo[key]?.asset && value < 0)
        .reduce((sum, [, value]) => sum + value, 0),
    );

  const yearBreakdown = buyBreakdown.breakdownByYear[year];
  const propertyAppreciation = yearBreakdown[PropertyAppreciation.key] ?? 0;
  const principalPaid = yearBreakdown[PrincipalPaid.key] ?? 0;
  const extraSavings = yearBreakdown[ExtraSavings.key] ?? 0;
  const extraSavingsInvestmentGain =
    yearBreakdown[ExtraSavingsInvestment.key] ?? 0;

  const year1BuyBreakdown = buyBreakdown.breakdownByYear[1];
  const year1RentBreakdown = rentBreakdown.breakdownByYear[1];
  const buyExpensesYear1 = getTotalExpenses(year1BuyBreakdown);
  const rentExpensesYear1 = getTotalExpenses(year1RentBreakdown);
  const propertyAppreciationYear1 =
    year1BuyBreakdown[PropertyAppreciation.key] ?? 0;
  const principalPaidYear1 = year1BuyBreakdown[PrincipalPaid.key] ?? 0;
  const extraSavingsYear1 = year1BuyBreakdown[ExtraSavings.key] ?? 0;
  const totalFirstYear =
    propertyAppreciationYear1 + principalPaidYear1 + extraSavingsYear1;

  const getDescription = (Component: any) =>
    typeof Component.description === "function"
      ? Component.description(simulationParams, year)
      : Component.description;

  return (
    <FormContext value={{ formData, setFormData }}>
      <CalculationFieldsContextProvider simulationParams={simulationParams}>
        <div className="flex flex-col justify-start text-left flex-1 animate-fade-in w-full">
          <div className="mb-12 text-center md:text-left space-y-4 max-w-2xl mx-auto md:mx-0">
            <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full border border-foreground/10 bg-foreground/5 text-sm font-medium text-foreground/80 backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-blue-500 mr-2" />
              Buying Profile
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              Buyer's Yearly Gains
            </h1>
            <p className="text-xl text-foreground/60">
              Breaking down the financial gains a buyer accumulates over time.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-10 text-left w-full justify-center items-stretch">
            <div className="flex-1 w-full flex flex-col">
              <div className="rounded-[2.5rem] border border-foreground/10 bg-foreground/5 backdrop-blur-md p-8 shadow-2xl flex-grow h-full">
                <h3 className="text-2xl font-semibold text-foreground/90 mb-6 px-1">
                  Gain Breakdown
                </h3>

                <Details>
                  <Summary>
                    {PropertyAppreciation.label}
                    <SummaryRightText>
                      {formatMoney(propertyAppreciationYear1)} / yr
                    </SummaryRightText>
                  </Summary>
                  <DetailsContent>
                    <p className="text-foreground/60 text-sm mb-4">
                      {PropertyAppreciation.description as string}
                    </p>
                    <FieldGroup>
                      <PropertyGrowthRateField />
                    </FieldGroup>
                  </DetailsContent>
                </Details>

                <Details>
                  <Summary>
                    {PrincipalPaid.label}
                    <SummaryRightText>
                      {formatMoney(principalPaidYear1)} / yr
                    </SummaryRightText>
                  </Summary>
                  <DetailsContent>
                    <p className="text-foreground/60 text-sm">
                      Each mortgage repayment reduces your loan balance,
                      building equity in your home.
                    </p>
                  </DetailsContent>
                </Details>

                {extraSavingsYear1 > 0 && (
                  <Details>
                    <Summary>
                      {ExtraSavings.label}
                      <SummaryRightText>
                        {formatMoney(extraSavingsYear1)} / yr
                      </SummaryRightText>
                    </Summary>
                    <DetailsContent>
                      <p className="text-foreground/60 text-sm mb-4">
                        {ExtraSavings.description as string}
                      </p>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center text-foreground/70">
                          <span>Owning costs</span>
                          <span className="font-medium text-red-600 dark:text-red-400">
                            {formatMoney(buyExpensesYear1)} / yr
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-foreground/70">
                          <span>Renting costs</span>
                          <span className="font-medium text-red-600 dark:text-red-400">
                            {formatMoney(rentExpensesYear1)} / yr
                          </span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-foreground/10 font-semibold text-foreground/90">
                          <span>You save</span>
                          <span className="text-green-600 dark:text-green-400">
                            {formatMoney(extraSavingsYear1)} / yr
                          </span>
                        </div>
                      </div>
                    </DetailsContent>
                  </Details>
                )}

                {extraSavingsYear1 > 0 && (
                  <Details>
                    <Summary>
                      {ExtraSavingsInvestment.label}
                      <SummaryRightText className="text-foreground/40">
                        Compounds over time
                      </SummaryRightText>
                    </Summary>
                    <DetailsContent>
                      <p className="text-foreground/60 text-sm">
                        {ExtraSavingsInvestment.description as string}
                      </p>
                    </DetailsContent>
                  </Details>
                )}

                <hr className="my-8 border-foreground/10" />

                <div className="flex justify-between items-center px-4 sm:px-6 py-4 rounded-2xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-foreground/10 shadow-inner gap-2 sm:gap-4">
                  <span className="font-bold text-lg sm:text-xl text-foreground whitespace-nowrap">
                    Total Year 1
                  </span>
                  <span className="font-bold text-xl sm:text-2xl text-foreground tracking-tight text-right pt-0.5 sm:pt-0">
                    {formatMoney(totalFirstYear)}{" "}
                    <span className="text-base sm:text-lg text-foreground/60 font-medium whitespace-nowrap">
                      / yr
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex-1 w-full flex flex-col justify-center gap-4">
              <div className="rounded-[2.5rem] border border-foreground/10 bg-foreground/5 backdrop-blur-md p-8 flex flex-col items-center shadow-2xl h-full min-h-[500px]">
                <div className="flex flex-col items-center mb-8">
                  <h2 className="text-2xl font-bold tracking-tight text-foreground mb-2">
                    Visualizing Gains
                  </h2>
                  <div className="px-4 py-1.5 rounded-full bg-foreground/10 border border-foreground/10 text-sm font-medium text-foreground/80">
                    Year {year} of {simulationParams.numYears}
                  </div>
                </div>

                <div className="w-full h-full flex-grow relative min-h-[300px] bg-foreground/5 rounded-3xl border border-foreground/10 inner-shadow">
                  <div className="absolute inset-0 p-4">
                    <ExplainBuyGainsChart
                      propertyAppreciation={propertyAppreciation}
                      propertyAppreciationDescription={getDescription(
                        PropertyAppreciation,
                      )}
                      principalPaid={principalPaid}
                      principalPaidDescription={
                        "Each mortgage repayment reduces your loan balance, building equity in your home."
                      }
                      extraSavings={extraSavings}
                      extraSavingsDescription={
                        ExtraSavings.description as string
                      }
                      extraSavingsInvestment={extraSavingsInvestmentGain}
                      extraSavingsInvestmentDescription={
                        ExtraSavingsInvestment.description as string
                      }
                    />
                  </div>
                </div>

                <div className="w-full flex items-center gap-6 mt-10 px-6 bg-foreground/5 py-4 rounded-2xl border border-foreground/10">
                  <span className="font-medium text-foreground/80 whitespace-nowrap bg-foreground/10 px-3 py-1 rounded-full text-sm">
                    Year {year}
                  </span>
                  <Slider
                    value={[year]}
                    min={0}
                    max={simulationParams.numYears}
                    step={1}
                    onValueChange={([val]: number[]) => setYear(val)}
                    className="flex-grow w-full cursor-pointer"
                  />
                  <span className="font-medium text-foreground/50 text-sm">
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

function Step3() {
  const existingFormData = parseLocalStorage("formData") ?? {};
  const defaultValues = {
    ...basePreset,
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

  const calcParams = {
    params: simulationParams,
    year,
    previousBreakdowns: [],
  };

  const mortgageExpenses = Math.abs(MortgagePaid.calculateForYear(calcParams));
  const maintenanceExpenses = Math.abs(
    MaintenanceCost.calculateForYear(calcParams),
  );
  const strataExpenses = Math.abs(StrataPaid.calculateForYear(calcParams));
  const councilRates = Math.abs(CouncilRatesPaid.calculateForYear(calcParams));
  const insuranceExpenses = Math.abs(
    InsurancePaid.calculateForYear(calcParams),
  );
  const movingCosts = Math.abs(BuyMovingCost.calculateForYear(calcParams));

  const calcParamsFirstYear = {
    params: simulationParams,
    year: 0,
    previousBreakdowns: [],
  };
  const mortgageExpensesFirstYear = Math.abs(
    MortgagePaid.calculateForYear(calcParamsFirstYear),
  );
  const maintenanceExpensesFirstYear =
    Math.abs(MaintenanceCost.calculateForYear(calcParamsFirstYear)) +
    Math.abs(StrataPaid.calculateForYear(calcParamsFirstYear));
  const miscExpensesFirstYear =
    Math.abs(CouncilRatesPaid.calculateForYear(calcParamsFirstYear)) +
    Math.abs(InsurancePaid.calculateForYear(calcParamsFirstYear));

  const movingCostsFirstYear = simulationParams.buyMovingCostsFirstYear;
  const ongoingBuyerCostsFirstYear =
    simulationParams.ongoingBuyerCostsFirstYear;
  const totalFirstYear = ongoingBuyerCostsFirstYear + movingCostsFirstYear;

  const getDescription = (Component: any) =>
    typeof Component.description === "function"
      ? Component.description(simulationParams, year)
      : Component.description;

  return (
    <FormContext value={{ formData, setFormData }}>
      <CalculationFieldsContextProvider simulationParams={simulationParams}>
        <div className="flex flex-col justify-start text-left flex-1 animate-fade-in w-full">
          <div className="mb-12 text-center md:text-left space-y-4 max-w-2xl mx-auto md:mx-0">
            <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full border border-foreground/10 bg-foreground/5 text-sm font-medium text-foreground/80 backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-blue-500 mr-2" />
              Buying Profile
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              Buyer's Yearly Expenses
            </h1>
            <p className="text-xl text-foreground/60">
              Breaking down the costs associated with owning a home over time.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-10 text-left w-full justify-center items-stretch">
            <div className="flex-1 w-full flex flex-col">
              <div className="rounded-[2.5rem] border border-foreground/10 bg-foreground/5 backdrop-blur-md p-8 shadow-2xl flex-grow h-full">
                <h3 className="text-2xl font-semibold text-foreground/90 mb-6 px-1">
                  Expense Breakdown
                </h3>
                <Details>
                  <Summary>
                    Mortgage
                    <SummaryRightText>
                      {formatMoney(mortgageExpensesFirstYear)} / yr
                    </SummaryRightText>
                  </Summary>
                  <DetailsContent>
                    <FieldGroup>
                      <InterestRateField />
                      <LoanTermField />
                    </FieldGroup>
                  </DetailsContent>
                </Details>

                <Details>
                  <Summary>
                    Maintenance
                    <SummaryRightText>
                      {formatMoney(maintenanceExpensesFirstYear)} / yr
                    </SummaryRightText>
                  </Summary>
                  <DetailsContent>
                    <FieldGroup>
                      <MaintenanceCostField />
                      <StrataField />
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
                      <BuyMoveYearsBetweenField />
                      <Details>
                        <Summary>
                          Cost per move
                          <SummaryRightText className="bg-foreground/5">
                            {formatMoney(simulationParams.buyCostPerMove)}
                          </SummaryRightText>
                        </Summary>
                        <DetailsContent>
                          <FieldGroup>
                            <NextPropertyPriceField />
                            <NextPropertyStampDutyField />
                            <LegalFeesField />
                            <AgentFeesField />
                            <MoversField />
                            <BuyMoveInspectionField />
                            <BuyMoveOtherCostsField />
                          </FieldGroup>
                        </DetailsContent>
                      </Details>
                    </FieldGroup>
                  </DetailsContent>
                </Details>

                <Details>
                  <Summary>
                    Misc
                    <SummaryRightText>
                      {formatMoney(miscExpensesFirstYear)} / yr
                    </SummaryRightText>
                  </Summary>
                  <DetailsContent>
                    <FieldGroup>
                      <CouncilRatesField />
                      <InsuranceField />
                    </FieldGroup>
                  </DetailsContent>
                </Details>

                <hr className="my-8 border-foreground/10" />

                <div className="flex justify-between items-center px-4 sm:px-6 py-4 rounded-2xl bg-gradient-to-r from-blue-500/20 to-green-500/20 border border-foreground/10 shadow-inner gap-2 sm:gap-4">
                  <span className="font-bold text-lg sm:text-xl text-foreground whitespace-nowrap">
                    Total Year 1
                  </span>
                  <span className="font-bold text-xl sm:text-2xl text-foreground tracking-tight text-right pt-0.5 sm:pt-0">
                    {formatMoney(totalFirstYear)}{" "}
                    <span className="text-base sm:text-lg text-foreground/60 font-medium whitespace-nowrap">
                      / yr
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex-1 w-full flex flex-col justify-center gap-4">
              <div className="rounded-[2.5rem] border border-foreground/10 bg-foreground/5 backdrop-blur-md p-8 flex flex-col items-center shadow-2xl h-full min-h-[500px]">
                <div className="flex flex-col items-center mb-8">
                  <h2 className="text-2xl font-bold tracking-tight text-foreground mb-2">
                    Visualizing Expenses
                  </h2>
                  <div className="px-4 py-1.5 rounded-full bg-foreground/10 border border-foreground/10 text-sm font-medium text-foreground/80">
                    Year {year} of {simulationParams.numYears}
                  </div>
                </div>

                <div className="w-full h-full flex-grow relative min-h-[300px] bg-foreground/5 rounded-3xl border border-foreground/10 inner-shadow">
                  <div className="absolute inset-0 p-4">
                    <ExplainBuyChart
                      mortgage={mortgageExpenses}
                      mortgageDescription={getDescription(MortgagePaid)}
                      maintenance={maintenanceExpenses}
                      maintenanceDescription={getDescription(MaintenanceCost)}
                      strata={strataExpenses}
                      strataDescription={getDescription(StrataPaid)}
                      councilRates={councilRates}
                      councilRatesDescription={getDescription(CouncilRatesPaid)}
                      insurance={insuranceExpenses}
                      insuranceDescription={getDescription(InsurancePaid)}
                      moving={movingCosts}
                      movingDescription={getDescription(BuyMovingCost)}
                    />
                  </div>
                </div>

                <div className="w-full flex items-center gap-6 mt-10 px-6 bg-foreground/5 py-4 rounded-2xl border border-foreground/10">
                  <span className="font-medium text-foreground/80 whitespace-nowrap bg-foreground/10 px-3 py-1 rounded-full text-sm">
                    Year {year}
                  </span>
                  <Slider
                    value={[year]}
                    min={0}
                    max={simulationParams.numYears}
                    step={1}
                    onValueChange={([val]: number[]) => setYear(val)}
                    className="flex-grow w-full cursor-pointer"
                  />
                  <span className="font-medium text-foreground/50 text-sm">
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

function Step4() {
  const existingFormData = parseLocalStorage("formData") ?? {};
  const defaultValues = {
    ...basePreset,
    ...existingFormData,
  } as SimulationParams;

  const simulationParams = useMemo(
    () => formDataToSimulationParams(defaultValues),
    [],
  );

  const rentTotal =
    simulationParams.rentPerWeek * 52 +
    simulationParams.rentMovingCostsFirstYear;
  const buyTotal =
    simulationParams.ongoingBuyerCostsFirstYear +
    simulationParams.buyMovingCostsFirstYear;

  const rentCheaper = rentTotal < buyTotal;
  const savings = Math.abs(buyTotal - rentTotal);
  const weeklySavings = savings / 52;

  const cheaperLabel = rentCheaper ? "Renting" : "Buying";
  const CheaperIcon = rentCheaper ? Wallet : Shield;

  return (
    <div className="flex flex-col items-center justify-center text-center space-y-16 py-12 animate-fade-in">
      <div className="space-y-6 max-w-3xl">
        <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full border border-foreground/10 bg-foreground/5 text-sm font-medium text-foreground/80 backdrop-blur-md">
          <TrendingDown size={14} className="mr-2 text-foreground/60" />
          Year 1 Cost Comparison
        </div>
        <h1 className="gradient-title text-4xl md:text-6xl">Side by Side</h1>
        <p className="text-xl md:text-2xl text-foreground/60 leading-relaxed font-light">
          Comparing total year-one expenses for renting vs. buying the same
          home.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl px-4">
        {/* Rent total */}
        <div
          className={`relative rounded-[2.5rem] border p-10 shadow-2xl backdrop-blur-md transition-all duration-300 ${rentCheaper ? "border-green-500/40 bg-green-500/10 ring-1 ring-green-500/30 scale-[1.02]" : "border-foreground/10 bg-foreground/5"}`}
        >
          {rentCheaper && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-green-500 text-white text-sm font-semibold shadow-lg whitespace-nowrap">
              Lower expenses
            </div>
          )}
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-green-500/20 rounded-full text-green-600 dark:text-green-400 ring-1 ring-green-500/30">
              <Wallet size={32} />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Renting</h2>
            <div className="text-4xl font-extrabold text-foreground tracking-tight">
              {formatMoney(rentTotal)}
              <span className="text-lg text-foreground/50 font-medium">
                {" "}
                / yr
              </span>
            </div>
            <p className="text-sm text-foreground/50">
              {formatMoney(rentTotal / 52)} per week
            </p>
          </div>
        </div>

        {/* Buy total */}
        <div
          className={`relative rounded-[2.5rem] border p-10 shadow-2xl backdrop-blur-md transition-all duration-300 ${!rentCheaper ? "border-blue-500/40 bg-blue-500/10 ring-1 ring-blue-500/30 scale-[1.02]" : "border-foreground/10 bg-foreground/5"}`}
        >
          {!rentCheaper && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-blue-500 text-white text-sm font-semibold shadow-lg whitespace-nowrap">
              Lower expenses
            </div>
          )}
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-blue-500/20 rounded-full text-blue-600 dark:text-blue-400 ring-1 ring-blue-500/30">
              <Shield size={32} />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Buying</h2>
            <div className="text-4xl font-extrabold text-foreground tracking-tight">
              {formatMoney(buyTotal)}
              <span className="text-lg text-foreground/50 font-medium">
                {" "}
                / yr
              </span>
            </div>
            <p className="text-sm text-foreground/50">
              {formatMoney(buyTotal / 52)} per week
            </p>
          </div>
        </div>
      </div>

      {/* Savings callout */}
      <div
        className={`w-full max-w-2xl rounded-[2.5rem] border border-foreground/10 bg-gradient-to-r ${rentCheaper ? "from-green-500/20 to-blue-500/20" : "from-blue-500/20 to-green-500/20"} p-10 shadow-2xl backdrop-blur-md flex flex-col items-center space-y-3`}
      >
        <div className="flex items-center gap-3 text-foreground/60 text-sm font-medium uppercase tracking-widest">
          <CheaperIcon size={16} />
          {cheaperLabel} saves
        </div>
        <div className="text-5xl font-extrabold text-foreground tracking-tight">
          {formatMoney(savings)}
          <span className="text-xl text-foreground/50 font-medium"> / yr</span>
        </div>
        <p className="text-foreground/40 text-base">
          That's{" "}
          <span className="text-foreground/70 font-semibold">
            {formatMoney(weeklySavings)} per week
          </span>{" "}
          in lower expenses
        </p>
      </div>
    </div>
  );
}

function StepFinalSummary() {
  const existingFormData = parseLocalStorage("formData") ?? {};
  const defaultValues = {
    ...basePreset,
    ...existingFormData,
  } as SimulationParams;

  const simulationParams = useMemo(
    () => formDataToSimulationParams(defaultValues),
    [],
  );

  const simulationResult = useMemo(
    () => simulate(simulationParams, [BuyCase, RentCase]),
    [simulationParams],
  );

  const rentCase = simulationResult.cases.rent!;
  const buyCase = simulationResult.cases.buy!;
  const { breakdownInfo } = simulationResult;

  const year1RentBreakdown = rentCase.breakdownByYear[1];
  const year1BuyBreakdown = buyCase.breakdownByYear[1];

  const getTotalGains = (breakdown: Record<string, number>) =>
    Object.entries(breakdown)
      .filter(([key, value]) => !!breakdownInfo[key]?.asset && value > 0)
      .reduce((sum, [, value]) => sum + value, 0);

  const getTotalLosses = (breakdown: Record<string, number>) =>
    Math.abs(
      Object.entries(breakdown)
        .filter(([key, value]) => !breakdownInfo[key]?.asset && value < 0)
        .reduce((sum, [, value]) => sum + value, 0),
    );

  const rentGainsYear1 = getTotalGains(year1RentBreakdown);
  const rentLossesYear1 = getTotalLosses(year1RentBreakdown);
  const rentNetYear1 = rentGainsYear1 - rentLossesYear1;

  const buyGainsYear1 = getTotalGains(year1BuyBreakdown);
  const buyLossesYear1 = getTotalLosses(year1BuyBreakdown);
  const buyNetYear1 = buyGainsYear1 - buyLossesYear1;

  function sumAllAssets(assets: Partial<Record<string, number>>): number {
    return (
      Object.values(assets).reduce((sum, val) => (sum ?? 0) + (val ?? 0), 0) ??
      0
    );
  }

  function yearArrayToMonths(series: number[]): number[] {
    return series.flatMap((val) => Array.from({ length: 12 }, () => val));
  }

  const seriesBuy = yearArrayToMonths(buyCase.assetsByYear.map(sumAllAssets));
  const seriesRent = yearArrayToMonths(rentCase.assetsByYear.map(sumAllAssets));

  const rentNetPositive = rentNetYear1 >= 0;
  const buyNetPositive = buyNetYear1 >= 0;

  return (
    <div className="flex flex-col items-center justify-center text-center space-y-16 py-12 animate-fade-in">
      <div className="space-y-6 max-w-3xl">
        <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full border border-foreground/10 bg-foreground/5 text-sm font-medium text-foreground/80 backdrop-blur-md">
          <TrendingDown size={14} className="mr-2 text-foreground/60" />
          Final Summary
        </div>
        <h1 className="gradient-title text-4xl md:text-6xl">
          The Full Picture
        </h1>
        <p className="text-xl md:text-2xl text-foreground/60 leading-relaxed font-light">
          Gains minus losses for year one — and how net worth evolves over time.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl px-4">
        {/* Renter year 1 summary */}
        <div className="relative rounded-[2.5rem] border border-foreground/10 bg-foreground/5 p-10 shadow-2xl backdrop-blur-md">
          <div className="flex flex-col items-center space-y-6">
            <div className="p-4 bg-green-500/20 rounded-full text-green-600 dark:text-green-400 ring-1 ring-green-500/30">
              <Wallet size={32} />
            </div>
            <h2 className="text-2xl font-bold text-foreground">
              Renter — Year 1
            </h2>
            <div className="w-full space-y-2 text-sm text-left">
              <div className="flex justify-between items-center text-foreground/70">
                <span>Gains</span>
                <span className="font-medium text-green-600 dark:text-green-400">
                  +{formatMoney(rentGainsYear1)}
                </span>
              </div>
              <div className="flex justify-between items-center text-foreground/70">
                <span>Losses</span>
                <span className="font-medium text-red-600 dark:text-red-400">
                  -{formatMoney(rentLossesYear1)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-foreground/10 font-semibold text-foreground/90">
                <span>Net</span>
                <span
                  className={
                    rentNetPositive
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }
                >
                  {rentNetPositive ? "+" : ""}
                  {formatMoney(rentNetYear1)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Buyer year 1 summary */}
        <div className="relative rounded-[2.5rem] border border-foreground/10 bg-foreground/5 p-10 shadow-2xl backdrop-blur-md">
          <div className="flex flex-col items-center space-y-6">
            <div className="p-4 bg-blue-500/20 rounded-full text-blue-600 dark:text-blue-400 ring-1 ring-blue-500/30">
              <Shield size={32} />
            </div>
            <h2 className="text-2xl font-bold text-foreground">
              Buyer — Year 1
            </h2>
            <div className="w-full space-y-2 text-sm text-left">
              <div className="flex justify-between items-center text-foreground/70">
                <span>Gains</span>
                <span className="font-medium text-green-600 dark:text-green-400">
                  +{formatMoney(buyGainsYear1)}
                </span>
              </div>
              <div className="flex justify-between items-center text-foreground/70">
                <span>Losses</span>
                <span className="font-medium text-red-600 dark:text-red-400">
                  -{formatMoney(buyLossesYear1)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-foreground/10 font-semibold text-foreground/90">
                <span>Net</span>
                <span
                  className={
                    buyNetPositive
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }
                >
                  {buyNetPositive ? "+" : ""}
                  {formatMoney(buyNetYear1)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Net worth chart */}
      <div className="w-full max-w-4xl px-4">
        <div className="rounded-[2.5rem] border border-foreground/10 bg-foreground/5 backdrop-blur-md p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
            Net Worth Over Time
          </h2>
          <div className="h-80 w-full">
            <ChartNetWorth seriesBuy={seriesBuy} seriesRent={seriesRent} />
          </div>
        </div>
      </div>
    </div>
  );
}
