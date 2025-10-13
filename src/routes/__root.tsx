import * as React from "react";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { ThemeProvider } from "@/components/ThemeProvider";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { DarkModeToggle } from "@/components/DarkModeToggle.tsx";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <React.Fragment>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <DarkModeToggle />
        <Outlet />
        {/*<TanStackRouterDevtools />*/}
      </ThemeProvider>
    </React.Fragment>
  );
}
