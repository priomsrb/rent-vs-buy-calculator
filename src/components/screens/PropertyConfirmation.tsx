import { Link } from "@tanstack/react-router";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { type PropertyPreset } from "@/propertyPresets";
import { FieldGroup } from "@/components/ui/field.tsx";
import { BackButton } from "@/components/BackButton.tsx";
import { useState } from "react";
import {
  BooleanField,
  FormContext,
  MoneyField,
  NumberField,
  PercentageField,
} from "@/components/Forms.tsx";
import {
  parseLocalStorage,
  writeToLocalStorage,
} from "@/utils/localStorage.tsx";
import type { EnrichedSimulationParams } from "@/calculation/EnrichedSimulationParams.tsx";

export function PropertyConfirmation(props: {
  propertyPreset: PropertyPreset;
}) {
  const { propertyPreset } = props;
  const [formData, setFormDataRaw] = useState<
    Partial<EnrichedSimulationParams>
  >({
    ...propertyPreset,
    depositPercent: 20,
    loanTermYears: 30,
    isFirstHomeBuyer: true,
    ...(parseLocalStorage("formData") ?? {}),
  });

  function setFormData(data: Partial<EnrichedSimulationParams>) {
    setFormDataRaw(data);

    const existingFormData = parseLocalStorage("formData") ?? {};
    writeToLocalStorage("formData", { ...existingFormData, ...data });
  }

  return (
    <FormContext value={{ formData, setFormData }}>
      <div className={"flex w-full flex-col justify-center"}>
        <div className="flex h-full w-full flex-col items-center p-8 pt-4">
          <BackButton
            to={"/start/$propertyType"}
            params={{ propertyType: propertyPreset.propertyType }}
          />
          <div className="flex w-full flex-col justify-center text-center md:mt-20 md:w-200">
            {/*<h1 className="mb-10 text-4xl">Confirm details</h1>*/}
            <div className="mb-10 flex flex-col items-center md:flex-row md:gap-8">
              <img
                className={
                  "-m-2 mb-10 h-30 w-full scale-125 object-cover md:m-0 md:h-full md:w-1/2 md:flex-1 md:scale-none md:rounded-xl"
                }
                style={{
                  viewTransitionName: `${propertyPreset.id}Image`,
                  // @ts-ignore viewTransitionClass not added to react's types yet
                  viewTransitionClass: "vertically-align",
                }}
                src={propertyPreset.image}
              />
              <Card className={"w-full flex-1 gap-6 px-8"}>
                <FieldGroup>
                  <MoneyField
                    name={"propertyPrice"}
                    label={"Buy price"}
                    min={10_000}
                    max={3_000_000}
                    step={5000}
                  />
                  <PercentageField
                    name={"depositPercent"}
                    label={"Deposit"}
                    // description={`Deposit: ${formatMoney(
                    //   (formData.depositPercent / 100) *
                    //     formData.propertyPrice,
                    // )}`}
                  />
                  <NumberField
                    name={"loanTermYears"}
                    label={"Loan term"}
                    step={1}
                    min={1}
                    max={50}
                    suffix={"years"}
                  />
                  <BooleanField
                    name={"isFirstHomeBuyer"}
                    label={"First home buyer?"}
                  />
                </FieldGroup>
                <VersusDivider />
                <FieldGroup>
                  <MoneyField
                    name={"rentPerWeek"}
                    label={"Rent"}
                    max={3_000}
                    step={10}
                    suffix={"per week"}
                  />
                </FieldGroup>
              </Card>
            </div>
            <Link
              to={"/results/$presetId"}
              params={{ presetId: propertyPreset.id }}
              viewTransition={true}
              draggable={false}
            >
              <Button type={"button"} variant={"secondary"}>
                Compare renting vs buying →
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </FormContext>
  );
}

function VersusDivider() {
  return (
    <div className={"flex items-center gap-4"}>
      <div className={"h-0 flex-1 border-t-2"}></div>
      vs
      <div className={"flex-1 border-t-2"}></div>
    </div>
  );
}
