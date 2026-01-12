import { describe, expect, it } from "vitest";
import { userEvent } from "vitest/browser";

import { propertyPresets } from "@/propertyPresets";
import { renderWithRouter } from "@/test-utils/router";

import { KEY_RESULTS_MESSAGE_TESTID, ResultsScreen } from "./Results";

describe("Result screen", async () => {
  it("should show the main headings", async () => {
    const { getByRole } = await renderWithRouter(
      <ResultsScreen propertyPreset={propertyPresets[0]} />,
    );
    expect(getByRole("heading", { name: "Results" })).toBeInTheDocument();
    expect(getByRole("heading", { name: "Net worth" })).toBeInTheDocument();
    expect(getByRole("heading", { name: "Breakdown" })).toBeInTheDocument();
    expect(getByRole("heading", { name: "Pros/Cons" })).toBeInTheDocument();
    expect(getByRole("heading", { name: "Calculation" })).toBeInTheDocument();
  });

  it("should allow changing the number of years using text field", async () => {
    const { getByRole, getByTestId } = await renderWithRouter(
      <ResultsScreen propertyPreset={propertyPresets[0]} />,
    );

    const generalButton = getByRole("button", { name: "General" });
    await generalButton.click();
    const numYearsInput = getByRole("textbox", { name: "Years to simulate" });
    expect(numYearsInput).toBeInTheDocument();
    await userEvent.fill(numYearsInput, "10");

    const keyResultsMessage = getByTestId(KEY_RESULTS_MESSAGE_TESTID);
    expect(keyResultsMessage).toHaveTextContent("after 10 years");
  });
});
