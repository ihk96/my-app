import { useMemo, useState } from "react";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { cn } from "~/lib/utils";

export type RecurrenceUnit = "day" | "week" | "month";

export type RecurrenceRule = {
  unit: RecurrenceUnit;
  interval: number;
  /** unit === "week" 일 때 사용. 0=일 ~ 6=토 */
  weekdays: number[];
  /** unit === "month" 일 때 사용. 1~31 (그 달에 없는 날짜는 마지막 날로 당김) */
  monthDays: number[];
  /** yyyy-MM-dd */
  startDate: string;
};

export type CareItemFormValue = {
  name: string;
  /** asNeeded: 수시, recurring: 주기 */
  type: "asNeeded" | "recurring";
  recurrence: RecurrenceRule;
};

const unitOptions: { value: RecurrenceUnit; label: string }[] = [
  { value: "day", label: "일" },
  { value: "week", label: "주" },
  { value: "month", label: "월" },
];

const weekdayLabels = ["일", "월", "화", "수", "목", "금", "토"];

/** 주 단위는 4주를 넘는 주기를 쓸 일이 거의 없어서 상한을 둔다. */
const maxInterval: Record<RecurrenceUnit, number> = { day: 365, week: 4, month: 24 };

function toDateKey(date: Date) {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, "0");
  const d = `${date.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function parseDateKey(key: string) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

function lastDayOfMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function diffInDays(from: Date, to: Date) {
  return Math.round((to.getTime() - from.getTime()) / 86400000);
}

function startOfWeek(date: Date) {
  const result = new Date(date);
  result.setDate(result.getDate() - result.getDay());
  return result;
}

const defaultValue: CareItemFormValue = {
  name: "",
  type: "asNeeded",
  recurrence: {
    unit: "week",
    interval: 1,
    weekdays: [new Date().getDay()],
    monthDays: [new Date().getDate()],
    startDate: toDateKey(new Date()),
  },
};

/** 규칙이 실제로 어떤 주기인지 사람이 읽을 수 있는 문장으로 만든다. */
export function formatRecurrence(rule: RecurrenceRule) {
  const { unit, interval, weekdays, monthDays } = rule;

  if (unit === "day") {
    return interval === 1 ? "매일 반복" : `${interval}일마다 반복`;
  }

  if (unit === "week") {
    const prefix = interval === 1 ? "매주" : interval === 2 ? "격주" : `${interval}주마다`;
    if (weekdays.length === 0) return `${prefix} 반복 (요일을 선택해 주세요)`;
    const days = [...weekdays].sort((a, b) => a - b).map((day) => weekdayLabels[day]).join("·");
    return `${prefix} ${days}요일에 반복`;
  }

  const prefix = interval === 1 ? "매월" : `${interval}개월마다`;
  if (monthDays.length === 0) return `${prefix} 반복 (날짜를 선택해 주세요)`;
  const days = [...monthDays].sort((a, b) => a - b).map((day) => `${day}일`).join("·");
  const hasClamped = monthDays.some((day) => day > 28);
  return `${prefix} ${days}에 반복${hasClamped ? " (해당 날짜가 없는 달은 마지막 날)" : ""}`;
}

function matchesRule(rule: RecurrenceRule, start: Date, date: Date) {
  const { unit, interval, weekdays, monthDays } = rule;

  if (unit === "day") {
    return diffInDays(start, date) % interval === 0;
  }

  if (unit === "week") {
    const weekIndex = Math.round(diffInDays(startOfWeek(start), startOfWeek(date)) / 7);
    return weekIndex % interval === 0 && weekdays.includes(date.getDay());
  }

  const monthIndex =
    (date.getFullYear() - start.getFullYear()) * 12 + (date.getMonth() - start.getMonth());
  if (monthIndex % interval !== 0) return false;

  // 31일처럼 그 달에 없는 날짜는 마지막 날로 당겨서 매칭한다.
  const last = lastDayOfMonth(date.getFullYear(), date.getMonth());
  return monthDays.some((day) => Math.min(day, last) === date.getDate());
}

/** 오늘(또는 시작일) 이후로 가장 먼저 오는 날짜. 없으면 null */
export function nextOccurrence(rule: RecurrenceRule, from = new Date()) {
  const start = parseDateKey(rule.startDate);
  if (Number.isNaN(start.getTime()) || rule.interval < 1) return null;

  const cursor = new Date(Math.max(start.getTime(), parseDateKey(toDateKey(from)).getTime()));
  for (let i = 0; i < 800; i += 1) {
    if (matchesRule(rule, start, cursor)) return new Date(cursor);
    cursor.setDate(cursor.getDate() + 1);
  }
  return null;
}

function formatDateLabel(date: Date) {
  return `${date.getMonth() + 1}월 ${date.getDate()}일 (${weekdayLabels[date.getDay()]})`;
}

type CareItemFormProps = {
  value?: CareItemFormValue;
  onChange?: (value: CareItemFormValue) => void;
};

export default function CareItemForm({ value: controlled, onChange }: CareItemFormProps) {
  const [internal, setInternal] = useState<CareItemFormValue>(controlled ?? defaultValue);
  const value = controlled ?? internal;

  const update = (patch: Partial<CareItemFormValue>) => {
    const next = { ...value, ...patch };
    setInternal(next);
    onChange?.(next);
  };

  const updateRecurrence = (patch: Partial<RecurrenceRule>) => {
    update({ recurrence: { ...value.recurrence, ...patch } });
  };

  const { unit, interval, weekdays, monthDays, startDate } = value.recurrence;

  // 기준을 두 개 이상 고르면 간격은 1로 고정한다. ("격주 월·수요일"은 해석이 애매해서 아예 막는다)
  const selectedBaseCount =
    unit === "week" ? weekdays.length : unit === "month" ? monthDays.length : 0;
  const intervalLocked = selectedBaseCount > 1;

  const preview = useMemo(() => {
    const sentence = formatRecurrence(value.recurrence);
    const next = nextOccurrence(value.recurrence);
    return next ? `${sentence} · 다음 ${formatDateLabel(next)}` : sentence;
  }, [value.recurrence]);

  const toggleWeekday = (day: number) => {
    const next = weekdays.includes(day)
      ? weekdays.filter((d) => d !== day)
      : [...weekdays, day].sort((a, b) => a - b);
    updateRecurrence({ weekdays: next, interval: next.length > 1 ? 1 : interval });
  };

  const toggleMonthDay = (day: number) => {
    const next = monthDays.includes(day)
      ? monthDays.filter((d) => d !== day)
      : [...monthDays, day].sort((a, b) => a - b);
    updateRecurrence({ monthDays: next, interval: next.length > 1 ? 1 : interval });
  };

  const changeUnit = (nextUnit: RecurrenceUnit) => {
    updateRecurrence({ unit: nextUnit, interval: Math.min(interval, maxInterval[nextUnit]) });
  };

  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="care-item-name">항목 이름</FieldLabel>
        <Input
          id="care-item-name"
          type="text"
          value={value.name}
          onChange={(e) => update({ name: e.target.value })}
          placeholder="예) 산책, 발톱 깎기"
        />
      </Field>

      <Field>
        <FieldLabel>유형</FieldLabel>
        <ToggleGroup
          variant="outline"
          value={[value.type]}
          onValueChange={(next) => {
            const picked = next[0] as CareItemFormValue["type"] | undefined;
            if (picked) update({ type: picked });
          }}
        >
          <ToggleGroupItem value="asNeeded">수시</ToggleGroupItem>
          <ToggleGroupItem value="recurring">주기</ToggleGroupItem>
        </ToggleGroup>
        <FieldDescription>
          수시는 정해진 주기 없이 기록만 남기고,<br/>주기는 반복 일정을 만듭니다.
        </FieldDescription>
      </Field>

      {value.type === "recurring" && (
        <>
          <Field>
            <FieldLabel htmlFor="care-item-interval">반복 간격</FieldLabel>
            <div className="flex gap-2">
              <Input
                id="care-item-interval"
                type="number"
                min={1}
                max={maxInterval[unit]}
                disabled={intervalLocked}
                value={interval}
                onChange={(e) => {
                  const parsed = Number(e.target.value);
                  if (!Number.isFinite(parsed)) return;
                  updateRecurrence({
                    interval: Math.min(Math.max(Math.trunc(parsed), 1), maxInterval[unit]),
                  });
                }}
                className="w-24"
              />
              <Select
                items={unitOptions}
                value={unit}
                onValueChange={(next) => changeUnit(next as RecurrenceUnit)}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {unitOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}마다
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            {intervalLocked && (
              <FieldDescription>
                {unit === "week" ? "요일을" : "날짜를"} 두 개 이상 고르면 간격은 1로 고정됩니다.
              </FieldDescription>
            )}
          </Field>

          {unit === "week" && (
            <Field>
              <FieldLabel>반복 요일</FieldLabel>
              <div className="flex gap-1">
                {weekdayLabels.map((label, day) => (
                  <button
                    key={label}
                    type="button"
                    aria-pressed={weekdays.includes(day)}
                    onClick={() => toggleWeekday(day)}
                    className={cn(
                      "size-9 rounded-full border text-sm transition-colors",
                      weekdays.includes(day)
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-input text-muted-foreground hover:bg-accent"
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </Field>
          )}

          {unit === "month" && (
            <Field>
              <FieldLabel>반복 날짜</FieldLabel>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                  <button
                    key={day}
                    type="button"
                    aria-pressed={monthDays.includes(day)}
                    onClick={() => toggleMonthDay(day)}
                    className={cn(
                      "h-9 rounded-md border text-sm transition-colors",
                      monthDays.includes(day)
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-input text-muted-foreground hover:bg-accent"
                    )}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </Field>
          )}

          <Field>
            <FieldLabel htmlFor="care-item-start">시작일</FieldLabel>
            <Input
              id="care-item-start"
              type="date"
              value={startDate}
              onChange={(e) => updateRecurrence({ startDate: e.target.value })}
            />
            <FieldDescription>
              {unit === "day"
                ? "이 날짜를 기준으로 간격을 계산합니다."
                : "이 날짜부터 반복을 시작합니다."}
            </FieldDescription>
          </Field>

          <div className="rounded-lg bg-muted/60 px-3 py-2 text-sm text-muted-foreground">
            {preview}
          </div>
        </>
      )}
    </FieldGroup>
  );
}
