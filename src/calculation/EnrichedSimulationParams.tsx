import { amortizationPaymentPerMonth } from "@/utils/amortizationPaymentPerMonth.ts";

export interface SimulationParams {
  propertyPrice: number;
  depositPercent: number;
  interestRatePercent: number;
  loanTermYears: number;
  propertyGrowth: number;
  rentPerWeek: number;
  rentIncreasePercentage: number;
  councilRatesPerYear: number;
  strataPerYear: number;
  maintenanceCostPercent: number;
  insurancePerYear: number;
  legalFees: number;
  pestAndBuildingInspection: number;
  agentFeePercent: number;
  buyMoveOtherCosts: number;
  investmentGrowthPercentage: number;
  numYears: number;
  sellAtEnd: boolean;
  // Toggles
  includeStampDuty?: boolean;
  includeLMI?: boolean;
  includeLegalFees?: boolean;
  includeCouncil?: boolean;
  includeStrata?: boolean;
  includeMaintenance?: boolean;
  includeInsurance?: boolean;
  includeAgentFee?: boolean;
  includeSellingFixed?: boolean;
  includeInvestSurplus?: boolean;
  includeInvestReturns?: boolean;
  includePropertyGrowth?: boolean;
  includeRentGrowth?: boolean;
  includeRenterInitialCapital?: boolean;
  includeMovingCosts?: boolean;
  isFirstHomeBuyer?: boolean;
  // Moving (rent)
  rentMoveYearsBetween?: number;
  rentMoveRemovalists?: number;
  rentMoveCleaning?: number;
  rentMoveConnections?: number;
  rentMoveSupplies?: number;
  rentMoveOverlapWeeks?: number;
  // Moving (buy)
  buyMoveYearsBetween?: number;
  buyMoveRemovalists?: number;
  buyMoveConnections?: number;
  buyMoveSupplies?: number;
  buyMoveMinorRepairs?: number;
  movingCostType?: "lumpSum" | "averaged";
}

export type EnrichedSimulationParams = SimulationParams & {
  deposit: number;
  initialInvestment: number;
  loanAmount: number;
  lvrPercent: number;
  upfrontBuyerCosts: number;
  ongoingBuyerCosts: number;
  monthlyMortgagePayment: number;
  legalFees: number;
  stampDuty: number;
  lmi: number;
};

export function getEnrichedSimulationParams(
  params: SimulationParams,
): EnrichedSimulationParams {
  return {
    ...params,
    deposit: getDeposit(params),
    initialInvestment: getInitialInvestment(params),
    loanAmount: getLoanAmount(params),
    lvrPercent: getLvrPercent(params),
    upfrontBuyerCosts: getUpfrontBuyerCosts(params),
    ongoingBuyerCosts: getOngoingBuyerCosts(params),
    monthlyMortgagePayment: getMonthlyMortgagePayment(params),
    legalFees: getLegalFees(params),
    stampDuty: getStampDuty(params),
    lmi: getLmi(params),
  };
}

function getStampDuty(params: SimulationParams) {
  const { includeStampDuty, isFirstHomeBuyer, propertyPrice } = params;
  return includeStampDuty
    ? isFirstHomeBuyer
      ? nswStampDutyFHB(propertyPrice)
      : nswStampDuty(propertyPrice)
    : 0;
}
function getLoanAmount(params: SimulationParams) {
  const { propertyPrice } = params;
  const deposit = getDeposit(params);
  return Math.max(0, propertyPrice - deposit);
}
function getLvrPercent(params: SimulationParams) {
  const { propertyPrice } = params;
  const loanAmount = getLoanAmount(params);
  return (loanAmount / propertyPrice) * 100;
}
const getLmi = (params: SimulationParams) => {
  const { includeLMI } = params;
  const loanAmount = getLoanAmount(params);
  const lvrPercent = getLvrPercent(params);
  return includeLMI ? estimateLMI(loanAmount, lvrPercent) : 0;
};
function getDeposit(params: SimulationParams) {
  const { propertyPrice, depositPercent } = params;
  return propertyPrice * (depositPercent / 100);
}
function getLegalFees(params: SimulationParams) {
  const { includeLegalFees, legalFees } = params;
  return includeLegalFees ? legalFees : 0;
}
function getUpfrontBuyerCosts(params: SimulationParams) {
  const stampDuty = getStampDuty(params);
  const lmi = getLmi(params);
  const legalFees = getLegalFees(params);
  const pestAndBuildingInspection = params.pestAndBuildingInspection;

  return stampDuty + lmi + legalFees + pestAndBuildingInspection;
}
function getMonthlyMortgagePayment(params: SimulationParams) {
  return amortizationPaymentPerMonth(
    getLoanAmount(params),
    params.interestRatePercent,
    params.loanTermYears,
  );
}

function getOngoingBuyerCosts(params: SimulationParams) {
  // TODO: Use actual interest calculation where the principal goes down through the year
  // const interest = (params.interestRatePercent / 100) * getLoanAmount(params);
  const mortgagePerYear = getMonthlyMortgagePayment(params) * 12;
  const maintenance =
    (params.maintenanceCostPercent / 100) * params.propertyPrice;
  // TODO: Consider adding the "include" conditionals below
  const { strataPerYear, councilRatesPerYear, insurancePerYear } = params;

  return (
    mortgagePerYear +
    maintenance +
    strataPerYear +
    councilRatesPerYear +
    insurancePerYear
  );
}
const getInitialInvestment = (params: SimulationParams) => {
  const { includeRenterInitialCapital } = params;
  const deposit = getDeposit(params);
  const upfrontBuyerCosts = getUpfrontBuyerCosts(params);
  if (includeRenterInitialCapital) {
    return deposit + upfrontBuyerCosts;
  }
  return 0;
};

// TODO: Add unit tests
function nswStampDuty(dutiableValue: number): number {
  const v = Math.max(0, Number(dutiableValue));
  if (v <= 16000) return v * 0.0125;
  if (v <= 35000) return 200 + (v - 16000) * 0.015;
  if (v <= 93000) return 485 + (v - 35000) * 0.0175;
  if (v < 351000) return 1500 + (v - 93000) * 0.035;
  if (v < 1168000) return 9805 + (v - 351000) * 0.045;
  return 44095 + (v - 1168000) * 0.055;
}

// TODO: Add unit tests
function nswStampDutyFHB(
  dutiableValue: number,
  opts: { fullExemptMax?: number; concessionMax?: number } = {},
): number {
  const v = Math.max(0, Number(dutiableValue));
  const fullExemptMax = opts.fullExemptMax ?? 800000;
  const concessionMax = opts.concessionMax ?? 1000000;
  const standardAtConcessionMax = nswStampDuty(concessionMax);
  if (v <= fullExemptMax) return 0;
  if (v >= concessionMax) return standardAtConcessionMax;
  const t = (v - fullExemptMax) / (concessionMax - fullExemptMax);
  return standardAtConcessionMax * t;
}

function estimateLMI(loanAmount: number, lvrPercent: number): number {
  const lvr = Number(lvrPercent);
  if (lvr <= 80) return 0;
  if (lvr <= 85) return loanAmount * 0.02;
  if (lvr <= 90) return loanAmount * 0.03;
  if (lvr <= 95) return loanAmount * 0.04;
  return loanAmount * 0.045;
}
