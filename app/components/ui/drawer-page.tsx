import { cn } from "~/lib/utils";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "./drawer";
import { Drawer as DrawerPrimitive } from "@base-ui/react/drawer"
import { Button } from "./button";
import { ArrowLeft, ChevronLeft } from "lucide-react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { ScrollArea } from "./scroll-area";


const DrawerPageContext = createContext<{ setPageCount: React.Dispatch<React.SetStateAction<number>> } | undefined>(undefined);

export function DrawerPage({
  className,
  children,
  trigger,
  open,
  action,
  onOpenChange,
  ...props
}: {
  trigger?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  action?: React.ReactNode;
} &DrawerPrimitive.Popup.Props) {
  const [isOpen, setIsOpen] = useState(open);
  const parent = useContext(DrawerPageContext);
  const [nestedPages, setNestedPages] = useState(0);

  useEffect(() => {
    onOpenChange?.(isOpen ?? false);
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(open ?? false);
  }, [open]);

  useEffect(() => {
    if (!parent || !isOpen) return;
    parent.setPageCount(c=>c+1);
    return () => {
      parent.setPageCount(c=>c-1);
    };
  }, [parent, isOpen]);
  
  const ctx = useMemo(() => ({ setPageCount: setNestedPages }), []);

  return (
    <DrawerPageContext.Provider value={ctx}>
      <Drawer swipeDirection="right" 
              open={isOpen} 
              onOpenChange={setIsOpen}
      >
        {trigger && <DrawerTrigger>{trigger}</DrawerTrigger>}
        
        <DrawerContent className={cn(
            "h-screen! w-screen! rounded-none! bg-background m-0! data-ending-style:duration-800", className,
            "data-nested-drawer-open:brightness-70 [--stack-step:0] [--peek:0px]",
            "data-nested-drawer-open:*:data-[slot=drawer-content]:opacity-100!",
            "data-nested-drawer-open:not-data-nested-drawer-page-open:*:data-[slot=drawer-content]:blur-sm!"
          )} 
          data-nested-drawer-page-open={nestedPages > 0 ? "" : undefined}
          {...props}>
          <div className="min-h-0 overflow-auto">
            <DrawerHeader className="pb-2 flex justify-between flex-row items-start fixed top-0 w-full backdrop-blur-xs pt-[1rem]">
              <div>
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
              </div>
              {action && <div>{action}</div>}
            </DrawerHeader>
            <div className="pb-8 pt-14 px-4">
              {children}
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </DrawerPageContext.Provider>
  );
}