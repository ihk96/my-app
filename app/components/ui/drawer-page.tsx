import { cn } from "~/lib/utils";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "./drawer";
import { Drawer as DrawerPrimitive } from "@base-ui/react/drawer"
import { Button } from "./button";
import { ArrowLeft, ChevronLeft } from "lucide-react";
import { useState } from "react";



export function DrawerPage({
  className,
  children,
  trigger,
  ...props
}: {
  trigger: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
} &DrawerPrimitive.Popup.Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Drawer swipeDirection="right" 
            open={isOpen} 
            onOpenChange={setIsOpen}
    >
      <DrawerTrigger>{trigger}</DrawerTrigger>
      <DrawerContent className={cn("w-screen! rounded-none! bg-background", className)} {...props}>
        <DrawerHeader>
          <DrawerTitle>
            <div className="flex items-center gap-2">
              <Button variant={"secondary"} 
                      className={"size-6"} 
                      size="icon"
                      onClick={() => setIsOpen(false)}
              >
                <ChevronLeft className="size-4" />
              </Button>
              {props.title}
            </div>
          </DrawerTitle>
          <DrawerDescription>{props.description}</DrawerDescription>
        </DrawerHeader>
        <div className="p-4">
          {children}
        </div>
      </DrawerContent>
    </Drawer>
      
  );
}