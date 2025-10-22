import * as React from "react";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { ThemeProvider } from "@/components/ThemeProvider";
// import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <React.Fragment>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Outlet />
        {/*<TanStackRouterDevtools />*/}
      </ThemeProvider>
    </React.Fragment>
  );
}
