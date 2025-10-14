import { Link } from "@tanstack/react-router";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { type PropertyPreset } from "@/propertyPresets";
import { Field, FieldLabel, FieldSet } from "@/components/ui/field.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Switch } from "@/components/ui/switch.tsx";
import { BackButton } from "@/components/BackButton.tsx";

export function PropertyConfirmation(props: {
  propertyPreset: PropertyPreset;
}) {
  const { propertyPreset } = props;
  propertyPreset.propertyType;
  return (
    <div className={"flex w-full flex-col justify-center"}>
      <div className="flex h-full w-full flex-col items-center p-8 pt-4">
        <BackButton
          to={"/start/$propertyType"}
          params={{ propertyType: propertyPreset.propertyType }}
        />
        <div className="flex w-full flex-col justify-center text-center md:mt-20 md:w-200">
          {/*<h1 className="mb-10 text-4xl">Confirm details</h1>*/}
          <div className="mb-10 flex flex-col md:flex-row md:gap-8">
            <img
              className={
                "-m-2 mb-10 h-30 scale-125 object-cover md:m-0 md:h-full md:w-1/2 md:flex-1 md:scale-none md:rounded-xl"
              }
              style={{
                viewTransitionName: `${propertyPreset.id}Image`,
                // @ts-ignore viewTransitionClass not added to react's types yet
                viewTransitionClass: "vertically-align",
              }}
              src={propertyPreset.image}
            />
            <Card className={"flex-1 px-8"}>
              <form>
                <FieldSet>
                  <Field>
                    <FieldLabel>Price</FieldLabel>
                    <Input
                      name={"propertyPrice"}
                      defaultValue={propertyPreset.propertyPrice}
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Deposit</FieldLabel>
                    <Input name={"depositPercentage"} defaultValue={"20"} />
                  </Field>
                  <Field>
                    <FieldLabel>Loan term</FieldLabel>
                    <Input name={"loanTerm"} defaultValue={"30"} />
                  </Field>
                  <Field orientation={"horizontal"}>
                    <FieldLabel>First home buyer</FieldLabel>
                    <Switch name={"isFirstHomeBuyer"} />
                  </Field>
                </FieldSet>
                <div className={"my-6 flex items-center gap-4"}>
                  <div className={"h-0 flex-1 border-t-2"}></div>
                  vs
                  <div className={"flex-1 border-t-2"}></div>
                </div>
                <FieldSet>
                  <Field>
                    <FieldLabel>Rent per week</FieldLabel>
                    <Input
                      name={"rentPerWeek"}
                      defaultValue={propertyPreset.rentPerWeek}
                    />
                  </Field>
                </FieldSet>
              </form>
            </Card>
          </div>
          <Link
            to={"/results/$presetId"}
            params={{ presetId: propertyPreset.id }}
            viewTransition={true}
          >
            <Button type={"button"} variant={"secondary"}>
              Compare renting vs buying →
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
