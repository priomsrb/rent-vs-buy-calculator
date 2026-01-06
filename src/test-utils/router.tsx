import React from "react";
import { render, type RenderOptions } from "vitest-browser-react";
import {
  createRouter,
  createRootRoute,
  createRoute,
  RouterProvider,
  Outlet,
} from "@tanstack/react-router";
import { createMemoryHistory } from "@tanstack/react-router";
import { ThemeProvider } from "@/components/ThemeProvider";

// Create a root route for testing
const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

// Test router factory
export function createTestRouter(routes: any[], initialLocation = "/") {
  const routeTree = rootRoute.addChildren(routes);

  const router = createRouter({
    routeTree,
    history: createMemoryHistory({
      initialEntries: [initialLocation],
    }),
  });

  return router;
}

// Custom render function with router
interface RenderWithRouterOptions extends Omit<RenderOptions, "wrapper"> {
  router?: any;
  initialLocation?: string;
  routes?: any[];
}

export async function renderWithRouter(
  ui: React.ReactElement,
  {
    router: providedRouter,
    initialLocation = "/",
    routes = [],
    ...renderOptions
  }: RenderWithRouterOptions = {},
) {
  let router = providedRouter;

  if (!router) {
    // Create a test route that renders the UI element
    const testRoute = createRoute({
      getParentRoute: () => rootRoute,
      path: "/",
      component: () => ui,
    });

    const allRoutes = [testRoute, ...routes];
    router = createTestRouter(allRoutes, initialLocation);
  }

  return {
    ...(await render(
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>,
      renderOptions,
    )),
    router,
  };
}
