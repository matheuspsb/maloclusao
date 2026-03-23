import { createBrowserRouter } from "react-router"

import PublicLayout from "@/layouts/public-layout"
import AppLayout from "@/layouts/app-layout"

import HomePage from "@/pages/home"
import LoginPage from "@/pages/login"
import ThemePage from "@/pages/theme"
import DashboardPage from "@/pages/dashboard"
import NotFoundPage from "@/pages/not-found"

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/theme", element: <ThemePage /> },
    ],
  },
  {
    path: "/app",
    element: <AppLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      // { path: "pacientes", element: <PacientesPage /> },
    ],
  },
  {
    path: "*",
    element: <PublicLayout />,
    children: [{ path: "*", element: <NotFoundPage /> }],
  },
])
