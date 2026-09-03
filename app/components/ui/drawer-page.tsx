import { cn } from "~/lib/utils";
import { DrawerContent } from "./drawer";
import { Drawer as DrawerPrimitive } from "@base-ui/react/drawer"

export function DrawerPageContent({
  className,
  children,
  ...props
}: DrawerPrimitive.Popup.Props) {
    return (
        <DrawerContent className={cn("w-screen! rounded-none!", className)} {...props}>
            {children}
        </DrawerContent>
    );
}