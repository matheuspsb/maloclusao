import { createBrowserRouter } from "react-router"

import PublicLayout from "@/layouts/public-layout"
import AppLayout from "@/layouts/app-layout"

import HomePage from "@/pages/home"
import LoginPage from "@/pages/login"
import DashboardPage from "@/pages/dashboard"
import PatientsPage from "@/pages/patients"
import PatientDetailPage from "@/pages/patient-detail"
import NotFoundPage from "@/pages/not-found"

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/login", element: <LoginPage /> },
    ],
  },
  {
    path: "/app",
    element: <AppLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "pacientes", element: <PatientsPage /> },
      { path: "pacientes/:id", element: <PatientDetailPage /> },
    ],
  },
  {
    path: "*",
    element: <PublicLayout />,
    children: [{ path: "*", element: <NotFoundPage /> }],
  },
])
