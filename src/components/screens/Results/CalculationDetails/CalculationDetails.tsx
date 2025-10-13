import { twMerge } from "tailwind-merge";
import {
  type ChangeEvent,
  type HTMLProps,
  type MouseEvent,
  type ToggleEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  type EnrichedSimulationParams,
  getEnrichedSimulationParams,
  type SimulationParams,
} from "@/calculation/EnrichedSimulationParams.ts";
import { formPresets } from "@/components/screens/Results/formPresets.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Label } from "@/components/ui/label.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Switch } from "@/components/ui/switch.tsx";
import { type PropertyPreset } from "@/propertyPresets.tsx";
import _ from "lodash";
import { Slider } from "@/components/ui/slider.tsx";

function Field(props: HTMLProps<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={twMerge(
        "flex flex-col gap-2 not-last:mb-8 first:mt-4",
        props.className,
      )}
    ></div>
  );
}

function formDataToSimulationParams(formData: {
  [key: string]: FormDataEntryValue;
}): SimulationParams {
  return {
    numYears: Number(formData.numYears),
    propertyPrice: Number(formData.propertyPrice),
    depositPercent: Number(formData.depositPercent),
    isFirstHomeBuyer: formData.isFirstHomeBuyer === "on",
    legalFees: Number(formData.legalFees),
    pestBuildingInspection: Number(formData.pestBuildingInspection), // TODO: Add to simulation/calculation
    interestRatePercent: Number(formData.interestRatePercent),
    loanTermYears: Number(formData.loanTermYears),
    maintenanceCostPercent: Number(formData.maintenanceCostPercent),
    strataPerYear: Number(formData.strataPerYear),
    councilRatesPerYear: Number(formData.councilRatesPerYear),
    insurancePerYear: Number(formData.insurancePerYear),
    stampDuty: Number(formData.stampDuty),
    agentFeePercent: Number(formData.agentFeePercent),
    buyMoveYearsBetween: Number(formData.buyMoveYearsBetween),
    buyMoveRemovalists: Number(formData.buyMoveRemovalists),
    buyMoveOtherCosts: Number(formData.buyMoveOtherCosts), // TODO: Add to calculation
    rentPerWeek: Number(formData.rentPerWeek),
    rentIncreasePercentage: Number(formData.rentIncreasePercentage),
    rentMoveYearsBetween: Number(formData.rentMoveYearsBetween),
    rentMoveRemovalists: Number(formData.rentMoveRemovalists),
    rentMoveCleaning: Number(formData.rentMoveCleaning),
    rentMoveOverlapWeeks: Number(formData.rentMoveOverlapWeeks),
    propertyGrowth: Number(formData.propertyGrowth),
    investmentGrowthPercentage: Number(formData.investmentGrowthPercentage),

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
  };
}

type CalculationDetailsProps = {
  propertyPreset: PropertyPreset;
  onSimulationParamsChanged: (params: EnrichedSimulationParams) => void;
};

