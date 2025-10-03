import { Link } from "@tanstack/react-router";
import { Button } from "../../ui/button.tsx";
import { type PropertyPreset, propertyPresets } from "@/propertyPresets.tsx";
import { Bath, Bed, Building, House, MapPin } from "lucide-react";
import type { PropertyType } from "@/types.tsx";
import fakeGraph from "@/assets/fake_graph.png";
import { twMerge } from "tailwind-merge";
import { Input } from "@/components/ui/input.tsx";
import {
  type ChangeEvent,
  type MouseEvent,
  type FormEvent,
  type FormEventHandler,
  type ToggleEvent,
  type HTMLProps,
  useEffect,
  useRef,
  useState,
} from "react";
import { Switch } from "@/components/ui/switch.tsx";
import { Label } from "@/components/ui/label.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { formPresets } from "@/components/screens/Results/formPresets.tsx";
import {
  type EnrichedSimulationParams,
  getEnrichedSimulationParams,
  type SimulationParams,
} from "@/calculation/EnrichedSimulationParams.ts";

type ResultsScreenProps = {
  presetId: string;
};

function PropertyImage(props: { preset: PropertyPreset }) {
  return (
    <img
      src={props.preset.image}
      className="h-50 w-96 bg-background object-cover"
      style={{
        viewTransitionName: `${props.preset.id}Image`,
        // @ts-ignore viewTransitionClass not added to react's types yet
        viewTransitionClass: "vertically-align",
      }}
    />
  );
}

function BackButton(props: { preset: PropertyPreset }) {
  return (
    <div className="z-10 p-8">
      <Link
        to={"/start/$propertyType"}
        params={{ propertyType: props.preset.propertyType }}
        viewTransition={true}
      >
        {" "}
        <Button>← Choose another {props.preset.propertyType}</Button>
      </Link>
    </div>
  );
}

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
    propertyPrice: Number(formData.propertyPrice),
    depositPercent: Number(formData.depositPercent),
    isFirstHomeBuyerUpfront: formData.isFirstHomeBuyer === "on",
    legalFees: Number(formData.legalFees),
    pestBuildingInspection: Number(formData.pestBuildingInspection), // TODO: Add to simulation/calculation
    interestRate: Number(formData.interestRatePercent),
    loanTermYears: Number(formData.loanTermYears),
    maintenancePercent: Number(formData.maintenanceCostPercent),
    strata: Number(formData.strataPerYear),
    councilRates: Number(formData.councilRatesPerYear),
    insurance: Number(formData.insurancePerYear),
    buyMoveYearsBetween: Number(formData.buyYearsBetweenMoves),
    stampDuty: Number(formData.stampDuty),
    agentFeePercent: Number(formData.agentFeePercent),
    buyMoveRemovalists: Number(formData.buyMoveRemovalists),
    sellingFixed: Number(formData.buyMoveOtherCosts),
    rentPerWeek: Number(formData.rentPerWeek),
    rentGrowth: Number(formData.rentIncreasePerYear),
    rentYearsBetweenMoves: Number(formData.rentYearsBetweenMoves),
    rentMoveRemovalists: Number(formData.rentMoveRemovalists),
    rentMoveCleaning: Number(formData.rentMoveCleaning),
    rentMoveOverlapWeeks: Number(formData.rentMoveOverlapWeeks),
    propertyGrowth: Number(formData.propertyGrowth),
    investReturn: Number(formData.investReturn),

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
    movingCostType: "averaged", // Convert to a an `include` prefix
  };
}

