import { Link } from "@tanstack/react-router";
import {
  House as HouseIcon,
  ChartNoAxesCombined as ChartIcon,
} from "lucide-react";

import { ClickableCard } from "../ui/ClickableCard";
import { DarkModeToggle } from "@/components/DarkModeToggle.tsx";
import { useEffect } from "react";

export function Welcome() {
  useEffect(() => {
    // Remove previous form data
    localStorage.removeItem("formData");
  });

  return (
    <>
      <div className="flex h-full w-full flex-col items-center justify-center p-10 text-center">
        <DarkModeToggle />
        <p className="mb-0 text-2xl font-bold text-gray-500">Own or Rent?</p>
        <h1 className="my-8 text-5xl font-extrabold md:text-6xl">
          The Sydney Showdown
        </h1>
        <div className={"my-8 flex gap-8"}>
          <HouseIcon size={80} />
          <ChartIcon size={80} />
        </div>
        <h2 className="my-8 text-2xl">
          Discover the true cost of buying vs renting and investing in Sydney.
        </h2>
        <div className="my-10">
          <Link to={"/start"} draggable={false}>
            <ClickableCard className={"px-10 text-4xl"}>
              Get started
            </ClickableCard>
          </Link>
        </div>
      </div>
    </>
  );
}
