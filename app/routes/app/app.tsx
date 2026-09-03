import { HomeIcon, Package, PawPrint, Wallet } from "lucide-react";
import { NavLink, Outlet } from "react-router";

import { cn } from "~/lib/utils";

export default function App() {
  return (
    <div className="flex h-dvh w-full flex-col bg-background text-foreground">
      <main className="min-h-0 flex-1 overflow-y-auto pt-[env(safe-area-inset-top)]">
        <Outlet />
      </main>
      <AppFooter />
    </div>
  );
}

const TABS = [
  { to: "/app", label: "홈", icon: HomeIcon, end: true },
  { to: "/app/balance", label: "가계부", icon: Wallet },
  { to: "/app/inventory", label: "재고", icon: Package },
  { to: "/app/pets", label: "반려동물", icon: PawPrint },
] as const;

function AppFooter() {
  return (
    <nav className="flex shrink-0 items-center justify-around border-t bg-card px-2 pt-1.5 pb-[max(env(safe-area-inset-bottom),0.5rem)]">
      {TABS.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={"end" in tab ? tab.end : false}
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center gap-1 rounded-lg px-4 py-1.5 text-[11px] transition-colors",
              isActive
                ? "bg-accent font-medium text-primary"
                : "text-muted-foreground"
            )
          }
        >
          <tab.icon className="size-5" />
          {tab.label}
        </NavLink>
      ))}
    </nav>
  );
}
