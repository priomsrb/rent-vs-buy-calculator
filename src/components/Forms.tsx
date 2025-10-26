import { createContext, useContext } from "react";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field.tsx";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group.tsx";
import { Slider } from "@/components/ui/slider.tsx";
import { Switch } from "@/components/ui/switch.tsx";

type FormContextType = {
  formData: { [key: string]: any };
  // TODO: Find a way to make this typesafe
  setFormData: (formData: any) => void;
  // setFormData: (formData: { [key: string]: any }) => void;
};

export const FormContext = createContext<FormContextType>({
  formData: {},
  setFormData: () => {},
});

type NumberFieldProps = {
  name: string;
  label: string;
  description?: string;
  min?: number;
  max?: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  showSlider?: boolean;
  disabled?: boolean;
  value?: number;
  helpLink?: string;
};

export function NumberField({
  name,
  label,
  description,
  min = 0,
  max = 100,
  step = 1,
  prefix,
  suffix,
  showSlider = true,
  disabled,
  value,
  helpLink,
}: NumberFieldProps) {
  const { formData, setFormData } = useContext(FormContext);
  return (
    <Field>
      <FieldLabel>
        {label}
        {helpLink && (
          <a
            className={"w-5 rounded-full bg-blue-500 text-center text-white"}
            href={helpLink}
            target={"_blank"}
          >
            ?
          </a>
        )}
      </FieldLabel>
      <InputGroup>
        <InputGroupInput
          name={name}
          type={"number"}
          value={value !== undefined ? value : formData[name]}
          onChange={(e) =>
            setFormData({
              ...formData,
              // We don't clamp to max to allow large values for users that want them
              // Clamping to minimum is good to avoid things like dividing by 0
              [name]: Math.max(min, Number(e.target.value)),
            })
          }
          min={min}
          max={max}
          step={step}
          disabled={disabled}
        />
        {prefix && <InputGroupAddon>{prefix}</InputGroupAddon>}
        {suffix && (
          <InputGroupAddon align={"inline-end"}>{suffix}</InputGroupAddon>
        )}
      </InputGroup>
      {showSlider && !disabled && (
        <Slider
          value={[formData[name]]}
          onValueChange={([value]) =>
            setFormData({
              ...formData,
              [name]: value,
            })
          }
          min={min}
          max={max}
          step={step}
        />
      )}
      {description && <FieldDescription>{description}</FieldDescription>}
    </Field>
  );
}

export function MoneyField(props: NumberFieldProps) {
  return <NumberField prefix={"$"} {...props} />;
}

export function PercentageField(props: NumberFieldProps) {
  return <NumberField suffix={"%"} {...props} />;
}

type BooleanFieldProps = {
  name: string;
  label: string;
  description?: string;
};

export function BooleanField({ name, label, description }: BooleanFieldProps) {
  const { formData, setFormData } = useContext(FormContext);
  return (
    <Field orientation={"horizontal"}>
      <FieldLabel>{label}</FieldLabel>
      <Switch
        name={name}
        checked={formData[name]}
        onCheckedChange={(isChecked) => {
          setFormData({
            ...formData,
            [name]: isChecked,
          });
        }}
      />
      {description && <FieldDescription>{description}</FieldDescription>}
    </Field>
  );
}
