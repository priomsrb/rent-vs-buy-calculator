import { useState } from "react";

import { Link } from "@tanstack/react-router";

import { Button } from "../../ui/button";

export function Explain() {
  const [step, setStep] = useState(1);

  const CurrentStep = getViewForStep(step);

  return (
    <div className={"flex w-full justify-center"}>
      <div className="md:w-350 flex-col items-center justify-center p-10 text-center">
        <CurrentStep />
        <StepNavigation step={step} setStep={setStep} />
      </div>
    </div>
  );
}

const STEPS = [Step1, Step2];

function StepNavigation({
  step,
  setStep,
}: {
  step: number;
  setStep: (step: number) => void;
}) {
  return (
    <div className="flex justify-between w-full">
      {step === 1 ? (
        <Link to={"/start"} draggable={false}>
          <Button>Exit</Button>
        </Link>
      ) : (
        <Button onClick={() => setStep(step - 1)}>Back</Button>
      )}
      {step < STEPS.length && (
        <Button onClick={() => setStep(step + 1)}>Next</Button>
      )}
      {step >= STEPS.length && (
        <Link to={"/start"} draggable={false}>
          <Button>Finish</Button>
        </Link>
      )}
    </div>
  );
}

function getViewForStep(step: number) {
  return STEPS[step - 1];
}

function Step1() {
  return (
    <div className="text-left">
      <p>Imagine there are 2 people. They both:</p>
      <ul className="list-disc list-inside">
        <li>Have the same income</li>
        <li>Choose to live in identical looking homes</li>
      </ul>
      <p>One decides to buy</p>
      <p>One decides to rent</p>
      <p>Let's see who comes out ahead</p>
    </div>
  );
}

function Step2() {
  return (
    <div className="text-left">
      <p>First, let's take a look at a renters yearly expenses</p>
    </div>
  );
}
