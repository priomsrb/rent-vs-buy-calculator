import { twMerge } from "tailwind-merge";
import {
  type ChangeEvent,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  type EnrichedSimulationParams,
  getEnrichedSimulationParams,
  type SimulationParams,
} from "@/calculation/EnrichedSimulationParams.tsx";
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
import { Slider } from "@/components/ui/slider.tsx";
import { formatMoney } from "@/utils/formatMoney.ts";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field.tsx";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group.tsx";

function formDataToSimulationParams(formData: {
  [key: string]: FormDataEntryValue;
}): SimulationParams {
  return {
    numYears: Number(formData.numYears),
    propertyPrice: Number(formData.propertyPrice),
    depositPercent: Number(formData.depositPercent),
    isFirstHomeBuyer: formData.isFirstHomeBuyer === "on",
    legalFees: Number(formData.legalFees),
    pestAndBuildingInspection: Number(formData.pestAndBuildingInspection), // TODO: Add to simulation/calc_summary for upfront cost
    interestRatePercent: Number(formData.interestRatePercent),
    loanTermYears: Number(formData.loanTermYears),
    maintenanceCostPercent: Number(formData.maintenanceCostPercent),
    strataPerYear: Number(formData.strataPerYear),
    councilRatesPerYear: Number(formData.councilRatesPerYear),
    insurancePerYear: Number(formData.insurancePerYear),
    agentFeePercent: Number(formData.agentFeePercent),
    buyMoveYearsBetween: Number(formData.buyMoveYearsBetween) || 1,
    buyMoveRemovalists: Number(formData.buyMoveRemovalists),
    buyMoveOtherCosts: Number(formData.buyMoveOtherCosts),
    rentPerWeek: Number(formData.rentPerWeek),
    rentIncreasePercentage: Number(formData.rentIncreasePercentage),
    rentMoveYearsBetween: Number(formData.rentMoveYearsBetween) || 1,
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
  const [formData, setFormData] = useState({ ...defaultValues });

  const [isExpandAll, setIsExpandAll] = useState(true);
  const [simulationParams, setSimulationParams] =
    // TODO: Fix this type issue
    useState<EnrichedSimulationParams>({});

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

  function toggleExpandCollapseAll() {
    if (!formRef.current) return;

    formRef.current?.querySelectorAll("details").forEach((detailsElement) => {
      detailsElement.open = isExpandAll;
    });

    setIsExpandAll(!isExpandAll);
  }

  return (
    <form onChange={onChange} ref={formRef}>
      <FormContext value={{ formData, setFormData }}>
        <div className={"px-4 py-2"}>
          <div>
            Calculation Details
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
                        max={4_000_000}
                        step={5000}
                      />
                      <PercentageField
                        name={"depositPercent"}
                        label={"Deposit"}
                        description={`Deposit: ${formatMoney(
                          (simulationParams.depositPercent / 100) *
                            simulationParams.propertyPrice,
                        )}`}
                      />
                      <Field orientation={"horizontal"}>
                        <Label>First home buyer?</Label>
                        <Switch name={"isFirstHomeBuyer"} />
                      </Field>
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
                      <p>
                        Total purchase cost:{" "}
                        {formatMoney(simulationParams.initialInvestment || 0)}
                      </p>
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
                        <small>
                          Monthly payment:{" "}
                          {formatMoney(simulationParams.monthlyMortgagePayment)}{" "}
                          (
                          {formatMoney(
                            simulationParams.monthlyMortgagePayment * 12,
                          )}{" "}
                          / year)
                        </small>
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
                        <small>
                          {formatMoney(
                            (simulationParams.maintenanceCostPercent / 100) *
                              simulationParams.propertyPrice,
                          )}{" "}
                          per year
                        </small>
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
                      <p>
                        Total ongoing costs:{" "}
                        {formatMoney(
                          simulationParams.ongoingBuyerCostsFirstYear,
                        )}{" "}
                        / year
                      </p>
                    </FieldGroup>
                  </DetailsContent>
                </Details>
                <Details>
                  <Summary>
                    Moving costs
                    <small className={"float-end -my-1.5 p-2"}>
                      {formatMoney(simulationParams.buyMovingCostsFirstYear)}
                    </small>
                  </Summary>
                  <DetailsContent>
                    <FieldGroup>
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
                          <small className={"float-end -my-1.5 p-2"}>
                            {formatMoney(simulationParams.buyCostPerMove)}
                          </small>
                        </Summary>
                        <DetailsContent>
                          <FieldGroup>
                            <Field>
                              <Label>Stamp duty ($)</Label>
                              <Input
                                name="stampDuty"
                                type={"number"}
                                disabled
                                readOnly
                                value={simulationParams.stampDuty}
                              />
                            </Field>
                            <Field>
                              <Label>Legal fees ($)</Label>
                              {/* TODO: Keep in sync with the other legal fees field */}
                              <Input
                                type={"number"}
                                disabled
                                readOnly
                                value={simulationParams.legalFees}
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
                                // TODO: Make this editable
                                readOnly
                                value={
                                  simulationParams.pestAndBuildingInspection
                                }
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
                        {formatMoney(simulationParams.rentMovingCostsFirstYear)}{" "}
                        / year
                      </small>
                    </Summary>
                    <DetailsContent>
                      <FieldGroup>
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
                            <small className={"float-end -my-1.5 p-2"}>
                              {" "}
                              {formatMoney(simulationParams.rentCostPerMove)}
                            </small>
                          </Summary>
                          <DetailsContent>
                            <FieldGroup>
                              <Field>
                                <Label>Movers ($)</Label>
                                <Input
                                  name="rentMoveRemovalists"
                                  type={"number"}
                                  step={100}
                                  min={0}
                                  defaultValue={
                                    defaultValues.rentMoveRemovalists
                                  }
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
                                  defaultValue={
                                    defaultValues.rentMoveOverlapWeeks
                                  }
                                  step={1}
                                  min={0}
                                />
                              </Field>
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
    <summary>
      <span className={"cursor-pointer pl-2"}>{props.children}</span>
    </summary>
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
      open
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

type FormContextType = {
  // TODO Add proper types
  formData: any;
  setFormData: (formData: any) => void;
};
const FormContext = createContext<FormContextType>({});

type CalculationFieldProps = {
  name: string;
  label: string;
  description?: string;
  min?: number;
  max?: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  disabled?: boolean;
  value?: number;
};
function CalculationField({
  name,
  label,
  description,
  min = 0,
  max = 100,
  step = 1,
  prefix,
  suffix,
  disabled,
  value,
}: CalculationFieldProps) {
  const { formData, setFormData } = useContext(FormContext);
  return (
    <Field>
      <FieldLabel>{label}</FieldLabel>
      <InputGroup>
        <InputGroupInput
          name={name}
          type={"number"}
          value={value !== undefined ? value : formData[name]}
          onChange={(e) =>
            setFormData({
              ...formData,
              [name]: Number(e.target.value),
            })
          }
          min={min}
          max={max}
          step={step}
          disabled={disabled}
        />
        {prefix && <InputGroupAddon>{prefix}</InputGroupAddon>}
        {suffix && (
          <InputGroupAddon align={"inline-end"}>{suffix}</InputGroupAddon>
        )}
      </InputGroup>
      {!disabled && (
        <Slider
          value={[formData[name]]}
          onValueChange={([value]) =>
            setFormData({
              ...formData,
              [name]: value,
            })
          }
          min={min}
          max={max}
          step={step}
        />
      )}
      {description && <FieldDescription>{description}</FieldDescription>}
    </Field>
  );
}

function MoneyField(props: CalculationFieldProps) {
  return <CalculationField prefix={"$"} {...props} />;
}

function PercentageField(props: CalculationFieldProps) {
  return <CalculationField suffix={"%"} {...props} />;
}
