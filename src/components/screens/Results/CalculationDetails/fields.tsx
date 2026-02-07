import _ from "lodash";
import { InfoIcon } from "lucide-react";
import { createContext, useContext } from "react";

import type { EnrichedSimulationParams } from "@/calculation/EnrichedSimulationParams";
import { MAX_MOVING_YEARS } from "@/calculation/cases/gain-loss/BuyMovingCost";
// TODO: Don't use test constants here
import { emptySimulationParams } from "@/calculation/cases/gain-loss/testConstants";
import {
  BooleanField,
  FormContext,
  MoneyField,
  NumberField,
  PercentField,
} from "@/components/Forms";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field.tsx";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { formatMoney } from "@/utils/formatMoney";
import { InvestmentOptions } from "@/utils/investmentOptions.ts";
import { MortgageStressOptions } from "@/utils/mortgageStressOptions.ts";
import { PropertyGrowthRateOptions } from "@/utils/propertyGrowthRateOptions.ts";

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

export const NumYearsField = () => (
  <NumberField
    name={"numYears"}
    label={"Years to simulate"}
    min={1}
    max={60}
    suffix={"years"}
  />
);

export const PropertyPriceField = () => (
  <MoneyField
    name={"propertyPrice"}
    label={"Property Price"}
    min={10_000}
    max={3_000_000}
    step={5000}
  />
);

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

export const IsFirstHomeBuyerField = () => (
  <BooleanField name={"isFirstHomeBuyer"} label={"First home buyer?"} />
);

export const StampDutyField = () => {
  const { simulationParams } = useContext(CalculationFieldsContext);
  return (
    <MoneyField
      name={"stampDuty"}
      label={"Stamp duty"}
      value={simulationParams.stampDuty}
      disabled
    />
  );
};

export const LendersMortgageInsuranceField = () => {
  const { simulationParams } = useContext(CalculationFieldsContext);
  return (
    <MoneyField
      name={"lmi"}
      label={"Lenders Mortgage Insurance"}
      value={simulationParams.lmi}
      disabled
    />
  );
};

export const LegalFeesField = () => (
  <MoneyField name={"legalFees"} label={"Legal Fees"} max={10_000} step={100} />
);

export const PestAndBuildingInspectionField = () => (
  <MoneyField
    name={"pestAndBuildingInspection"}
    label={"Pest & Building inspection"}
    max={2000}
    step={100}
  />
);

export const InterestRateField = () => {
  const { simulationParams } = useContext(CalculationFieldsContext);
  return (
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
  );
};

export const LoanTermField = () => (
  <NumberField
    name={"loanTermYears"}
    label={"Loan term"}
    step={1}
    min={1}
    max={50}
    suffix={"years"}
  />
);

export const MaintenanceCostField = () => {
  const { simulationParams } = useContext(CalculationFieldsContext);
  return (
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
  );
};

export const StrataField = () => (
  <MoneyField
    name={"strataPerYear"}
    label={"Strata"}
    max={15000}
    step={100}
    suffix={"per year"}
  />
);

export const CouncilRatesField = () => (
  <MoneyField
    name={"councilRatesPerYear"}
    label={"Council rates"}
    max={15000}
    step={100}
    suffix={"per year"}
  />
);

export const InsuranceField = () => (
  <MoneyField
    name={"insurancePerYear"}
    label={"Insurance"}
    max={15000}
    step={100}
    suffix={"per year"}
  />
);

export const BuyMoveYearsBetweenField = () => {
  return (
    <NumberField
      name={"buyMoveYearsBetween"}
      label={"Years between moves"}
      min={1}
      step={0.5}
      max={MAX_MOVING_YEARS}
      displayValue={(value) => (value < MAX_MOVING_YEARS ? `${value}` : "")}
      prefix={(value) => (value < MAX_MOVING_YEARS ? "" : "Never move")}
      suffix={(value) => (value < MAX_MOVING_YEARS ? "years" : "")}
    />
  );
};

