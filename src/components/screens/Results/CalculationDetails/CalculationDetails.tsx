import _ from "lodash";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Pencil } from "lucide-react";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

import {
  type EnrichedSimulationParams,
  type SimulationParams,
  getEnrichedSimulationParams,
} from "@/calculation/EnrichedSimulationParams.tsx";
import { MAX_MOVING_YEARS } from "@/calculation/cases/gain-loss/BuyMovingCost";
import { FormContext } from "@/components/Forms.tsx";
import { formPresets } from "@/components/screens/Results/formPresets.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer.tsx";
import { FieldGroup } from "@/components/ui/field.tsx";
import { type PropertyPreset } from "@/propertyPresets.tsx";
import { formatMoney } from "@/utils/formatMoney.ts";
import {
  parseLocalStorage,
  writeToLocalStorage,
} from "@/utils/localStorage.tsx";

import {
  AgentFeesField,
  BuyMoveInspectionField,
  BuyMoveOtherCostsField,
  BuyMoveYearsBetweenField,
  CalculationFieldsContextProvider,
  CouncilRatesField,
  DepositPercentField,
  IncomeSectionMessage,
  InsuranceField,
  InterestRateField,
  InvestmentReturnField,
  InvestmentSellOffField,
  IsFirstHomeBuyerField,
  LegalFeesField,
  LendersMortgageInsuranceField,
  LoanTermField,
  MaintenanceCostField,
  MortgageStressField,
  MoversField,
  NextPropertyPriceField,
  NextPropertyStampDutyField,
  NumIncomeEarnersField,
  NumYearsField,
  PestAndBuildingInspectionField,
  PropertyGrowthRateField,
  PropertyPriceField,
  RentField,
  RentIncreaseField,
  RentMoveCleaningField,
  RentMoveOverlapWeeksField,
  RentMoveRemovalistsField,
  RentMoveYearsBetweenField,
  RequiredAnnualPostTaxIncomeField,
  RequiredAnnualPreTaxIncomeField,
  StampDutyField,
  StrataField,
} from "./fields.tsx";

function formDataToSimulationParams(
  formData: FormData,
): EnrichedSimulationParams {
  return getEnrichedSimulationParams({
    ...formData,

    includeStampDuty: true,
    includeLMI: true,
    includeLegalFees: true,
    includeCouncil: true,
    includeStrata: true,
    includeMaintenance: true,
    includeInsurance: true,
    includeAgentFee: true,
    includeSellingFixed: true,
    includeInvestSurplus: true,
    includeInvestReturns: true,
    includePropertyGrowth: true,
    includeRentGrowth: true,
    includeRenterInitialCapital: true,
    includeMovingCosts: true,
    movingCostType: "averaged",
  });
}

export type CalculationDetailsProps = {
  propertyPreset: PropertyPreset;
  onSimulationParamsChanged: (params: EnrichedSimulationParams) => void;
};

type FormData = SimulationParams;