export function CalculationDetails({
  propertyPreset,
  onSimulationParamsChanged,
}: CalculationDetailsProps) {
  const defaultValues = { ...formPresets.apartment, ...propertyPreset };

  const [isTopDetailsOpen, setIsTopDetailsOpen] = useState(false);
  const [isExpandAll, setIsExpandAll] = useState(true);
  const [simulationParams, setSimulationParams] = useState<
    EnrichedSimulationParams | undefined
  >(undefined);

  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    recalculateDerivedValues();
  }, []);

  function recalculateDerivedValues() {
    if (!formRef.current) return;

    const data = Object.fromEntries(new FormData(formRef.current));

    const simulationParams = formDataToSimulationParams(data);
    const enrichedSimulationParams =
      getEnrichedSimulationParams(simulationParams);

    // setStampDuty(enrichedSimulationParams.stampDuty);
    setSimulationParams(enrichedSimulationParams);
    onSimulationParamsChanged(enrichedSimulationParams!);
  }

  function onChange(e: ChangeEvent<HTMLFormElement>) {
    e.preventDefault();
    recalculateDerivedValues();
  }

  function onTopDetailsToggled(e: ToggleEvent<HTMLDetailsElement>) {
    if (e.target !== e.currentTarget) return;
    if (e.newState == "open") {
      setIsTopDetailsOpen(true);
    } else {
      setIsTopDetailsOpen(false);
    }
  }

  function toggleExpandCollapseAll(e: MouseEvent) {
    if (!formRef.current) return;

    const topDetailsElement = formRef.current.querySelector("details");

    topDetailsElement?.querySelectorAll("details").forEach((detailsElement) => {
      detailsElement.open = isExpandAll;
    });

    setIsExpandAll(!isExpandAll);
  }

  return (
    <form onChange={onChange} ref={formRef}>
      <TopLevelDetails onToggle={(e) => onTopDetailsToggled(e)}>
        <Summary>
          Calculation Details
          {isTopDetailsOpen && (
            <Button
              type={"button"}
              variant={"link"}
              className={"float-end -my-1.5 p-2"}
              onClick={toggleExpandCollapseAll}
            >
              {isExpandAll ? "Expand all" : "Collapse all"}
            </Button>
          )}
        </Summary>
        <DetailsContent>
          <Details>
            <Summary>General</Summary>
            <DetailsContent>
              <Field>
                <Label>Type of property</Label>
                <Select
                  // TODO: Use value directly
                  defaultValue={defaultValues.propertyType}
                >
                  <SelectTrigger>
                    <SelectValue></SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {/* TODO: Use a .map() to fill this out */}
                    <SelectItem value={"house"}>House</SelectItem>
                    <SelectItem value={"unit"}>Unit</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <Label>Years to simulate</Label>
                <Input
                  name="numYears"
                  type={"number"}
                  defaultValue={defaultValues.numYears}
                  min={0}
                  max={1000}
                />
              </Field>
            </DetailsContent>
          </Details>
          <Details>
            <Summary>Buying costs</Summary>
            <DetailsContent>
              <Details>
                <Summary>
                  Purchase costs
                  <small className={"float-end -my-1.5 p-2"}>$TODO</small>
                </Summary>
                <DetailsContent>
                  <Field>
                    <Label>Property price ($)</Label>
                    <Input
                      name="propertyPrice"
                      type={"number"}
                      defaultValue={defaultValues.propertyPrice}
                      step={5000}
                      min={0}
                    />
                    <Slider defaultValue={[33]} max={4_000_000} step={5000} />
                  </Field>
                  <Field>
                    <Label>Deposit (%)</Label>
                    <Input
                      name="depositPercent"
                      type={"number"}
                      defaultValue={defaultValues.depositPercent}
                      step={1}
                      min={0}
                      max={100}
                    />
                    <small>Deposit: $TODO</small>
                  </Field>

                  <Field className={"flex-row"}>
                    <Label>First home buyer?</Label>
                    <Switch name={"isFirstHomeBuyer"} />
                  </Field>
                  <Field>
                    <Label>Stamp duty ($)</Label>
                    <Input
                      name="stampDuty"
                      type={"number"}
                      disabled
                      readOnly
                      value={simulationParams?.stampDuty}
                    />
                  </Field>
                  <Field>
                    <Label>Lenders Mortgage Insurance ($)</Label>
                    <Input
                      name="lmi"
                      type={"number"}
                      disabled
                      readOnly
                      value={simulationParams?.lmi}
                    />
                  </Field>
                  <Field>
                    <Label>Legal fees ($)</Label>
                    <Input
                      name="legalFees"
                      type={"number"}
                      defaultValue={defaultValues.legalFees}
                      step={100}
                      min={0}
                    />
                  </Field>
                  <Field>
                    <Label>Pest & Building inspection ($)</Label>
                    <Input
                      name="pestBuildingInspection"
                      defaultValue={defaultValues.pestBuildingInspection}
                      type={"number"}
                      step={100}
                      min={0}
                    />
                  </Field>
                  <p>Total purchase cost: $TODO</p>
                </DetailsContent>
              </Details>
              <Details>
                <Summary>
                  Ongoing costs
                  <small className={"float-end -my-1.5 p-2"}>
                    $TODO / year
                  </small>
                </Summary>
                <DetailsContent>
                  <Field>
                    <Label>Loan interest rate (%)</Label>
                    <Input
                      name="interestRatePercent"
                      type={"number"}
                      defaultValue={defaultValues.interestRatePercent}
                      step={0.1}
                      min={0}
                      max={100}
                    />
                  </Field>
                  <Field>
                    <Label>Loan term (years)</Label>
                    <Input
                      name="loanTermYears"
                      type={"number"}
                      defaultValue={defaultValues.loanTermYears}
                      step={1}
                      min={1}
                    />
                    <small>Monthly payment: $TODO</small>
                  </Field>
                  <Field>
                    <Label>Maintenance cost (% of property value)</Label>
                    <Input
                      name="maintenanceCostPercent"
                      type={"number"}
                      defaultValue={defaultValues.maintenanceCostPercent}
                      step={0.1}
                      min={0}
                      max={100}
                    />
                    <small>$TODO per year</small>
                  </Field>
                  <Field>
                    <Label>Strata ($/year)</Label>
                    <Input
                      name="strataPerYear"
                      type={"number"}
                      defaultValue={defaultValues.strataPerYear}
                      step={100}
                      min={0}
                    />
                  </Field>
                  <Field>
                    <Label>Council rates ($/year)</Label>
                    <Input
                      name="councilRatesPerYear"
                      type={"number"}
                      defaultValue={defaultValues.councilRatesPerYear}
                      step={100}
                      min={0}
                    />
                  </Field>
                  <Field>
                    <Label>Insurance ($/year)</Label>
                    <Input
                      name="insurancePerYear"
                      type={"number"}
                      defaultValue={defaultValues.insurancePerYear}
                      step={100}
                      min={0}
                    />
                  </Field>
                  <p>Total ongoing costs: $TODO / year</p>
                </DetailsContent>
              </Details>
              <Details>
                <Summary>
                  Moving costs
                  <small className={"float-end -my-1.5 p-2"}>
                    $TODO / year
                  </small>
                </Summary>
                <DetailsContent>
                  <Field>
                    <Label>Years between moves</Label>
                    <Input
                      name="buyMoveYearsBetween"
                      type={"number"}
                      defaultValue={defaultValues.buyMoveYearsBetween}
                      min={1}
                      max={100}
                    />
                  </Field>
                  <Details>
                    <Summary>
                      Cost per move
                      <small className={"float-end -my-1.5 p-2"}>$TODO</small>
                    </Summary>
                    <DetailsContent>
                      <Field>
                        <Label>Stamp duty ($)</Label>
                        <Input
                          name="stampDuty"
                          type={"number"}
                          disabled
                          readOnly
                          value={simulationParams?.stampDuty}
                        />
                      </Field>
                      <Field>
                        <Label>Legal fees ($)</Label>
                        {/* TODO: Keep in sync with the other legal fees field */}
                        <Input
                          type={"number"}
                          disabled
                          readOnly
                          value={simulationParams?.legalFees}
                          step={100}
                          min={0}
                        />
                      </Field>
                      <Field>
                        <Label>Agent fee (% of sale price)</Label>
                        <Input
                          name="agentFeePercent"
                          type={"number"}
                          defaultValue={defaultValues.agentFeePercent}
                          step={0.1}
                          min={0}
                        />
                      </Field>
                      <Field>
                        <Label>Movers ($)</Label>
                        <Input
                          name="buyMoveRemovalists"
                          type={"number"}
                          defaultValue={defaultValues.buyMoveRemovalists}
                          step={100}
                          min={0}
                        />
                      </Field>
                      <Field>
                        <Label>Pest & Building inspection ($)</Label>
                        <Input
                          disabled
                          readOnly
                          value={simulationParams?.pestBuildingInspection}
                          type={"number"}
                          step={100}
                          min={0}
                        />
                      </Field>
                      <Field>
                        <Label>Other moving costs ($)</Label>
                        {/* TODO: Add hints about temporary residence */}
                        <Input
                          name="buyMoveOtherCosts"
                          defaultValue={defaultValues.buyMoveOtherCosts}
                          type={"number"}
                          step={100}
                          min={0}
                        />
                      </Field>
                    </DetailsContent>
                  </Details>
                </DetailsContent>
              </Details>
            </DetailsContent>
          </Details>
          <Details>
            <Summary>Renting costs</Summary>
            <DetailsContent>
              <Field>
                <Label>Rent per week</Label>
                <Input
                  name="rentPerWeek"
                  defaultValue={defaultValues.rentPerWeek}
                  type={"number"}
                  min={0}
                />
              </Field>
              <Field>
                <Label>Rent increase per year (%)</Label>
                <Input
                  name="rentIncreasePercentage"
                  defaultValue={defaultValues.rentIncreasePercentage}
                  type={"number"}
                  step={0.1}
                  min={0}
                />
              </Field>
              <Details>
                <Summary>
                  Moving costs
                  <small className={"float-end -my-1.5 p-2"}>
                    $TODO / year
                  </small>
                </Summary>
                <DetailsContent>
                  <Field>
                    <Label>Years between moves</Label>
                    <Input
                      name="rentMoveYearsBetween"
                      type={"number"}
                      defaultValue={defaultValues.rentMoveYearsBetween}
                      min={1}
                      max={100}
                    />
                  </Field>
                  <Details>
                    <Summary>
                      Cost per move
                      <small className={"float-end -my-1.5 p-2"}>$TODO</small>
                    </Summary>
                    <DetailsContent>
                      <Field>
                        <Label>Movers ($)</Label>
                        <Input
                          name="rentMoveRemovalists"
                          type={"number"}
                          step={100}
                          min={0}
                          defaultValue={defaultValues.rentMoveRemovalists}
                        />
                      </Field>
                      <Field>
                        <Label>Cleaning ($)</Label>
                        {/* TODO: Keep in sync with the other legal fees field */}
                        <Input
                          name="rentMoveCleaning"
                          type={"number"}
                          defaultValue={defaultValues.rentMoveCleaning}
                          step={100}
                          min={0}
                        />
                      </Field>
                      <Field>
                        <Label>Rent overlap weeks</Label>
                        <Input
                          name="rentMoveOverlapWeeks"
                          type={"number"}
                          defaultValue={defaultValues.rentMoveOverlapWeeks}
                          step={1}
                          min={0}
                        />
                      </Field>
                    </DetailsContent>
                  </Details>
                </DetailsContent>
              </Details>
            </DetailsContent>
          </Details>
          <Details>
            <Summary>Investment returns</Summary>
            <DetailsContent>
              <Field>
                <Label>Property growth per year (%)</Label>
                <Input
                  name="propertyGrowth"
                  type={"number"}
                  defaultValue={defaultValues.propertyGrowth}
                  step={0.01}
                  min={0}
                />
              </Field>
              <Field>
                <Label>Investment return per year (%)</Label>
                <Input
                  name="investmentGrowthPercentage"
                  type={"number"}
                  defaultValue={defaultValues.investmentGrowthPercentage}
                  step={0.01}
                  min={0}
                />
              </Field>
            </DetailsContent>
          </Details>
        </DetailsContent>
      </TopLevelDetails>
    </form>
  );
}

