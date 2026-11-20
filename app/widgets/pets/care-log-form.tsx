import { format } from "date-fns";
import { useEffect, useState } from "react";

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

  useEffect(() => {
    console.log(format(new Date(), "yyyy-MM-dd"));
  }, []);

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
            max={format(new Date(), "yyyy-MM-dd")}
            onChange={(e) => {
              if(e.target.value > format(new Date(), "yyyy-MM-dd")) return;
              update({ date: e.target.value });
            }}
            className={dateInputClassName}
          />
          <Input
            required
            id="care-log-time"
            type="time"
            value={value.time}
            max={format(new Date(), "HH:mm")}
            onChange={(e) => {
              if(e.target.value > format(new Date(), "HH:mm")) return;
              update({ time: e.target.value })
            }}
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