export const NextPropertyPriceField = () => {
  const { simulationParams } = useContext(CalculationFieldsContext);
  return (
    <MoneyField
      name={"nextPropertyPrice"}
      label={"Next property price"}
      value={simulationParams.nextPropertyPrice}
      disabled
    />
  );
};

export const NextPropertyStampDutyField = () => {
  const { simulationParams } = useContext(CalculationFieldsContext);
  return (
    <MoneyField
      name={"nextPropertyStampDuty"}
      label={"Next property stamp duty"}
      value={simulationParams.nextPropertyStampDuty}
      disabled
    />
  );
};

export const AgentFeesField = () => {
  const { simulationParams } = useContext(CalculationFieldsContext);
  return (
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
  );
};

export const MoversField = () => (
  <MoneyField
    name={"buyMoveRemovalists"}
    label={"Movers"}
    max={5_000}
    step={100}
  />
);

export const BuyMoveInspectionField = () => (
  <MoneyField
    name={"pestAndBuildingInspection"}
    label={"Pest & Building inspection"}
    max={3_000}
    step={100}
  />
);

export const BuyMoveOtherCostsField = () => (
  <MoneyField
    name={"buyMoveOtherCosts"}
    label={"Other moving costs"}
    step={100}
    showSlider={false}
  />
);

export const RentField = () => (
  <MoneyField
    name={"rentPerWeek"}
    label={"Rent"}
    max={3_000}
    step={10}
    suffix={"per week"}
  />
);

export const RentIncreaseField = () => (
  <PercentField
    name={"rentIncreasePercent"}
    label={"Rent increase per year"}
    max={10}
    step={0.1}
  />
);

export const RentMoveYearsBetweenField = () => (
  <NumberField
    name={"rentMoveYearsBetween"}
    label={"Years between moves"}
    max={10}
    min={1}
    step={0.5}
    suffix={"years"}
  />
);

export const RentMoveRemovalistsField = () => (
  <MoneyField
    name={"rentMoveRemovalists"}
    label={"Movers"}
    max={5_000}
    step={100}
  />
);

export const RentMoveCleaningField = () => (
  <MoneyField
    name={"rentMoveCleaning"}
    label={"Cleaning"}
    max={1000}
    step={10}
  />
);

export const RentMoveOverlapWeeksField = () => {
  const { simulationParams } = useContext(CalculationFieldsContext);
  return (
    <NumberField
      name={"rentMoveOverlapWeeks"}
      label={"Rent overlap weeks"}
      max={4}
      step={1}
      suffix={"week(s)"}
      description={`Overlap rent: ${formatMoney(simulationParams.rentMoveOverlapWeeks * simulationParams.rentPerWeek)}`}
    />
  );
};

export const PropertyGrowthRateField = () => {
  const { formData, setFormData } = useContext(FormContext);

  const option =
    formData.propertyGrowthRateOption as keyof typeof PropertyGrowthRateOptions;

  return (
    <Field>
      <FieldLabel>Property growth rate</FieldLabel>
      <Select
        name={"propertyGrowthRateOption"}
        value={formData.propertyGrowthRateOption}
        onValueChange={(value: string) => {
          value === "custom"
            ? setFormData({
                ...formData,
                propertyGrowthRateOption: value,
              })
            : setFormData({
                ...formData,
                propertyGrowthRateOption: value,
                propertyGrowthPercent:
                  PropertyGrowthRateOptions[
                    value as keyof typeof PropertyGrowthRateOptions
                  ].returnPercent,
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
              <SelectGroup key={currentGroupKey}>
                <SelectLabel>{currentGroupKey}</SelectLabel>
                {_(PropertyGrowthRateOptions)
                  .entries()
                  .filter(([_, { group }]) => group === currentGroupKey)
                  .map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value.label}
                    </SelectItem>
                  ))
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
          {PropertyGrowthRateOptions[option].returnPercent}% per year on
          average.{" "}
          <a
            target={"_blank"}
            href={PropertyGrowthRateOptions[option].sourceUrl}
          >
            Source
          </a>
        </FieldDescription>
      )}
    </Field>
  );
};

