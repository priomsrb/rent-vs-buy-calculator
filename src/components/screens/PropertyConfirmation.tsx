import { Link } from "@tanstack/react-router";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { type PropertyPreset } from "@/propertyPresets";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { Field, FieldLabel, FieldSet } from "@/components/ui/field.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Switch } from "@/components/ui/switch.tsx";

export function PropertyConfirmation(props: {
  propertyPreset: PropertyPreset;
}) {
  const { propertyPreset } = props;
  propertyPreset.propertyType;
  return (
    <div className={"flex w-full justify-center"}>
      <div className="flex h-full w-full flex-col items-center p-8 md:w-300">
        <div className="mb-8">
          <Link
            to={`/start/$propertyType`}
            params={{ propertyType: propertyPreset.propertyType }}
            viewTransition={true}
            draggable={false}
          >
            <Button>← Choose a different {propertyPreset.propertyType}</Button>
          </Link>
        </div>
        <form>
          <div className="center w-full text-center">
            <h1 className="mb-10 text-4xl">Confirm details</h1>
            <div className="mb-10 flex flex-col gap-8 md:flex-row">
              <Card className={"flex-1 p-6"}>
                <img
                  className={"w-full rounded-xl"}
                  style={{
                    viewTransitionName: `${propertyPreset.id}Image`,
                    // @ts-ignore viewTransitionClass not added to react's types yet
                    viewTransitionClass: "vertically-align",
                  }}
                  src={propertyPreset.image}
                />
                <FieldSet>
                  <Field>
                    <FieldLabel htmlFor={"propertyType"}>Type</FieldLabel>
                    <Select
                      defaultValue={propertyPreset.propertyType}
                      name={"propertyType"}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={"house"}>House</SelectItem>
                        <SelectItem value={"unit"}>Unit</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor={"propertyType"}>Location</FieldLabel>
                    <Input
                      type={"text"}
                      name={"location"}
                      defaultValue={propertyPreset.locationDescription}
                    />
                  </Field>
                </FieldSet>
              </Card>
              <Card className={"flex-1 p-6"}>
                <h2>Buying</h2>
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
                <div className={"flex items-center gap-4"}>
                  <div className={"h-0 flex-1 border-t-2"}></div>
                  vs
                  <div className={"flex-1 border-t-2"}></div>
                </div>
                <h2>Renting</h2>
                <FieldSet>
                  <Field>
                    <FieldLabel>Rent per week</FieldLabel>
                    <Input
                      name={"rentPerWeek"}
                      defaultValue={propertyPreset.rentPerWeek}
                    />
                  </Field>
                </FieldSet>
              </Card>
            </div>
            <Link
              to={"/results/$presetId"}
              params={{ presetId: propertyPreset.id }}
            >
              <Button type={"button"}>Compare renting vs buying →</Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
