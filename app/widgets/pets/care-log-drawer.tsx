import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "~/components/ui/drawer";
import CareLogForm, { createCareLogFormValue, type CareLogFormValue } from "./care-log-form";

export type CareLogDrawerProps = {
  title: React.ReactNode;
  description?: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (value: CareLogFormValue) => void;
};

/**
 * 기록 폼을 담는 하단 시트. 목록 Row에서도, 상세 화면의 "지금 기록하기"에서도
 * 같은 화면이 떠야 해서 시트째로 공용으로 둔다.
 */
export default function CareLogDrawer({
  title,
  description,
  open,
  onOpenChange,
  onSubmit,
}: CareLogDrawerProps) {
  const [value, setValue] = useState<CareLogFormValue>(createCareLogFormValue);

  return (
    <Drawer
      open={open}
      onOpenChange={(next) => {
        // 닫을 때마다 "지금"으로 되돌려서, 다시 열면 방금 시각이 들어와 있게 한다.
        if (!next) setValue(createCareLogFormValue());
        onOpenChange(next);
      }}
      showSwipeHandle
      swipeDirection="down"
    >
      <DrawerContent className="mb-8 pb-4">
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          {description ? (
            <DrawerDescription>{description}</DrawerDescription>
          ) : null}
        </DrawerHeader>
        <div className="scroll-fade flex-1 overflow-y-auto p-4">
          <CareLogForm value={value} onChange={setValue} />
        </div>
        <DrawerFooter>
          <p>돌봄 기록을 남기시겠습니까?</p>
          <Button
            onClick={() => {
              onSubmit?.(value);
              onOpenChange(false);
            }}
          >
            기록 남기기
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
