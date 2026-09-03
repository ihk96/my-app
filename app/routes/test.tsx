import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "~/components/ui/drawer";
import { DrawerPageContent } from "~/components/ui/drawer-page";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "~/components/ui/sheet";

export default function Test() {

    return (
        <div className="flex flex-col gap-4">
            this is test
            <Link to="/" viewTransition>
                go home
            </Link>
            <Drawer swipeDirection="right" >
                <DrawerTrigger render={<Button variant="outline" />}>Open</DrawerTrigger>
                <DrawerPageContent>
                    <DrawerHeader>
                        <DrawerTitle>Are you absolutely sure?</DrawerTitle>
                        <DrawerDescription>This action cannot be undone.</DrawerDescription>
                    </DrawerHeader>
                    <div className="p-4">
                        <Drawer swipeDirection="right">
                            <DrawerTrigger render={<Button variant="outline" />}>Open</DrawerTrigger>
                            <DrawerContent className="w-screen rounded-none!">
                                <DrawerHeader>
                                    <DrawerTitle>Are you absolutely sure?</DrawerTitle>
                                    <DrawerDescription>This action cannot be undone.</DrawerDescription>
                                </DrawerHeader>
                                <div className="p-4">{/* Content here */}</div>
                                <DrawerFooter>
                                    <Button>Submit</Button>
                                    <DrawerClose render={<Button variant="outline" />}>Cancel</DrawerClose>
                                </DrawerFooter>
                            </DrawerContent>
                        </Drawer>


                    </div>
                    <DrawerFooter>
                        <Button>Submit</Button>
                        <DrawerClose render={<Button variant="outline" />}>Cancel</DrawerClose>
                    </DrawerFooter>
                </DrawerPageContent>
            </Drawer>
        </div>
    )
}