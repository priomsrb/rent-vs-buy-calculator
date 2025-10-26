import { amortizationPaymentPerMonth } from "@/utils/amortizationPaymentPerMonth.ts";
import { nswStampDuty, nswStampDutyFHB } from "@/utils/StampDuty.tsx";

export interface SimulationParams {
  propertyPrice: number;
  depositPercent: number;
  interestRatePercent: number;
  loanTermYears: number;
  propertyGrowthPercent: number;
  rentPerWeek: number;
  rentIncreasePercent: number;
  councilRatesPerYear: number;
  strataPerYear: number;
  maintenanceCostPercent: number;
  maintenanceCostGrowthPercent: number;
  insurancePerYear: number;
  legalFees: number;
  pestAndBuildingInspection: number;
  agentFeePercent: number;
  buyMoveOtherCosts: number;
  investmentGrowthPercent: number;
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
  isFirstHomeBuyer: boolean;
  // Moving (rent)
  rentMoveYearsBetween: number;
  rentMoveRemovalists: number;
  rentMoveCleaning: number;
  rentMoveConnections: number;
  rentMoveSupplies: number;
  rentMoveOverlapWeeks: number;
  // Moving (buy)
  buyMoveYearsBetween: number;
  buyMoveRemovalists: number;
  buyMoveConnections: number;
  buyMoveSupplies: number;
  buyMoveMinorRepairs: number;
  movingCostType: "lumpSum" | "averaged";
}

export type EnrichedSimulationParams = SimulationParams & {
  deposit: number;
  initialInvestment: number;
  loanAmount: number;
  lvrPercent: number;
  upfrontBuyerCosts: number;
  ongoingBuyerCostsFirstYear: number;
  monthlyMortgagePayment: number;
  legalFees: number;
  stampDuty: number;
  lmi: number;
  buyMovingCostsFirstYear: number;
  buyCostPerMove: number;
  rentMovingCostsFirstYear: number;
  rentCostPerMove: number;
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
    ongoingBuyerCostsFirstYear: getOngoingBuyerCostsFirstYear(params),
    monthlyMortgagePayment: getMonthlyMortgagePayment(params),
    legalFees: getLegalFees(params),
    stampDuty: getStampDuty(params),
    lmi: getLmi(params),
    buyMovingCostsFirstYear: getBuyMovingCostsPerYear(params),
    buyCostPerMove: getBuyCostPerMove(params),
    rentMovingCostsFirstYear: getRentMovingCostsPerYear(params),
    rentCostPerMove: getRentCostPerMove(params),
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

function getOngoingBuyerCostsFirstYear(params: SimulationParams) {
  const {
    strataPerYear,
    councilRatesPerYear,
    insurancePerYear,
    includeMaintenance,
    includeStrata,
    includeCouncil,
    includeInsurance,
  } = params;
  // TODO: Use actual interest calculation where the principal goes down through the year
  // const interest = (params.interestRatePercent / 100) * getLoanAmount(params);
  const mortgagePerYear = getMonthlyMortgagePayment(params) * 12;
  const maintenance =
    (params.maintenanceCostPercent / 100) * params.propertyPrice;

  return (
    mortgagePerYear +
    (includeMaintenance ? maintenance : 0) +
    (includeStrata ? strataPerYear : 0) +
    (includeCouncil ? councilRatesPerYear : 0) +
    (includeInsurance ? insurancePerYear : 0)
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

function estimateLMI(loanAmount: number, lvrPercent: number): number {
  const lvr = Number(lvrPercent);
  if (lvr <= 80) return 0;
  if (lvr <= 85) return loanAmount * 0.02;
  if (lvr <= 90) return loanAmount * 0.03;
  if (lvr <= 95) return loanAmount * 0.04;
  return loanAmount * 0.045;
}

function getBuyMovingCostsPerYear(params: SimulationParams) {
  return getBuyCostPerMove(params) / params.buyMoveYearsBetween;
}

function getRentMovingCostsPerYear(params: SimulationParams) {
  return getRentCostPerMove(params) / params.rentMoveYearsBetween;
}

function getBuyCostPerMove(params: SimulationParams) {
  const stampDuty = getStampDuty(params);
  const legalFees = getLegalFees(params);
  const agentFees = (params.propertyPrice * params.agentFeePercent) / 100;
  const { buyMoveRemovalists, pestAndBuildingInspection, buyMoveOtherCosts } =
    params;

  return (
    stampDuty +
    legalFees +
    agentFees +
    buyMoveRemovalists +
    pestAndBuildingInspection +
    buyMoveOtherCosts
  );
}

function getRentCostPerMove(params: SimulationParams) {
  const {
    rentMoveRemovalists,
    rentMoveCleaning,
    rentMoveOverlapWeeks,
    rentPerWeek,
  } = params;

  return (
    rentMoveRemovalists + rentMoveCleaning + rentMoveOverlapWeeks * rentPerWeek
  );
}