function Summary(props: React.HTMLProps<HTMLDivElement>) {
  return (
    <summary>
      <span className={"cursor-pointer pl-2"}>{props.children}</span>
    </summary>
  );
}

function TopLevelDetails(
  props: React.DetailsHTMLAttributes<HTMLDetailsElement>,
) {
  return (
    <AnimatedDetails
      {...props}
      className={twMerge(props.className, "border border-x-0 px-4 py-2")}
      // Keep it "open" when developing
      // open
    />
  );
}

function Details(props: React.DetailsHTMLAttributes<HTMLDetailsElement>) {
  return (
    <AnimatedDetails
      {...props}
      className={twMerge(
        props.className,
        "mt-2 rounded-2xl border bg-background px-4 py-2 not-last:mb-4",
      )}
      // Keep it "open" when developing
      // open
    />
  );
}

function AnimatedDetails(
  props: React.DetailsHTMLAttributes<HTMLDetailsElement>,
) {
  return (
    <details
      {...props}
      className={twMerge(
        props.className,
        "overflow-hidden details-content:h-0 details-content:transition-all details-content:transition-discrete details-content:duration-300 open:details-content:h-auto",
      )}
    />
  );
}

function DetailsContent(props: React.HTMLProps<HTMLDivElement>) {
  return <div className={"mx-1 my-2"}>{props.children}</div>;
  // return <div>{props.children}</div>;
}
