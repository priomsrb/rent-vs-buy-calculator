import { describe, it, expect } from "vitest";
import { nswStampDuty, nswStampDutyFHB } from "@/utils/StampDuty.tsx";

describe("nswStampDuty", () => {
  it.each([
    // Values taken from Service NSW calculator: https://www.apps09.revenue.nsw.gov.au/erevenue/calculators/landsalesimple.php
    // [propertyPrice, expectedStampDuty]
    [0, 0],
    [10_000, 125],
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