export const InvestmentReturnField = () => {
  const { formData, setFormData } = useContext(FormContext);

  const option =
    formData.investmentReturnOption as keyof typeof InvestmentOptions;

  return (
    <Field>
      <FieldLabel>Investment return</FieldLabel>
      <Select
        name={"investmentReturnOption"}
        value={formData.investmentReturnOption}
        onValueChange={(value: string) => {
          value === "custom"
            ? setFormData({
                ...formData,
                investmentReturnOption: value,
              })
            : setFormData({
                ...formData,
                investmentReturnOption: value,
                investmentGrowthPercent:
                  InvestmentOptions[value as keyof typeof InvestmentOptions]
                    .returnPercent,
              });
        }}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {Object.entries(InvestmentOptions).map(([key, value]) => (
              <SelectItem key={key} value={key}>
                {value.label}
              </SelectItem>
            ))}
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
          {InvestmentOptions[option].returnPercent}% per year on average.{" "}
          <a target={"_blank"} href={InvestmentOptions[option].sourceUrl}>
            Source
          </a>
        </FieldDescription>
      )}
    </Field>
  );
};

export const InvestmentSellOffField = () => {
  const { formData, setFormData } = useContext(FormContext);

  return (
    <Field>
      <FieldLabel>Investment sell-off</FieldLabel>
      <Select
        name={"investmentSellOffOption"}
        value={formData.investmentSellOffOption}
        onValueChange={(value: string) =>
          setFormData({
            ...formData,
            investmentSellOffOption: value,
          })
        }
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="doNotSell">Don't sell investments</SelectItem>
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
  );
};

export const IncomeSectionMessage = () => (
  <div className="flex gap-2 rounded-xl bg-blue-400/30 p-4 text-sm text-muted-foreground">
    <InfoIcon size={32} className="-mt-1" /> Let's see how much income you need
    to support the mortgage
  </div>
);

export const MortgageStressField = () => {
  const { formData, setFormData } = useContext(FormContext);

  const option =
    formData.mortgageStressOption as keyof typeof MortgageStressOptions;

  return (
    <Field>
      <FieldLabel>Mortgage stress</FieldLabel>
      <Select
        name={"mortgageStressOption"}
        value={formData.mortgageStressOption}
        onValueChange={(value: string) =>
          setFormData({
            ...formData,
            mortgageStressOption: value,
          })
        }
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {Object.entries(MortgageStressOptions).map(([key, value]) => (
              <SelectItem key={key} value={key}>
                {value.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <FieldDescription>
        {MortgageStressOptions[option].percentage}% of post-tax income spent on
        mortgage.
      </FieldDescription>
    </Field>
  );
};

export const RequiredAnnualPostTaxIncomeField = () => {
  const { simulationParams } = useContext(CalculationFieldsContext);
  return (
    <MoneyField
      name={"requiredAnnualPostTaxIncome"}
      label={"Required annual income (post-tax)"}
      value={simulationParams.requiredAnnualPostTaxIncome}
      disabled
    />
  );
};

export const NumIncomeEarnersField = () => {
  const { formData, setFormData } = useContext(FormContext);
  return (
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
  );
};

export const RequiredAnnualPreTaxIncomeField = () => {
  const { formData } = useContext(FormContext);
  const { simulationParams } = useContext(CalculationFieldsContext);

  return (
    <MoneyField
      name={"requiredAnnualPreTaxIncome"}
      label={"Required annual income (pre-tax)"}
      value={
        formData.numIncomeEarners === "dual"
          ? simulationParams.requiredAnnualPreTaxIncome / 2
          : simulationParams.requiredAnnualPreTaxIncome
      }
      suffix={formData.numIncomeEarners === "dual" ? "per person" : ""}
      disabled
      description={
        "Estimated 2024-2025 taxable income including 2% Medicare levy."
      }
    />
  );
};
