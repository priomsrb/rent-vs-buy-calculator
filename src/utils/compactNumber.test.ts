import { describe, it, expect } from "vitest";
import { compactNumber } from "./compactNumber";

describe("compactNumber", () => {
  it("converts below 1000 to itself", async () => {
    expect(compactNumber(1)).toBe("1");
    expect(compactNumber(999)).toBe("999");
  });
  it("converts between 1k and below 1m", async () => {
    expect(compactNumber(1000)).toBe("1k");
    expect(compactNumber(999_999)).toBe("999k");
  });
  it("converts between 1m and below 1b", async () => {
    expect(compactNumber(1_000_000)).toBe("1m");
    expect(compactNumber(999_999_999)).toBe("999m");
  });
  it("converts over 1b", async () => {
    expect(compactNumber(1_000_000_000)).toBe("1b");
    expect(compactNumber(10_000_000_000_000)).toBe("10000b");
  });
  it("converts negatives", async () => {
    expect(compactNumber(-999)).toBe("-999");
    expect(compactNumber(-1000)).toBe("-1k");
    expect(compactNumber(-999_999)).toBe("-999k");
  });
  it("adds decimals if asked", async () => {
    expect(compactNumber(999.9999, 2)).toBe("999.99");
    expect(compactNumber(1000, 2)).toBe("1k");
    expect(compactNumber(1234, 2)).toBe("1.23k");
    // TODO: This test case should work
    // expect(compactNumber(1239, 2)).toBe("1.24k");
    expect(compactNumber(999_999, 1)).toBe("999.9k");
  });
});
