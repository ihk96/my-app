import { HomeIcon, Package, PawPrint, Wallet } from "lucide-react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

export default function App(){

    return (
        <div className="w-screen h-screen flex flex-col">
            <div className="flex-1">
                <Outlet />
            </div>
            <div className="h-14">
                <AppFooter />    
            </div>
        </div>
    )
    
}



function AppFooter(){

    return (
        <div className="w-full h-full flex justify-around border-t pt-1">
            
            <AppFooterNavigation 
                icon={<HomeIcon className="size-6 text-muted-foreground" />}
                to="/app"
            />
            <AppFooterNavigation 
                icon={<Wallet className="size-6 text-muted-foreground" />}
                to="/app/balance"
            />
            <AppFooterNavigation 
                icon={<Package className="size-6 text-muted-foreground" />}
                to="/app/inventory"
            />
            <AppFooterNavigation 
                icon={<PawPrint className="size-6 text-muted-foreground" />}
                to="/app/pets"
            />
        </div>
    )
}

function AppFooterNavigation(props: { icon: React.ReactNode, to: string }){
    const navigate = useNavigate();
    const location = useLocation();
    const isActive = location.pathname.endsWith(props.to);

    return (
        <Button variant={"ghost"} 
                className={cn("h-10 w-16", isActive && "bg-muted")}
                onClick={() => {
                    navigate(props.to);
                }}
        >
            {props.icon}
        </Button>
    )
}