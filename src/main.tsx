import { enableMapSet } from "immer";
enableMapSet();
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import '@/index.css'
import { HomePage } from '@/pages/HomePage'
import { StallMenuPage } from "@/pages/StallMenuPage";
import { AdminPage } from "@/pages/AdminPage";
import { AboutPage } from "@/pages/AboutPage";
import { AppLayout } from "@/components/AppLayout";
const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/stalls/:stallId",
        element: <StallMenuPage />,
      },
      {
        path: "/admin",
        element: <AdminPage />,
      },
      {
        path: "/about",
        element: <AboutPage />,
      },
    ],
  },
]);
// Do not touch this code
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  </StrictMode>,
)