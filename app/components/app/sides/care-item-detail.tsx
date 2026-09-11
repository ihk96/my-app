import {
  differenceInCalendarDays,
  format,
  isSameDay,
  isSameMonth,
  parse,
} from "date-fns";
import { ko } from "date-fns/locale";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

import { Panel, Row, RowGroup, SectionTitle, StatTile } from "../screen";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import { CardContent } from "~/components/ui/card";
import { DrawerPage } from "~/components/ui/drawer-page";
import { cn } from "~/lib/utils";
import CareItemSidePage from "./care-item-side";
import {
  formatRecurrence,
  nextOccurrence,
  type RecurrenceRule,
} from "./care-item-form";
import { CareLogDrawer } from "./care-log-form";

export type CareLog = {
  id: string;
  /** yyyy-MM-dd HH:mm */
  loggedAt: string;
  memo?: string;
};

export type CareItem = {
  media: React.ReactNode;
  title: string;
  description: string;
  badge: { label: string; className: string };
  /** asNeeded: 수시, recurring: 주기 */
  type: "asNeeded" | "recurring";
  /** type === "recurring" 일 때만 있다. */
  recurrence?: RecurrenceRule;
  logs: CareLog[];
};

function parseLoggedAt(loggedAt: string) {
  return parse(loggedAt, "yyyy-MM-dd HH:mm", new Date());
}

/** "오늘 07:20", "어제 20:37", "3일 전" 처럼 사람이 읽는 간격으로 바꾼다. */
function formatRelativeDay(date: Date, base = new Date()) {
  const diff = differenceInCalendarDays(base, date);
  if (diff === 0) return "오늘";
  if (diff === 1) return "어제";
  if (diff === -1) return "내일";
  if (diff > 0) return `${diff}일 전`;
  return `${-diff}일 후`;
}

export default function CareItemDetailPage({ item }: { item: CareItem }) {
  const [logOpen, setLogOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(undefined);
  const [month, setMonth] = useState(new Date());

  const logs = useMemo(
    () =>
      item.logs
        .map((log) => ({ ...log, date: parseLoggedAt(log.loggedAt) }))
        .sort((a, b) => b.date.getTime() - a.date.getTime()),
    [item.logs]
  );

  const lastLog = logs[0];
  const thisMonthCount = logs.filter((log) => isSameMonth(log.date, new Date()))
    .length;
  const next = item.recurrence ? nextOccurrence(item.recurrence) : null;

  // 달력에서 하루를 고르면 그 날 기록만 본다. 다시 누르면 전체로 돌아온다.
  const visibleLogs = selectedDay
    ? logs.filter((log) => isSameDay(log.date, selectedDay))
    : logs;

  // 같은 달 기록은 하나의 묶음으로 묶어서 소제목을 한 번만 보여준다.
  const groups = useMemo(() => {
    const result: { label: string; logs: typeof visibleLogs }[] = [];
    for (const log of visibleLogs) {
      const label = format(log.date, "yyyy년 M월", { locale: ko });
      const current = result[result.length - 1];
      if (current?.label === label) current.logs.push(log);
      else result.push({ label, logs: [log] });
    }
    return result;
  }, [visibleLogs]);

  return (
    <div className="flex flex-col gap-4">
      <Panel>
        <CardContent className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-muted text-2xl">
              {item.media}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-heading text-base font-semibold">
                {item.title}
              </p>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                {item.recurrence
                  ? formatRecurrence(item.recurrence)
                  : "수시 · 정해진 주기 없음"}
              </p>
            </div>
            <Badge className={item.badge.className}>{item.badge.label}</Badge>
          </div>

          <div
            className={cn(
              "grid gap-2",
              item.type === "recurring" ? "grid-cols-3" : "grid-cols-2"
            )}
          >
            <StatTile
              label="마지막 기록"
              value={lastLog ? formatRelativeDay(lastLog.date) : "없음"}
              hint={lastLog ? format(lastLog.date, "HH:mm") : undefined}
            />
            {item.type === "recurring" ? (
              <StatTile
                label="다음 예정"
                value={next ? formatRelativeDay(next) : "없음"}
                hint={
                  next
                    ? format(next, "M월 d일 (E)", { locale: ko })
                    : undefined
                }
                tone={
                  next && differenceInCalendarDays(new Date(), next) >= 0
                    ? "warning"
                    : "default"
                }
              />
            ) : null}
            <StatTile
              label="이번 달"
              value={`${thisMonthCount}회`}
              hint={`누적 ${logs.length}회`}
            />
          </div>

          <Button onClick={() => setLogOpen(true)}>
            <Plus data-icon="inline-start" />
            지금 기록하기
          </Button>
        </CardContent>
      </Panel>

      <div className="flex flex-col gap-1">
        <SectionTitle
          aside={
            selectedDay ? (
              <Button
                size="xs"
                variant="ghost"
                onClick={() => setSelectedDay(undefined)}
              >
                전체 보기
              </Button>
            ) : undefined
          }
        >
          기록 달력
        </SectionTitle>
        <Panel>
          <CardContent>
            <Calendar
              className="w-full"
              locale={ko}
              mode="single"
              selected={selectedDay}
              onSelect={setSelectedDay}
              month={month}
              onMonthChange={setMonth}
              modifiers={{ logged: logs.map((log) => log.date) }}
              modifiersClassNames={{
                logged:
                  "after:pointer-events-none after:absolute after:bottom-1 after:left-1/2 after:size-1 after:-translate-x-1/2 after:rounded-full after:bg-primary after:content-['']",
              }}
            />
          </CardContent>
        </Panel>
      </div>

      <div className="flex flex-col gap-1">
        <SectionTitle
          aside={
            selectedDay
              ? format(selectedDay, "M월 d일", { locale: ko })
              : `${logs.length}건`
          }
        >
          기록 내역
        </SectionTitle>
        <Panel>
          <CardContent className="flex flex-col gap-3">
            {groups.length === 0 ? (
              <p className="py-6 text-center text-xs text-muted-foreground">
                {selectedDay
                  ? "이 날은 기록이 없어요."
                  : "아직 남긴 기록이 없어요."}
              </p>
            ) : (
              groups.map((group) => (
                <div key={group.label} className="flex flex-col gap-2">
                  <p className="text-[11px] font-medium text-muted-foreground">
                    {group.label}
                  </p>
                  <RowGroup>
                    {group.logs.map((log) => (
                      <Row
                        key={log.id}
                        media={
                          <div className="flex flex-col items-center leading-none">
                            <span className="text-sm font-semibold tabular-nums text-foreground">
                              {format(log.date, "d")}
                            </span>
                            <span className="mt-0.5 text-[10px]">
                              {format(log.date, "E", { locale: ko })}
                            </span>
                          </div>
                        }
                        title={format(log.date, "HH:mm")}
                        description={log.memo ?? "메모 없음"}
                        trailing={
                          <span className="text-xs text-muted-foreground">
                            {formatRelativeDay(log.date)}
                          </span>
                        }
                      />
                    ))}
                  </RowGroup>
                </div>
              ))
            )}
          </CardContent>
        </Panel>
      </div>
      <CareLogDrawer
        title={`돌봄 기록 · ${item.title}`}
        description={item.description}
        open={logOpen}
        onOpenChange={setLogOpen}
      />
    </div>
  );
}
