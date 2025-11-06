import { describe, it, expect } from "vitest";
import {
  nswStampDuty,
  nswStampDutyForYear,
  nswStampDutyFHB,
} from "@/utils/StampDuty.tsx";

describe("nswStampDuty", () => {
  it.each([
    // Values taken from Service NSW calculator: https://www.apps09.revenue.nsw.gov.au/erevenue/calculators/landsalesimple.php
    // [propertyPrice, expectedStampDuty]
    [0, 0],
    [10_000, 125],
    [40_000, 565],
    [100_000, 1632],
    [200_000, 5132],
    [500_000, 16_912],
    [1_000_000, 39_412],
    [2_000_000, 92_012],
  ])(`nswStampDuty(%i) -> %i`, (propertyPrice, expectedStampDuty) => {
    expect(Math.floor(nswStampDuty(propertyPrice))).toBe(expectedStampDuty);
  });
});

describe("nswStampDutyFHB", () => {
  it.each([
    // Values taken from Service NSW calculator: https://www.apps09.revenue.nsw.gov.au/erevenue/calculators/landsalesimple.php
    // [propertyPrice, expectedStampDuty]
    [0, 0],
    [100_000, 0],
    [800_000, 0],
    [810_000, 1970],
    [950_000, 29_559],
    [1_000_000, 39_412],
    [2_000_000, 92_012],
  ])(`nswStampDuty(%i) -> %i`, (propertyPrice, expectedStampDuty) => {
    expect(Math.floor(nswStampDutyFHB(propertyPrice))).toBe(expectedStampDuty);
  });
});

describe("nswStampDutyForYear", () => {
  it.each([
    // Values taken from Service NSW calculator: https://www.apps09.revenue.nsw.gov.au/erevenue/calculators/landsalesimple.php
    // [propertyPrice, expectedStampDuty]
    [0, 0],
    [10_000, 125],
    [40_000, 565],
    [100_000, 1632],
    [200_000, 5132],
    [500_000, 16_912],
    [1_000_000, 39_412],
    [2_000_000, 92_012],
  ])(
    `nswStampDutyForYear(%i, 2025) -> %i`,
    (propertyPrice, expectedStampDuty) => {
      expect(Math.floor(nswStampDutyForYear(propertyPrice, 2025))).toBe(
        expectedStampDuty,
      );
    },
  );

  it.each([
    [0, 0],
    [10_000, 125],
    [40_000, 541],
    [100_000, 1560],
    [200_000, 4339],
    [500_000, 14_839],
    [1_000_000, 37_015],
    [2_000_000, 84_268],
  ])(
    `nswStampDutyForYear(%i, 2035) -> %i`,
    (propertyPrice, expectedStampDuty) => {
      expect(Math.floor(nswStampDutyForYear(propertyPrice, 2035))).toBe(
        expectedStampDuty,
      );
    },
  );
});
