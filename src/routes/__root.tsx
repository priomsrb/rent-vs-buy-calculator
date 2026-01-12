import * as React from "react";

import { DarkModeToggle } from "@/components/DarkModeToggle.tsx";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Outlet, createRootRoute } from "@tanstack/react-router";

// import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

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
