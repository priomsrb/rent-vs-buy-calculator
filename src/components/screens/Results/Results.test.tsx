import { describe, expect, it } from "vitest";
import { ResultsScreen } from "./Results";
import { renderWithRouter } from "@/test-utils/router";

describe("Result screen", async () => {
  it("should render the result screen", async () => {
    const { getByRole } = await renderWithRouter(
      <ResultsScreen presetId="outerSuburbsHouse" />,
    );
    expect(getByRole("heading", { name: "Results" })).toBeInTheDocument();
  });
});
