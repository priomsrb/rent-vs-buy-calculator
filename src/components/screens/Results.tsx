import { Link } from "@tanstack/react-router";
import { Button } from "../ui/button";
import { type PropertyPreset, propertyPresets } from "@/propertyPresets";
import { Bath, Bed, Building, House, MapPin } from "lucide-react";
import type { PropertyType } from "@/types";
import fakeGraph from "@/assets/fake_graph.png";
import { twMerge } from "tailwind-merge";
import { Input } from "@/components/ui/input.tsx";
import type { HTMLProps } from "react";
import { Switch } from "@/components/ui/switch.tsx";
import { Label } from "@/components/ui/label.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";

type ResultsScreenProps = {
  presetId: string;
};

function PropertyImage(props: { preset: PropertyPreset }) {
  return (
    <img
      src={props.preset.image}
      className="h-50 w-96 bg-background object-cover"
      style={{
        viewTransitionName: `${props.preset.id}Image`,
        // @ts-ignore viewTransitionClass not added to react's types yet
        viewTransitionClass: "vertically-align",
      }}
    />
  );
}

function BackButton(props: { preset: PropertyPreset }) {
  return (
    <div className="z-10 p-8">
      <Link
        to={"/start/$propertyType"}
        params={{ propertyType: props.preset.propertyType }}
        viewTransition={true}
      >
        {" "}
        <Button>← Choose another {props.preset.propertyType}</Button>
      </Link>
    </div>
  );
}

function Field(props: HTMLProps<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={twMerge(
        "mb-6 flex flex-col gap-2 first:mt-4",
        props.className,
      )}
    ></div>
  );
}

function CalculationDetails() {
  return (
    <form>
      <Details>
        <Summary>
          Calculation Details
          <Button variant={"link"} className={"float-end -my-1.5 p-2"}>
            Show all
          </Button>
        </Summary>
        <Details>
          <Summary>General</Summary>
          <DetailsContent>
            <Field>
              <Label>Type of property</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder={"House"}></SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={"house"}>House</SelectItem>
                  <SelectItem value={"unit"}>Unit</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <Label>Years to simulate</Label>
              <Input type={"number"} min={0} max={1000} />
            </Field>
          </DetailsContent>
        </Details>
        <Details>
          <Summary>Buying costs</Summary>
          <DetailsContent>
            <Details>
              <Summary>
                Purchase costs
                <small className={"float-end -my-1.5 p-2"}>$250,000</small>
              </Summary>
              <DetailsContent>
                <Field>
                  <Label>Property price ($)</Label>
                  <Input type={"number"} step={5000} min={0} />
                </Field>
                <Field>
                  <Label>Deposit (%)</Label>
                  <Input type={"number"} step={1} min={0} max={100} />
                  <small>Deposit: $300,000</small>
                </Field>

                <Field className={"flex-row"}>
                  <Label>First home buyer?</Label>
                  <Switch />
                </Field>
                <Field>
                  <Label>Stamp duty ($)</Label>
                  <Input type={"number"} disabled value={50_000} />
                </Field>
                <Field>
                  <Label>Legal fees ($)</Label>
                  <Input type={"number"} step={100} min={0} />
                </Field>
                <Field>
                  <Label>Pest/Building inspection ($)</Label>
                  <Input type={"number"} step={100} min={0} />
                </Field>
                <small>Total purchase cost: $250,000</small>
              </DetailsContent>
            </Details>
          </DetailsContent>
          <Details>
            <Summary>
              Ongoing costs
              <small className={"float-end -my-1.5 p-2"}>$50,000 / year</small>
            </Summary>
            <DetailsContent>
              <Field>
                <Label>Loan interest rate (%)</Label>
                <Input type={"number"} step={0.1} min={0} max={100} />
              </Field>
              <Field>
                <Label>Loan term (years)</Label>
                <Input type={"number"} step={1} min={1} />
                <small>Monthly payment: $4000</small>
              </Field>
              <Field>
                <Label>Maintenance cost (% of property value)</Label>
                <Input type={"number"} step={0.1} min={0} max={100} />
                <small>$3000 per year</small>
              </Field>
              <Field>
                <Label>Strata ($/year)</Label>
                <Input type={"number"} step={100} min={0} />
              </Field>
              <Field>
                <Label>Council rates ($/year)</Label>
                <Input type={"number"} step={100} min={0} />
              </Field>
              <Field>
                <Label>Insurance ($/year)</Label>
                <Input type={"number"} step={100} min={0} />
              </Field>
              <small>Total ongoing costs: $10,000/year</small>
            </DetailsContent>
          </Details>
          <Details>
            <Summary>Moving costs</Summary>
          </Details>
        </Details>
        <Details>
          <Summary>Renting costs</Summary>
        </Details>
        <Details>
          <Summary>Investment returns</Summary>
        </Details>
      </Details>
    </form>
  );
}

export function ResultsScreen({ presetId }: ResultsScreenProps) {
  const preset = propertyPresets.find((preset) => preset.id === presetId);
  if (!preset) {
    // TODO: Handle missing preset
    return "Invalid property preset";
  }
  return (
    <>
      <BackButton preset={preset} />
      {/*<PropertyImage preset={preset} />*/}
      {/*<PropertyInfo preset={preset} />*/}
      {/*<p>Renting comes out $1.5m ahead after 30 years</p>*/}
      {/*<img src={fakeGraph} />*/}
      {/*<img src={fakeBreakdown} />*/}
      <CalculationDetails />
    </>
  );
}

function Summary(props: React.HTMLProps<HTMLDivElement>) {
  return (
    <summary>
      <span className={"pl-2"}>{props.children}</span>
    </summary>
  );
}

function Details(props: React.DetailsHTMLAttributes<HTMLDetailsElement>) {
  return (
    <details
      {...props}
      className={twMerge(props.className, "m-2 rounded-2xl border px-4 py-2")}
      // Keep it "open" when developing
      open
    />
  );
}

function DetailsContent(props: React.HTMLProps<HTMLDivElement>) {
  // return <div className={"pt-2"}>{props.children}</div>;
  return <div>{props.children}</div>;
}

function PropertyInfo(props: { preset: PropertyPreset }) {
  return (
    <div className="flex flex-1 flex-col items-start p-4">
      {/* TODO: Format money. e.g. $1.5m or $600k */}
      <p>
        <MapPin className="inline-block" /> {props.preset.locationDescription}
      </p>
      <p className="flex gap-2">
        <span className="flex gap-1">
          <Bed />
          {props.preset.bedrooms}
        </span>
        ·
        <span className="flex gap-1">
          <Bath />
          {props.preset.bathrooms}
        </span>
        ·
        <span className="flex gap-1">
          {getIconForPropertyType(props.preset.propertyType)}
          {getNameForPropertyType(props.preset.propertyType)}
        </span>
      </p>
      <p>Buy: ${props.preset.buyPrice}</p>
      <p>Rent: ${props.preset.rentPerWeek} / week</p>
    </div>
  );
}

function getNameForPropertyType(propertyType: PropertyType) {
  switch (propertyType) {
    case "house":
      return "House";
    case "unit":
      return "Apartment";
    default:
      return propertyType;
  }
}

function getIconForPropertyType(propertyType: PropertyType) {
  switch (propertyType) {
    case "house":
      return <House />;
    case "unit":
      return <Building />;
    default:
      return <House />;
  }
}
