import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs.tsx";
import _ from "lodash";
import type { EnrichedSimulationParams } from "@/calculation/EnrichedSimulationParams.tsx";
import { formatMoney } from "@/utils/formatMoney.ts";
import { cn } from "@/lib/utils.ts";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion.tsx";

type StringFunction = (params: EnrichedSimulationParams) => string;
type StringOrFunction = string | StringFunction;

type ProCon = {
  title: StringOrFunction;
  description: StringOrFunction;
};

type ProsAndConsListType = {
  pros: ProCon[];
  cons: ProCon[];
  myths: ProCon[];
};

const owningProsAndCons: ProsAndConsListType = {
  pros: [
    {
      title: "Can stay long term",
      description: `As an owner, you can't be forced out by a landlord. This has benefits like:
      - Building roots
      - Not having to change schools for kids
      - Fewer hassles of moving
      `,
    },
    {
      title: "Can make changes",
      description: `You can paint walls, add rooms and modify your house to your liking.`,
    },
  ],
  cons: [
    {
      title: "Moving is expensive and difficult",
      description: (params: EnrichedSimulationParams) =>
        `With each move, you'll need to pay stamp duty, agent fees, etc. This can amount to ${formatMoney(params.buyMovingCostsFirstYear)} per move.
        
        In addition, you may need to line up the buying/selling of your new/old place so that they happen at the same time. Otherwise you'll need to pay for a temporary residence or a bridging loan.
        `,
    },
    {
      title: "Need to handle maintenance yourself",
      description: `If anything breaks or needs replacement, you'll have to pay for, or fix it yourself. This includes small things like appliances breaking, roof replacements and structural issues.`,
    },
  ],
  myths: [],
};

const rentingProsAndCons: ProsAndConsListType = {
  pros: [],
  cons: [],
  myths: [],
};

interface ProsAndConsListProps {
  prosAndCons: ProsAndConsListType;
  simulationParams: EnrichedSimulationParams;
}

function ProsAndConsList(props: {
  proCons: ProCon[];
  simulationParams: EnrichedSimulationParams;
  backgroundColor?: string;
}) {
  function getString(stringOrFunction: StringOrFunction) {
    if (_.isFunction(stringOrFunction)) {
      return stringOrFunction(props.simulationParams);
    } else {
      return stringOrFunction;
    }
  }

  return (
    <Accordion type="single" collapsible>
      {props.proCons.map((proCon, index) => (
        <AccordionItem
          key={index}
          value={`item-${index}`}
          className={cn(props.backgroundColor, "mb-2 rounded-xl border-none")}
        >
          <AccordionTrigger
            className={"cursor-pointer p-4 text-lg hover:no-underline"}
          >
            {getString(proCon.title)}
          </AccordionTrigger>
          <AccordionContent className={"px-6 pb-4 whitespace-pre-line"}>
            {getString(proCon.description)}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

function ProsAndConsSection({
  prosAndCons,
  simulationParams,
}: ProsAndConsListProps) {
  function Heading({ children }: React.PropsWithChildren) {
    return <h3 className={"mt-6 mb-2 text-xl"}>{children}</h3>;
  }

  return (
    <div>
      <Heading>Pros</Heading>
      <ProsAndConsList
        proCons={prosAndCons?.pros}
        simulationParams={simulationParams}
        backgroundColor={"bg-positive-background"}
      />
      <Heading>Cons</Heading>
      <ProsAndConsList
        proCons={prosAndCons?.cons}
        simulationParams={simulationParams}
        backgroundColor={"bg-negative-background"}
      />
      {prosAndCons.myths.length > 0 && (
        <>
          <Heading>Myths</Heading>
          <ProsAndConsList
            proCons={prosAndCons?.myths}
            simulationParams={simulationParams}
            backgroundColor={"bg-color-negative-background"}
          />
        </>
      )}
    </div>
  );
}

interface ProsAndConsProps {
  simulationParams: EnrichedSimulationParams;
}

function ProsAndCons({ simulationParams }: ProsAndConsProps) {
  return (
    <div className={"p-5"}>
      <h2 className={"mb-4 text-center text-3xl"}>Pros/Cons of</h2>
      <Tabs defaultValue="owning" className="w-full">
        <TabsList className={"self-center"}>
          <TabsTrigger value="owning">Owning</TabsTrigger>
          <TabsTrigger value="renting">Renting</TabsTrigger>
        </TabsList>
        <TabsContent value="owning">
          <ProsAndConsSection
            prosAndCons={owningProsAndCons}
            simulationParams={simulationParams}
          />
        </TabsContent>
        <TabsContent value="renting">
          <ProsAndConsSection
            prosAndCons={rentingProsAndCons}
            simulationParams={simulationParams}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default ProsAndCons;