export const CalculationDetails = memo(function CalculationDetails({
  propertyPreset,
  onSimulationParamsChanged,
}: CalculationDetailsProps) {
  let formPreset;
  if (propertyPreset.propertyType === "unit") {
    formPreset = formPresets.apartment;
  } else if (propertyPreset.propertyType === "house") {
    formPreset = formPresets.house;
  }
  const existingFormData = parseLocalStorage("formData") ?? {};
  const defaultValues = {
    ...formPreset,
    ...propertyPreset,
    ...existingFormData,
  };
  const [formData, setFormDataRaw] = useState<FormData>({
    ...defaultValues,
  });

  const updateSimulationParams = useCallback((newFormData: FormData) => {
    const simulationParams = formDataToSimulationParams(newFormData);
    setSimulationParams(simulationParams);
    onSimulationParamsChanged(simulationParams);
  }, []);

  useEffect(() => updateSimulationParams(formData), []);

  const setFormData = useCallback(
    (newFormData: FormData | ((previousFormData: FormData) => FormData)) => {
      setFormDataRaw((currentFormData) => {
        let updatedFormData;
        if (typeof newFormData === "function") {
          updatedFormData = newFormData(currentFormData);
        } else {
          updatedFormData = newFormData;
        }

        // Include existing localStorage data in case the the form on this page doesn't contain all the fields
        const existingFormData = parseLocalStorage("formData") ?? {};
        writeToLocalStorage("formData", {
          ...existingFormData,
          ...updatedFormData,
        });
        updateSimulationParams(updatedFormData);

        return updatedFormData;
      });
    },
    [updateSimulationParams],
  );

  const [isExpandAll, setIsExpandAll] = useState(true);
  const [simulationParams, setSimulationParams] =
    useState<EnrichedSimulationParams>(formDataToSimulationParams(formData));

  const formRef = useRef<HTMLFormElement | null>(null);

  function toggleExpandCollapseAll() {
    if (!formRef.current) return;

    formRef.current?.querySelectorAll("details").forEach((detailsElement) => {
      detailsElement.open = isExpandAll;
    });

    setIsExpandAll(!isExpandAll);
  }

  return (
    <form ref={formRef}>
      <FormContext value={{ formData, setFormData }}>
        <CalculationFieldsContextProvider simulationParams={simulationParams}>
          <div className={"px-4 py-2"}>
            <div>
              <h1>Calculation Details</h1>
              {
                // TODO: Make collapse all/expand all work
                <Button
                  type={"button"}
                  variant={"link"}
                  // TODO: Unhide when this works
                  className={"float-end -my-1.5 hidden p-2"}
                  onClick={toggleExpandCollapseAll}
                >
                  {isExpandAll ? "Expand all" : "Collapse all"}
                </Button>
              }
            </div>
            <Details>
              <Summary>General</Summary>
              <DetailsContent>
                <FieldGroup>
                  <NumYearsField />
                </FieldGroup>
              </DetailsContent>
            </Details>
            <Details>
              <Summary>Buying costs</Summary>
              <DetailsContent>
                <Details>
                  <Summary>
                    Purchase costs
                    <SummaryRightText>
                      {formatMoney(simulationParams.initialInvestment || 0)}
                    </SummaryRightText>
                  </Summary>
                  <DetailsContent>
                    <FieldGroup>
                      <PropertyPriceField />
                      <DepositPercentField />
                      <IsFirstHomeBuyerField />
                      <StampDutyField />
                      <LendersMortgageInsuranceField />
                      <LegalFeesField />
                      <PestAndBuildingInspectionField />
                    </FieldGroup>
                  </DetailsContent>
                </Details>
                <Details>
                  <Summary>
                    Ongoing costs
                    <SummaryRightText>
                      {formatMoney(simulationParams.ongoingBuyerCostsFirstYear)}{" "}
                      / year
                    </SummaryRightText>
                  </Summary>
                  <DetailsContent>
                    <FieldGroup>
                      <InterestRateField />
                      <LoanTermField />
                      <MaintenanceCostField />
                      <StrataField />
                      <CouncilRatesField />
                      <InsuranceField />
                    </FieldGroup>
                  </DetailsContent>
                </Details>
                <Details>
                  <Summary>
                    Moving costs
                    <SummaryRightText>
                      {simulationParams.buyMoveYearsBetween < MAX_MOVING_YEARS
                        ? `${formatMoney(simulationParams.buyMovingCostsFirstYear)} / year`
                        : "None"}
                    </SummaryRightText>
                  </Summary>
                  <DetailsContent>
                    <FieldGroup>
                      <BuyMoveYearsBetweenField />
                      <Details>
                        <Summary>
                          Cost per move
                          <SummaryRightText>
                            {simulationParams.buyMoveYearsBetween <
                            MAX_MOVING_YEARS
                              ? formatMoney(simulationParams.buyCostPerMove)
                              : "N/A"}
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
              </DetailsContent>
            </Details>
            <Details>
              <Summary>Renting costs</Summary>
              <DetailsContent>
                <FieldGroup>
                  <RentField />
                  <RentIncreaseField />
                  <Details>
                    <Summary>
                      Moving costs
                      <SummaryRightText>
                        {formatMoney(simulationParams.rentMovingCostsFirstYear)}{" "}
                        / year
                      </SummaryRightText>
                    </Summary>
                    <DetailsContent>
                      <FieldGroup>
                        <RentMoveYearsBetweenField />

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
                      </FieldGroup>
                    </DetailsContent>
                  </Details>
                </FieldGroup>
              </DetailsContent>
            </Details>
            <Details>
              <Summary>Investment returns</Summary>
              <DetailsContent>
                <FieldGroup>
                  <PropertyGrowthRateField />
                  <InvestmentReturnField />
                  <InvestmentSellOffField />
                </FieldGroup>
              </DetailsContent>
            </Details>
            <Details>
              <Summary>Income</Summary>
              <DetailsContent>
                <FieldGroup>
                  <IncomeSectionMessage />
                  <Details>
                    <Summary>
                      Mortgage payment
                      <SummaryRightText>
                        {formatMoney(
                          Math.round(simulationParams.monthlyMortgagePayment),
                        )}{" "}
                        / month
                      </SummaryRightText>
                    </Summary>
                    <DetailsContent>
                      <FieldGroup>
                        <PropertyPriceField />
                        <DepositPercentField />
                        <LoanTermField />
                        <InterestRateField />
                      </FieldGroup>
                    </DetailsContent>
                  </Details>
                  <MortgageStressField />
                  <RequiredAnnualPostTaxIncomeField />
                  <NumIncomeEarnersField />
                  <RequiredAnnualPreTaxIncomeField />
                </FieldGroup>
              </DetailsContent>
            </Details>
          </div>
        </CalculationFieldsContextProvider>
      </FormContext>
      <div className="mt-5"></div>
    </form>
  );
});

const Summary = memo((props: React.HTMLProps<HTMLDivElement>) => {
  // TODO: Find a more elegant solution for changing the chevron
  // Try to animate the chevron as well
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

const Details = memo((props: Parameters<typeof Collapsible>[0]) => {
  return (
    <Collapsible
      {...props}
      className={twMerge(
        props.className,
        "mt-2 rounded-2xl border px-4 py-2 not-last:mb-4 dark:bg-white/5",
      )}
      // Keep it "open" when developing
      // open
    >
      {props.children}
    </Collapsible>
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

export function CalculationDetailsDrawer({
  propertyPreset,
  onSimulationParamsChanged,
}: CalculationDetailsProps) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 shadow-lg md:hidden"
          size="lg"
        >
          <Pencil className="mr-2 h-4 w-4" />
          Edit calculation
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader>
          <DrawerTitle>Calculation Details</DrawerTitle>
        </DrawerHeader>
        <div className="overflow-y-auto px-4 pb-8">
          <CalculationDetails
            propertyPreset={propertyPreset}
            onSimulationParamsChanged={onSimulationParamsChanged}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