function CalculationDetails() {
  const defaultValues = formPresets.apartment;

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
  }

  function onChange(e: ChangeEvent<HTMLFormElement>) {
    e.preventDefault();
    recalculateDerivedValues();
  }

  function onTopDetailsToggled(e: ToggleEvent<HTMLDetailsElement>) {
    if (e.target !== e.currentTarget) return;
    console.log(e);
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
      <Details className={"m-3"} onToggle={(e) => onTopDetailsToggled(e)}>
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
                  defaultValue={defaultValues.horizonYears}
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
                      value={simulationParams?.stampDuty}
                    />
                  </Field>
                  <Field>
                    <Label>Lenders Mortgage Insurance ($)</Label>
                    <Input
                      name="lmi"
                      type={"number"}
                      disabled
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
                      defaultValue={defaultValues.interestRate}
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
                      defaultValue={defaultValues.maintenancePercent}
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
                      defaultValue={defaultValues.strata}
                      step={100}
                      min={0}
                    />
                  </Field>
                  <Field>
                    <Label>Council rates ($/year)</Label>
                    <Input
                      name="councilRatesPerYear"
                      type={"number"}
                      defaultValue={defaultValues.councilRates}
                      step={100}
                      min={0}
                    />
                  </Field>
                  <Field>
                    <Label>Insurance ($/year)</Label>
                    <Input
                      name="insurancePerYear"
                      type={"number"}
                      defaultValue={defaultValues.insurance}
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
                      name="buyYearsBetweenMoves"
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
                          value={simulationParams?.stampDuty}
                        />
                      </Field>
                      <Field>
                        <Label>Legal fees ($)</Label>
                        {/* TODO: Keep in sync with the other legal fees field */}
                        <Input
                          name="legalFees"
                          type={"number"}
                          defaultValue={defaultValues.legalFees}
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
                          name="pestBuildingInspection"
                          // TODO: Keep in sync with duplicate field?
                          defaultValue={defaultValues.pestBuildingInspection}
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
                          defaultValue={defaultValues.sellingFixed}
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
                  name="rentIncreasePerYear"
                  defaultValue={defaultValues.rentGrowth}
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
                      name="rentYearsBetweenMoves"
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
                          value={defaultValues.rentMoveRemovalists}
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
                  name="investmentGrowth"
                  type={"number"}
                  defaultValue={defaultValues.investReturn}
                  step={0.01}
                  min={0}
                />
              </Field>
            </DetailsContent>
          </Details>
        </DetailsContent>
      </Details>
    </form>
  );
}

export function ResultsScreen({ presetId }: ResultsScreenProps) {
  const preset = propertyPresets.find((preset) => preset.id === presetId);
  if (!preset) {
    // TODO: Handle missing preset
    return "Invalid property preset";
  }
  return (
    <>
      <BackButton preset={preset} />
      {/*<PropertyImage preset={preset} />*/}
      {/*<PropertyInfo preset={preset} />*/}
      {/*<p>Renting comes out $1.5m ahead after 30 years</p>*/}
      {/*<img src={fakeGraph} />*/}
      {/*<img src={fakeBreakdown} />*/}
      <CalculationDetails />
    </>
  );
}

function Summary(props: React.HTMLProps<HTMLDivElement>) {
  return (
    <summary>
      <span className={"pl-2"}>{props.children}</span>
    </summary>
  );
}

function Details(props: React.DetailsHTMLAttributes<HTMLDetailsElement>) {
  return (
    <details
      {...props}
      className={twMerge(
        props.className,
        "mt-2 mb-4 rounded-2xl border px-4 py-2",
      )}
      // Keep it "open" when developing
      open
    />
  );
}

function DetailsContent(props: React.HTMLProps<HTMLDivElement>) {
  return <div className={"mx-1 my-2"}>{props.children}</div>;
  // return <div>{props.children}</div>;
}

function PropertyInfo(props: { preset: PropertyPreset }) {
  return (
    <div className="flex flex-1 flex-col items-start p-4">
      {/* TODO: Format money. e.g. $1.5m or $600k */}
      <p>
        <MapPin className="inline-block" /> {props.preset.locationDescription}
      </p>
      <p className="flex gap-2">
        <span className="flex gap-1">
          <Bed />
          {props.preset.bedrooms}
        </span>
        ·
        <span className="flex gap-1">
          <Bath />
          {props.preset.bathrooms}
        </span>
        ·
        <span className="flex gap-1">
          {getIconForPropertyType(props.preset.propertyType)}
          {getNameForPropertyType(props.preset.propertyType)}
        </span>
      </p>
      <p>Buy: ${props.preset.buyPrice}</p>
      <p>Rent: ${props.preset.rentPerWeek} / week</p>
    </div>
  );
}

function getNameForPropertyType(propertyType: PropertyType) {
  switch (propertyType) {
    case "house":
      return "House";
    case "unit":
      return "Apartment";
    default:
      return propertyType;
  }
}

function getIconForPropertyType(propertyType: PropertyType) {
  switch (propertyType) {
    case "house":
      return <House />;
    case "unit":
      return <Building />;
    default:
      return <House />;
  }
}
