import { useCallback, useEffect, useState } from "react";

import { BackButton } from "@/components/BackButton.tsx";
import {
  BooleanField,
  FormContext,
  MoneyField,
  NumberField,
  PercentField,
} from "@/components/Forms.tsx";
import { StepIndicator } from "@/components/StepIndicator";
import { FieldGroup } from "@/components/ui/field.tsx";
import { ScreenBackdrop, pillPrimaryClass } from "@/components/ui/glass";
import { type PropertyPreset } from "@/propertyPresets";
import {
  parseLocalStorage,
  writeToLocalStorage,
} from "@/utils/localStorage.tsx";
import { Link } from "@tanstack/react-router";

import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { formPresets } from "./Results/formPresets";

export function PropertyConfirmation(props: {
  propertyPreset: PropertyPreset;
}) {
  const { propertyPreset } = props;
  const formPresetForProperty =
    propertyPreset.propertyType === "unit"
      ? formPresets.apartment
      : formPresets.house;
  const [formData, setFormDataRaw] = useState<Partial<FormData>>({
    ...formPresetForProperty,
    ...propertyPreset,
    depositPercent: 20,
    loanTermYears: 30,
    isFirstHomeBuyer: true,
    ...(parseLocalStorage("formData") ?? {}),
  });

  useEffect(() => {
    // Save initial form data on load
    saveFormData(formData);
  }, []);

  const setFormData = useCallback(
    (
      newFormData:
        | Partial<FormData>
        | ((previousFormData: Partial<FormData>) => FormData),
    ) => {
      setFormDataRaw((currentFormData) => {
        let newFormDataValue;
        if (typeof newFormData === "function") {
          newFormDataValue = newFormData(currentFormData);
        } else {
          newFormDataValue = newFormData;
        }

        saveFormData(newFormDataValue);

        return newFormDataValue;
      });
    },
    [],
  );

  return (
    <FormContext value={{ formData, setFormData }}>
      <div
        className={"relative flex min-h-screen w-full flex-col overflow-hidden"}
      >
        <ScreenBackdrop />
        <div className="z-10 flex h-full w-full flex-col items-center p-8 pt-4">
          <BackButton
            to={"/start/$propertyType"}
            params={{ propertyType: propertyPreset.propertyType }}
          />
          <StepIndicator step={3} totalSteps={3} label="Check the numbers" />
          <div className="flex w-full flex-col justify-center text-center md:mt-10 md:w-200">
            <h1 className="mt-6 mb-2 text-3xl font-bold tracking-tight">
              Do these numbers look right?
            </h1>
            <p className="mb-8 text-foreground/60">
              Adjust the price, deposit, and rent to match your situation.
            </p>
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
              <Card
                className={
                  "w-full flex-1 gap-6 rounded-[1.5rem] border-foreground/10 bg-foreground/5 px-8 backdrop-blur-md"
                }
              >
                <FieldGroup>
                  <MoneyField
                    name={"propertyPrice"}
                    label={"Buy price"}
                    min={10_000}
                    max={3_000_000}
                    step={5000}
                  />
                  <PercentField name={"depositPercent"} label={"Deposit"} />
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
              onClick={() => saveFormData(formData)}
            >
              <Button type={"button"} className={pillPrimaryClass}>
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

function saveFormData(newFormData: Partial<FormData>) {
  const existingFormData = parseLocalStorage("formData") ?? {};
  console.log("SAVING form data", { newFormData, existingFormData });
  writeToLocalStorage("formData", { ...existingFormData, ...newFormData });
}
