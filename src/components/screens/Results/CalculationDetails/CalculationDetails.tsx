import { twMerge } from "tailwind-merge";
import { useEffect, useRef, useState } from "react";
import {
  type EnrichedSimulationParams,
  getEnrichedSimulationParams,
  type SimulationParams,
} from "@/calculation/EnrichedSimulationParams.tsx";
import { formPresets } from "@/components/screens/Results/formPresets.tsx";
import { Button } from "@/components/ui/button.tsx";
import { type PropertyPreset } from "@/propertyPresets.tsx";
import { formatMoney } from "@/utils/formatMoney.ts";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field.tsx";
import {
  BooleanField,
  FormContext,
  MoneyField,
  NumberField,
  PercentField,
} from "@/components/Forms.tsx";
import {
  parseLocalStorage,
  writeToLocalStorage,
} from "@/utils/localStorage.tsx";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { AnimatedDetails } from "@/components/AnimatedDetails.tsx";

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

type CalculationDetailsProps = {
  propertyPreset: PropertyPreset;
  onSimulationParamsChanged: (params: EnrichedSimulationParams) => void;
};

type FormData = SimulationParams;

export function CalculationDetails({
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

  function setFormData(newFormData: FormData) {
    const existingFormData = parseLocalStorage("formData") ?? {};
    writeToLocalStorage("formData", { ...existingFormData, ...newFormData });
    setFormDataRaw(newFormData);
  }

  const [isExpandAll, setIsExpandAll] = useState(true);
  const [simulationParams, setSimulationParams] =
    useState<EnrichedSimulationParams>(formDataToSimulationParams(formData));

  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(
    function recalculateDerivedValues() {
      const simulationParams = formDataToSimulationParams(formData);
      setSimulationParams(simulationParams);
      onSimulationParamsChanged(simulationParams);
    },
    [formData],
  );

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
        <div className={"px-4 py-2"}>
          <div>
            <span className={"md:pl-15"}>Calculation Details</span>
            {
              <Button
                type={"button"}
                variant={"link"}
                className={"float-end -my-1.5 p-2"}
                onClick={toggleExpandCollapseAll}
              >
                {isExpandAll ? "Expand all" : "Collapse all"}
              </Button>
            }
          </div>
          <DetailsContent>
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
                    <small className={"float-end -my-1.5 p-2"}>
                      {formatMoney(simulationParams.initialInvestment || 0)}
                    </small>
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
                      <PercentField
                        name={"depositPercent"}
                        label={"Deposit"}
                        description={`Deposit: ${formatMoney(
                          (simulationParams.depositPercent / 100) *
                            simulationParams.propertyPrice,
                        )}`}
                      />
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
                    <small className={"float-end -my-1.5 p-2"}>
                      {formatMoney(simulationParams.ongoingBuyerCostsFirstYear)}{" "}
                      / year
                    </small>
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
                    <small className={"float-end -my-1.5 p-2"}>
                      {formatMoney(simulationParams.buyMovingCostsFirstYear)} /
                      year
                    </small>
                  </Summary>
                  <DetailsContent>
                    <FieldGroup>
                      <NumberField
                        name={"buyMoveYearsBetween"}
                        label={"Years between moves"}
                        min={1}
                        step={0.5}
                        max={30}
                        suffix={"years"}
                      />
                      <Details>
                        <Summary>
                          Cost per move
                          <small className={"float-end -my-1.5 p-2"}>
                            {formatMoney(simulationParams.buyCostPerMove)}
                          </small>
                        </Summary>
                        <DetailsContent>
                          <FieldGroup>
                            <MoneyField
                              name={"stampDuty"}
                              label={"Stamp duty"}
                              value={simulationParams.stampDuty}
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
                                  simulationParams.propertyPrice,
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
                      <small className={"float-end -my-1.5 p-2"}>
                        {formatMoney(simulationParams.rentMovingCostsFirstYear)}{" "}
                        / year
                      </small>
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
                            <small className={"float-end -my-1.5 p-2"}>
                              {" "}
                              {formatMoney(simulationParams.rentCostPerMove)}
                            </small>
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
                  <PercentField
                    name={"propertyGrowthPercent"}
                    label={"Property growth per year"}
                    max={20}
                    step={0.1}
                    helpLink={
                      "https://web.archive.org/web/20221018140637/https://www.corelogic.com.au/__data/assets/pdf_file/0015/12237/220829_CoreLogic_Pulse_30years_Finalv2.pdf"
                    }
                  />
                  <PercentField
                    name={"investmentGrowthPercent"}
                    label={"Investment return per year"}
                    max={20}
                    step={0.1}
                    helpLink={"https://dqydj.com/sp-500-return-calculator/"}
                  />
                  <Field>
                    <FieldLabel>Investment sell-off</FieldLabel>
                    <Select
                      name={"investmentSellOffOption"}
                      value={formData.investmentSellOffOption}
                      onValueChange={(value: string) =>
                        setFormData({
                          ...formData,
                          // TODO: Fix type issue
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
                    {
                      <FieldDescription>
                        {formData.investmentSellOffOption ===
                          "sellInFinalYear" &&
                          "Sell all investments at the end and pay the resulting capital gains tax"}
                      </FieldDescription>
                    }
                  </Field>
                </FieldGroup>
              </DetailsContent>
            </Details>
          </DetailsContent>
        </div>
      </FormContext>
    </form>
  );
}

function Summary(props: React.HTMLProps<HTMLDivElement>) {
  return (
    <summary className={"cursor-pointer"}>
      <span className={"pl-2"}>{props.children}</span>
    </summary>
  );
}

function Details(props: React.DetailsHTMLAttributes<HTMLDetailsElement>) {
  return (
    <AnimatedDetails
      {...props}
      className={twMerge(
        props.className,
        "mt-2 rounded-2xl border px-4 py-2 not-last:mb-4 dark:bg-white/5",
      )}
      // Keep it "open" when developing
      // open
    />
  );
}

function DetailsContent(props: React.HTMLProps<HTMLDivElement>) {
  return <div className={"mx-1 my-6"}>{props.children}</div>;
}
