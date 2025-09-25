import { Card, CardContent } from "../ui/card";
import { House, Building, type LucideIcon } from "lucide-react";

export function PropertyTypePicker() {
  return (
    <>
      <div className="flex h-full w-full flex-col items-center justify-center bg-slate-100 p-10 text-center">
        <h1>Sydney Buy vs Rent Calculator</h1>
        <p className="text-gray-500">
          Compare the financial outcomes of buying vs renting in Sydney
        </p>
        <h2 className="mb-8">Choose a type of property</h2>
        <div className="flex w-full flex-col gap-8 md:flex-row">
          <PropertyTypeCard name="Unit" Icon={Building} color={"blue"} />
          <PropertyTypeCard name="House" Icon={House} color={"green"} />
        </div>
      </div>
    </>
  );
}

type ProperTypeCardProps = {
  name: string;
  Icon: LucideIcon;
  color: string;
};

function PropertyTypeCard({ name, Icon, color }: ProperTypeCardProps) {
  return (
    // <Card className="relative cursor-pointer shadow-2xl transition hover:scale-110">
    <Card className="flex-1 cursor-pointer transition hover:scale-[1.01] hover:shadow-lg active:scale-[0.98] active:shadow-sm active:inset-shadow-sm">
      <CardContent className="flex flex-col items-center justify-center">
        <div
          className="h-15 w-15 overflow-hidden rounded-full border-2 border-white/70"
          style={{ backgroundColor: color, color }}
        >
          <div className="flex h-full w-full items-center justify-center bg-background/80">
            {<Icon size={32}></Icon>}
          </div>
        </div>
        <p className="text-2xl">{name}</p>
      </CardContent>
    </Card>
  );
}
