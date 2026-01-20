import _ from "lodash";
import { ChevronDown, ChevronRight, InfoIcon } from "lucide-react";
import { Pencil } from "lucide-react";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

import {
  type EnrichedSimulationParams,
  type SimulationParams,
  getEnrichedSimulationParams,
} from "@/calculation/EnrichedSimulationParams.tsx";
import { MAX_MOVING_YEARS } from "@/calculation/cases/gain-loss/BuyMovingCost";
import {
  BooleanField,
  FormContext,
  MoneyField,
  NumberField,
  PercentField,
} from "@/components/Forms.tsx";
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
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field.tsx";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { type PropertyPreset } from "@/propertyPresets.tsx";
import { formatMoney } from "@/utils/formatMoney.ts";
import { InvestmentOptions } from "@/utils/investmentOptions.ts";
import {
  parseLocalStorage,
  writeToLocalStorage,
} from "@/utils/localStorage.tsx";
import { MortgageStressOptions } from "@/utils/mortgageStressOptions.ts";
import { PropertyGrowthRateOptions } from "@/utils/propertyGrowthRateOptions.ts";

import {
  CalculationFieldsContextProvider,
  DepositPercentField,
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
                  <NumberField
                    name={"numYears"}
                    label={"Years to simulate"}
                    min={1}
                    max={60}
                    suffix={"years"}
                  />
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
                      <MoneyField
                        name={"propertyPrice"}
                        label={"Property Price"}
                        min={10_000}
                        max={3_000_000}
                        step={5000}
                      />
                      <DepositPercentField />
                      <BooleanField
                        name={"isFirstHomeBuyer"}
                        label={"First home buyer?"}
                      />
                      <MoneyField
                        name={"stampDuty"}
                        label={"Stamp duty"}
                        value={simulationParams.stampDuty}
                        disabled
                      />
                      <MoneyField
                        name={"lmi"}
                        label={"Lenders Mortgage Insurance"}
                        value={simulationParams.lmi}
                        disabled
                      />
                      <MoneyField
                        name={"legalFees"}
                        label={"Legal Fees"}
                        max={10_000}
                        step={100}
                      />
                      <MoneyField
                        name={"pestAndBuildingInspection"}
                        label={"Pest & Building inspection"}
                        max={2000}
                        step={100}
                      />
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
                      <PercentField
                        name={"interestRatePercent"}
                        label={"Loan interest rate"}
                        description={`Monthly payment: ${formatMoney(simulationParams.monthlyMortgagePayment)} (${formatMoney(
                          simulationParams.monthlyMortgagePayment * 12,
                        )} / year)`}
                        step={0.1}
                        min={0.1}
                        max={20}
                      />
                      <NumberField
                        name={"loanTermYears"}
                        label={"Loan term"}
                        step={1}
                        min={1}
                        max={50}
                        suffix={"years"}
                      />
                      <NumberField
                        name={"maintenanceCostPercent"}
                        label={"Maintenance cost"}
                        step={0.1}
                        min={0}
                        max={5}
                        suffix={"% of property value"}
                        description={`${formatMoney(
                          (simulationParams.maintenanceCostPercent / 100) *
                            simulationParams.propertyPrice,
                        )} per year`}
                      />
                      <MoneyField
                        name={"strataPerYear"}
                        label={"Strata"}
                        max={15000}
                        step={100}
                        suffix={"per year"}
                      />
                      <MoneyField
                        name={"councilRatesPerYear"}
                        label={"Council rates"}
                        max={15000}
                        step={100}
                        suffix={"per year"}
                      />
                      <MoneyField
                        name={"insurancePerYear"}
                        label={"Insurance"}
                        max={15000}
                        step={100}
                        suffix={"per year"}
                      />
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
                      <NumberField
                        name={"buyMoveYearsBetween"}
                        label={"Years between moves"}
                        min={1}
                        step={0.5}
                        max={MAX_MOVING_YEARS}
                        displayValue={(value) =>
                          simulationParams.buyMoveYearsBetween <
                          MAX_MOVING_YEARS
                            ? `${value}`
                            : ""
                        }
                        prefix={
                          simulationParams.buyMoveYearsBetween <
                          MAX_MOVING_YEARS
                            ? ""
                            : "Never move"
                        }
                        suffix={
                          simulationParams.buyMoveYearsBetween <
                          MAX_MOVING_YEARS
                            ? "years"
                            : ""
                        }
                      />
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
                            <MoneyField
                              name={"nextPropertyPrice"}
                              label={"Next property price"}
                              value={simulationParams.nextPropertyPrice}
                              disabled
                            />
                            <MoneyField
                              name={"nextPropertyStampDuty"}
                              label={"Next property stamp duty"}
                              value={simulationParams.nextPropertyStampDuty}
                              disabled
                            />
                            <MoneyField
                              name={"legalFees"}
                              label={"Legal Fees"}
                              max={10_000}
                              step={100}
                            />
                            <PercentField
                              name="agentFeePercent"
                              label={"Agent fees"}
                              step={0.1}
                              min={0}
                              max={5}
                              suffix={"% of sale price"}
                              description={`Fees: ${formatMoney(
                                (simulationParams.agentFeePercent / 100) *
                                  simulationParams.nextPropertyPrice,
                              )}`}
                            />
                            <MoneyField
                              name={"buyMoveRemovalists"}
                              label={"Movers"}
                              max={5_000}
                              step={100}
                            />
                            <MoneyField
                              name={"pestAndBuildingInspection"}
                              label={"Pest & Building inspection"}
                              max={3_000}
                              step={100}
                            />
                            <MoneyField
                              name={"buyMoveOtherCosts"}
                              label={"Other moving costs"}
                              step={100}
                              showSlider={false}
                            />
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
                  <MoneyField
                    name={"rentPerWeek"}
                    label={"Rent"}
                    max={3_000}
                    step={10}
                    suffix={"per week"}
                  />
                  <PercentField
                    name={"rentIncreasePercent"}
                    label={"Rent increase per year"}
                    max={10}
                    step={0.1}
                  />
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
                        <NumberField
                          name={"rentMoveYearsBetween"}
                          label={"Years between moves"}
                          max={10}
                          min={1}
                          step={0.5}
                          suffix={"years"}
                        />

                        <Details>
                          <Summary>
                            Cost per move
                            <SummaryRightText>
                              {formatMoney(simulationParams.rentCostPerMove)}
                            </SummaryRightText>
                          </Summary>
                          <DetailsContent>
                            <FieldGroup>
                              <MoneyField
                                name={"rentMoveRemovalists"}
                                label={"Movers"}
                                max={5_000}
                                step={100}
                              />
                              <MoneyField
                                name={"rentMoveCleaning"}
                                label={"Cleaning"}
                                max={1000}
                                step={10}
                              />
                              <NumberField
                                name={"rentMoveOverlapWeeks"}
                                label={"Rent overlap weeks"}
                                max={4}
                                step={1}
                                suffix={"week(s)"}
                                description={`Overlap rent: ${formatMoney(simulationParams.rentMoveOverlapWeeks * simulationParams.rentPerWeek)}`}
                              />
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
                  <Field>
                    <FieldLabel>Property growth rate</FieldLabel>
                    <Select
                      name={"propertyGrowthRateOption"}
                      value={formData.propertyGrowthRateOption}
                      onValueChange={(value: string) => {
                        value === "custom"
                          ? setFormData({
                              ...formData,
                              // TODO: Fix type issue
                              propertyGrowthRateOption: value,
                            })
                          : setFormData({
                              ...formData,
                              // TODO: Fix type issue
                              // @ts-ignore
                              propertyGrowthRateOption: value,
                              propertyGrowthPercent:
                                // @ts-ignore
                                PropertyGrowthRateOptions[value].returnPercent,
                            });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>

                      <SelectContent>
                        {_(PropertyGrowthRateOptions)
                          .map("group")
                          .uniq()
                          .map((currentGroupKey) => (
                            <SelectGroup>
                              <SelectLabel>{currentGroupKey}</SelectLabel>
                              {_(PropertyGrowthRateOptions)
                                .entries()
                                .filter(
                                  ([_, { group }]) => group === currentGroupKey,
                                )
                                .map(
                                  // {Object.entries(group.options).map(
                                  ([key, value]) => (
                                    <SelectItem value={key}>
                                      {value.label}
                                    </SelectItem>
                                  ),
                                )
                                .value()}
                            </SelectGroup>
                          ))
                          .value()}
                      </SelectContent>
                    </Select>
                    {formData.propertyGrowthRateOption === "custom" ? (
                      <PercentField
                        name={"propertyGrowthPercent"}
                        label={""}
                        hideLabel={true}
                        max={20}
                        step={0.1}
                        suffix={"% per year"}
                      />
                    ) : (
                      <FieldDescription>
                        {
                          PropertyGrowthRateOptions[
                            formData.propertyGrowthRateOption
                          ].returnPercent
                        }
                        % per year on average.{" "}
                        <a
                          target={"_blank"}
                          href={
                            PropertyGrowthRateOptions[
                              formData.propertyGrowthRateOption
                            ].sourceUrl
                          }
                        >
                          Source
                        </a>
                      </FieldDescription>
                    )}
                  </Field>
                  <Field>
                    <FieldLabel>Investment return</FieldLabel>
                    <Select
                      name={"investmentReturnOption"}
                      value={formData.investmentReturnOption}
                      onValueChange={(value: string) => {
                        value === "custom"
                          ? setFormData({
                              ...formData,
                              // TODO: Fix type issue
                              investmentReturnOption: value,
                            })
                          : setFormData({
                              ...formData,
                              // TODO: Fix type issue
                              // @ts-ignore
                              investmentReturnOption: value,
                              investmentGrowthPercent:
                                // @ts-ignore
                                InvestmentOptions[value].returnPercent,
                            });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {Object.entries(InvestmentOptions).map(
                            ([key, value]) => (
                              <SelectItem value={key}>{value.label}</SelectItem>
                            ),
                          )}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {formData.investmentReturnOption === "custom" ? (
                      <PercentField
                        name={"investmentGrowthPercent"}
                        label={""}
                        hideLabel={true}
                        max={20}
                        step={0.1}
                        suffix={"% per year"}
                      />
                    ) : (
                      <FieldDescription>
                        {
                          InvestmentOptions[formData.investmentReturnOption]
                            .returnPercent
                        }
                        % per year on average.{" "}
                        <a
                          target={"_blank"}
                          href={
                            InvestmentOptions[formData.investmentReturnOption]
                              .sourceUrl
                          }
                        >
                          Source
                        </a>
                      </FieldDescription>
                    )}
                  </Field>
                  <Field>
                    <FieldLabel>Investment sell-off</FieldLabel>
                    <Select
                      name={"investmentSellOffOption"}
                      value={formData.investmentSellOffOption}
                      onValueChange={(value: string) =>
                        setFormData({
                          ...formData,
                          // TODO: Fix type issue
                          // @ts-ignore
                          investmentSellOffOption: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="doNotSell">
                            Don't sell investments
                          </SelectItem>
                          <SelectItem value="sellInFinalYear">
                            Sell lump-sum in final year
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FieldDescription>
                      {formData.investmentSellOffOption === "sellInFinalYear" &&
                        "Sell all investments at the end and pay the resulting capital gains tax"}
                    </FieldDescription>
                  </Field>
                </FieldGroup>
              </DetailsContent>
            </Details>
            <Details>
              <Summary>Income</Summary>
              <DetailsContent>
                <FieldGroup>
                  <div className="flex gap-2 rounded-xl bg-blue-400/30 p-4 text-sm text-muted-foreground">
                    <InfoIcon size={32} className="-mt-1" /> Let's see how much
                    income you need to support the mortgage
                  </div>
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
                        <MoneyField
                          name={"propertyPrice"}
                          label={"Property price"}
                          min={10_000}
                          max={3_000_000}
                          step={5000}
                        />
                        <PercentField
                          name={"depositPercent"}
                          label={"Deposit"}
                          description={`Deposit: ${formatMoney(
                            (simulationParams.depositPercent / 100) *
                              simulationParams.propertyPrice,
                          )}`}
                        />
                        <NumberField
                          name={"loanTermYears"}
                          label={"Loan term"}
                          step={1}
                          min={1}
                          max={50}
                          suffix={"years"}
                        />
                        <PercentField
                          name={"interestRatePercent"}
                          label={"Interest rate"}
                          step={0.1}
                          min={0.1}
                          max={20}
                        />
                      </FieldGroup>
                    </DetailsContent>
                  </Details>
                  <Field>
                    <FieldLabel>Mortgage stress</FieldLabel>
                    <Select
                      name={"mortgageStressOption"}
                      value={formData.mortgageStressOption}
                      onValueChange={(value: string) =>
                        setFormData({
                          ...formData,
                          // TODO: Fix type issue
                          // @ts-ignore
                          mortgageStressOption: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {Object.entries(MortgageStressOptions).map(
                            ([key, value]) => (
                              <SelectItem value={key}>{value.label}</SelectItem>
                            ),
                          )}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FieldDescription>
                      {
                        MortgageStressOptions[formData.mortgageStressOption]
                          .percentage
                      }
                      % of post-tax income spent on mortgage.
                    </FieldDescription>
                  </Field>
                  <MoneyField
                    name={"requiredAnnualPostTaxIncome"}
                    label={"Required annual income (post-tax)"}
                    value={simulationParams.requiredAnnualPostTaxIncome}
                    disabled
                  />
                  <Field>
                    <FieldLabel>Number of income earners</FieldLabel>
                    <Select
                      name={"numIncomeEarners"}
                      value={formData.numIncomeEarners}
                      onValueChange={(value: "single" | "dual") =>
                        setFormData({
                          ...formData,
                          numIncomeEarners: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="single">Single income</SelectItem>
                          <SelectItem value="dual">Dual income</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                  <MoneyField
                    name={"requiredAnnualPreTaxIncome"}
                    label={"Required annual income (pre-tax)"}
                    value={
                      formData.numIncomeEarners === "dual"
                        ? simulationParams.requiredAnnualPreTaxIncome / 2
                        : simulationParams.requiredAnnualPreTaxIncome
                    }
                    disabled
                    suffix={
                      formData.numIncomeEarners === "dual" ? "per person" : ""
                    }
                    description={
                      "Estimated 2024-2025 taxable income including 2% Medicare levy."
                    }
                  />
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
