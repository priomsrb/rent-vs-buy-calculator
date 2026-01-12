import { describe, expect, it } from "vitest";

import { compactNumber } from "./compactNumber";

describe("compactNumber", () => {
  it("converts below 1000", async () => {
    expect(compactNumber(0)).toBe("0");
    expect(compactNumber(0.1)).toBe("0");
    expect(compactNumber(1)).toBe("1");
    expect(compactNumber(999)).toBe("999");
    expect(compactNumber(999.99)).toBe("1k");
  });
  it("converts between 1k and below 1m", async () => {
    expect(compactNumber(1000)).toBe("1k");
    expect(compactNumber(999_000)).toBe("999k");
    expect(compactNumber(999_999)).toBe("1m");
  });
  it("converts between 1m and below 1b", async () => {
    expect(compactNumber(1_000_000)).toBe("1m");
    expect(compactNumber(999_000_000)).toBe("999m");
    expect(compactNumber(999_999_999)).toBe("1b");
  });
  it("converts over 1b", async () => {
    expect(compactNumber(1_000_000_000)).toBe("1b");
    expect(compactNumber(10_000_000_000_000)).toBe("10000b");
  });
  it("converts negatives", async () => {
    expect(compactNumber(-999)).toBe("-999");
    expect(compactNumber(-1000)).toBe("-1k");
    expect(compactNumber(-999_000)).toBe("-999k");
    expect(compactNumber(-999_999)).toBe("-1m");
  });

  it("adds decimals if asked", async () => {
    expect(compactNumber(999.99, 2)).toBe("999.99");
    expect(compactNumber(999.9999, 2)).toBe("1k");
    expect(compactNumber(1000, 2)).toBe("1k");
    expect(compactNumber(1234, 2)).toBe("1.23k");
    expect(compactNumber(1239, 2)).toBe("1.24k");
    expect(compactNumber(999_900, 1)).toBe("999.9k");
    expect(compactNumber(999_999, 1)).toBe("1m");
  });
});
