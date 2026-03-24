import { LayoutDashboard, Users } from "lucide-react";

export const navigationItems = [
  { to: "/app", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/app/pacientes", icon: Users, label: "Pacientes" },
]