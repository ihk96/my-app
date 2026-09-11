import { format } from "date-fns";
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
import { Field, FieldGroup, FieldLabel } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";

export type CareLogFormValue = {
  /** yyyy-MM-dd */
  date: string;
  /** HH:mm */
  time: string;
  memo: string;
};

/** 기본값은 항상 "지금"이다. 기록은 대부분 방금 한 일을 남기는 거라서. */
export function createCareLogFormValue(base = new Date()): CareLogFormValue {
  return {
    date: format(base, "yyyy-MM-dd"),
    time: format(base, "HH:mm"),
    memo: "",
  };
}

const dateInputClassName =
  "text-sm appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none";

type CareLogFormProps = {
  value?: CareLogFormValue;
  onChange?: (value: CareLogFormValue) => void;
};

/** 돌봄 기록 한 건을 남기는 입력부. 날짜·시간·메모만 받는다. */
export default function CareLogForm({
  value: controlled,
  onChange,
}: CareLogFormProps) {
  const [internal, setInternal] = useState<CareLogFormValue>(
    controlled ?? createCareLogFormValue()
  );
  const value = controlled ?? internal;

  const update = (patch: Partial<CareLogFormValue>) => {
    const next = { ...value, ...patch };
    setInternal(next);
    onChange?.(next);
  };

  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="care-log-date">
          날짜<span className="text-destructive">*</span>
        </FieldLabel>
        <div className="flex gap-2">
          <Input
            required
            id="care-log-date"
            type="date"
            value={value.date}
            onChange={(e) => update({ date: e.target.value })}
            className={dateInputClassName}
          />
          <Input
            required
            id="care-log-time"
            type="time"
            value={value.time}
            onChange={(e) => update({ time: e.target.value })}
            className={dateInputClassName}
          />
        </div>
      </Field>
      <Field>
        <FieldLabel htmlFor="care-log-memo">기록</FieldLabel>
        <Textarea
          id="care-log-memo"
          value={value.memo}
          onChange={(e) => update({ memo: e.target.value })}
          placeholder="돌봄 기록을 입력하세요"
        />
      </Field>
    </FieldGroup>
  );
}

type CareLogDrawerProps = {
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
export function CareLogDrawer({
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
      <DrawerContent className="pb-4">
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
