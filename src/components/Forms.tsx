import { createContext, memo, useCallback, useContext, useMemo } from "react";
import { NumericFormat } from "react-number-format";

import { Field, FieldDescription, FieldLabel } from "@/components/ui/field.tsx";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group.tsx";
import { Slider } from "@/components/ui/slider.tsx";
import { Switch } from "@/components/ui/switch.tsx";
import { roundWithDecimals } from "@/utils/roundWithDecimals";

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
  prefix?: string | ((value: number) => string);
  suffix?: string | ((value: number) => string);
  showSlider?: boolean;
  disabled?: boolean;
  value?: number;
  displayValue?: (value: number) => string;
  helpLink?: string;
  hideLabel?: boolean;
  decimalPlaces?: number;
};

export const NumberField = memo((props: NumberFieldProps) => {
  const { formData, setFormData } = useContext(FormContext);
  const formValue = useMemo(() => formData[props.name], [formData[props.name]]);
  const setFormValue = useCallback(
    (value: number) => {
      setFormData((currentFormData: FormData) => ({
        ...currentFormData,
        [props.name]: value,
      }));
    },
    [setFormData, props.name],
  );

  return (
    <NumberFieldInner
      {...props}
      formValue={formValue}
      setFormValue={setFormValue}
    />
  );
});

export const NumberFieldInner = memo(
  ({
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
    displayValue = (value) => `${value}`,
    value,
    helpLink,
    hideLabel = false,
    decimalPlaces = 2,
    formValue,
    setFormValue,
  }: NumberFieldProps & {
    formValue: number;
    setFormValue: (value: number) => void;
  }) => {
    const roundedValue = roundWithDecimals(
      value !== undefined ? value : formValue,
      decimalPlaces,
    );
    return (
      <Field>
        {!hideLabel && (
          <FieldLabel htmlFor={`input-${name}`}>
            {label}
            {helpLink && (
              <a
                className={
                  "w-5 rounded-full bg-blue-500 text-center text-white"
                }
                href={helpLink}
                target={"_blank"}
              >
                ?
              </a>
            )}
          </FieldLabel>
        )}
        <InputGroup>
          <NumericFormat
            id={`input-${name}`}
            name={name}
            value={displayValue(roundedValue)}
            customInput={InputGroupInput}
            thousandSeparator
            disabled={disabled}
            onValueChange={(values, sourceInfo) => {
              // Check whether value is actually different first.
              // This prevents double rendering when the slider changed the value.
              if (
                sourceInfo.source === "event" &&
                Number(values.value) != roundedValue
              ) {
                // We don't clamp to max to allow large values for users that want them
                // Clamping to minimum is good to avoid things like dividing by 0
                setFormValue(Math.max(min, Number(values.value)));
              }
            }}
          />
          {prefix && (
            <InputGroupAddon>
              {typeof prefix === "function" ? prefix(roundedValue) : prefix}
            </InputGroupAddon>
          )}
          {suffix && (
            <InputGroupAddon align={"inline-end"}>
              {typeof suffix === "function" ? suffix(roundedValue) : suffix}
            </InputGroupAddon>
          )}
        </InputGroup>
        {showSlider && !disabled && (
          <Slider
            id={`slider-${name}`}
            value={[roundedValue]}
            onValueChange={([value]) => setFormValue(value)}
            min={min}
            max={max}
            step={step}
          />
        )}
        {description && <FieldDescription>{description}</FieldDescription>}
      </Field>
    );
  },
);

export const MoneyField = memo((props: NumberFieldProps) => {
  return <NumberField prefix={"$"} decimalPlaces={0} {...props} />;
});

export const PercentField = memo((props: NumberFieldProps) => {
  return <NumberField suffix={"%"} decimalPlaces={2} {...props} />;
});

type BooleanFieldProps = {
  name: string;
  label: string;
  description?: string;
};

export const BooleanField = memo((props: BooleanFieldProps) => {
  const { formData, setFormData } = useContext(FormContext);
  const formValue = useMemo(() => formData[props.name], [formData[props.name]]);
  const setFormValue = useCallback(
    (value: boolean) => {
      setFormData((currentFormData: FormData) => ({
        ...currentFormData,
        [props.name]: value,
      }));
    },
    [setFormData, props.name],
  );

  return (
    <BooleanFieldInner
      {...props}
      formValue={formValue}
      setFormValue={setFormValue}
    />
  );
});

export const BooleanFieldInner = memo(
  ({
    name,
    label,
    description,
    formValue,
    setFormValue,
  }: BooleanFieldProps & {
    formValue: boolean;
    setFormValue: (value: boolean) => void;
  }) => {
    return (
      <Field orientation={"horizontal"}>
        <FieldLabel>{label}</FieldLabel>
        <Switch
          name={name}
          checked={formValue}
          onCheckedChange={(isChecked) => {
            setFormValue(isChecked);
          }}
        />
        {description && <FieldDescription>{description}</FieldDescription>}
      </Field>
    );
  },
);
