import { cn } from "~/lib/utils";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "./drawer";
import { Drawer as DrawerPrimitive } from "@base-ui/react/drawer"



export function DrawerPage({
  className,
  children,
  trigger,
  ...props
}: {
  trigger: React.ReactNode;
  title: React.ReactNode;
  description: React.ReactNode;
} &DrawerPrimitive.Popup.Props) {
    return (
      <Drawer swipeDirection="right">
        <DrawerTrigger>{trigger}</DrawerTrigger>
        <DrawerContent className={cn("w-screen! rounded-none!", className)} {...props}>
          <DrawerHeader>
            <DrawerTitle>{props.title}</DrawerTitle>
            <DrawerDescription>{props.description}</DrawerDescription>
          </DrawerHeader>
          {children}
        </DrawerContent>
      </Drawer>
        
    );
}