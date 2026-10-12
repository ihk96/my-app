import type { AxiosError } from "axios";
import { HomeIcon, Package, PawPrint, Wallet } from "lucide-react";
import { NavLink, Outlet, redirect, replace, useLoaderData } from "react-router";
import { useMemo } from "react";

import { cn } from "~/lib/utils";
import users from "~/services/users";
import { useContext, useEffect } from "react";
import { useAppState } from "~/stores/app-state";
import { Spinner } from "~/components/ui/spinner";
import type { Route } from "./+types/app";
import families from "~/services/families";

export async function clientLoader({}: Route.ClientLoaderArgs) {
  const user = await users.me()
    .then(res=>res.data);

  const userFamilies = await families.getMyFamilies()
    .then(res => res.data);

  if(!userFamilies || userFamilies.length === 0){
    return redirect("/new-family");
  }

  const primaryFamily = await families.getMyPrimaryFamily()
    .then(res => res.data);

  return {
    user,
    userFamilies,
    primaryFamily
  }
}


export default function App({loaderData}:Route.ComponentProps) {
  const {user} = loaderData;
  const {user : app_user, setUser} = useAppState();

  useEffect(()=>{
    if(user){
      setUser(user);
    }
  },[user])
  
	return (
    <div className="fixed top-0 h-screen w-screen bg-black">
      <div className="flex h-full w-full flex-col bg-background text-foreground">
        {app_user ? 
          (
            <>
              <main className="min-h-0 flex-1 overflow-auto pt-[env(safe-area-inset-top)]">
                <Outlet />
              </main>
              <AppFooter />
            </>
          )
          :
          (
            <div>
              <Spinner />
            </div>
          )
        }
        
      </div>
    </div>
	);
}

function AppFooter() {
  
  const {user} = useAppState();
  const isAdmin = user?.is_admin;

  const tabs = useMemo(() => {

    const t = [
      { to: "/app", label: "홈", icon: HomeIcon, end: true },
      { to: "/app/balance", label: "가계부", icon: Wallet },
      { to: "/app/inventory", label: "재고", icon: Package },
      { to: "/app/pets", label: "반려동물", icon: PawPrint },
    ];

    return t;
  }
  , [isAdmin]);

	return (
		<nav className="flex w-screen shrink-0 items-center justify-around border-t bg-card px-2 pt-1.5 pb-[calc(env(safe-area-inset-bottom)+0.5rem)]">
			{tabs.map((tab) => (
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



