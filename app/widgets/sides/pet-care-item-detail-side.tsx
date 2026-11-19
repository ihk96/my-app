import {
  differenceInCalendarDays,
  format,
  isSameDay,
  isSameMonth,
  parse,
} from "date-fns";
import { ko } from "date-fns/locale";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Panel, Row, RowGroup, SectionTitle, StatTile } from "~/components/app/screen";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import { CardContent } from "~/components/ui/card";
import { DrawerPage } from "~/components/ui/drawer-page";
import { cn } from "~/lib/utils";
import {
  formatRecurrence,
  nextOccurrence,
  type RecurrenceRule,
} from "../pets/care-item-form";
import { CareLogDrawer } from "../pets/care-log-form";
import type { z } from "zod/v4";
import pets, { PetCareItemResponseData, PetCareItemSummaryResponseData, PetCareLogResponseData } from "~/lib/api/pets";
import { convertLocalDateTimeString, sameDay, weekdayStringToNumber } from "~/lib/date-utils";


/** "오늘 07:20", "어제 20:37", "3일 전" 처럼 사람이 읽는 간격으로 바꾼다. */
function formatRelativeDay(date: Date, base = new Date()) {
  const diff = differenceInCalendarDays(base, date);
  if (diff === 0) return "오늘";
  if (diff === 1) return "어제";
  if (diff === -1) return "내일";
  if (diff > 0) return `${diff}일 전`;
  return `${-diff}일 후`;
}

export default function PetPetCareItemDetailSidePage({ 
  pet_care_item
}: { 
  pet_care_item: z.infer<typeof PetCareItemResponseData>
}) {
  const [logs, setLogs] = useState<z.infer<typeof PetCareLogResponseData>[]>([]);
  const [summary, setSummary] = useState<z.infer<typeof PetCareItemSummaryResponseData> | undefined>(undefined);

  const [logOpen, setLogOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(undefined);
  const [month, setMonth] = useState(new Date());

  useEffect(() => {
    fetchCareLogs();
    pets.getPetCareItemSummary(pet_care_item.id).then(res => setSummary(res.data));
  }, [pet_care_item]);

  function fetchCareLogs(){
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), 1, 0, 0, 0, 0);
    let end = new Date();
    end.setMonth(today.getMonth() + 1);
    end.setDate(1);
    end.setHours(0,0,0,0);
    
    pets.getPetCareItemLogs(pet_care_item.id, convertLocalDateTimeString(start), convertLocalDateTimeString(end)).then(res => {
      setLogs(res.data.sort((a, b) => b.performed_at.localeCompare(a.performed_at)));
    });
  }

  const lastLog = summary?.last_care_log;
  const thisMonthCount = logs.length;

  // 달력에서 하루를 고르면 그 날 기록만 본다. 다시 누르면 전체로 돌아온다.
  const visibleLogs = selectedDay
    ? logs.filter((log) => isSameDay(log.performed_at, selectedDay))
    : logs;

  // 같은 달 기록은 하나의 묶음으로 묶어서 소제목을 한 번만 보여준다.
  const groups = useMemo(() => {
    const result: { label: string; logs: typeof visibleLogs }[] = [];
    for (const log of visibleLogs) {
      const label = format(log.performed_at, "yyyy년 M월", { locale: ko });
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
              {pet_care_item?.emoji}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-heading text-base font-semibold">
                {pet_care_item?.name}
              </p>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                {pet_care_item?.cycle
                  ? formatRecurrence({
                    interval: pet_care_item.cycle?.interval,
                    unit: pet_care_item.cycle?.interval_type == "AfterDays" ? "day" : pet_care_item.cycle?.interval_type == "Weeks" ? "week" : "month",
                    weekdays: pet_care_item.cycle?.weekdays?.map(weekdayStringToNumber) ?? [],
                    monthDays: pet_care_item.cycle?.monthdays ?? [],
                    startDate: pet_care_item.cycle?.start_date,
                  })
                  : "수시 · 정해진 주기 없음"}
              </p>
            </div>
            {/* <Badge className={item.badge.className}>{item.badge.label}</Badge> */}
          </div>

          <div
            className={cn(
              "grid gap-2",
              pet_care_item?.cycle_type === "Regular" ? "grid-cols-3" : "grid-cols-2"
            )}
          >
            <StatTile
              label="마지막 기록"
              value={lastLog ? formatRelativeDay(new Date(lastLog.performed_at)) : "없음"}
              hint={lastLog ? format(lastLog.performed_at, "HH:mm") : undefined}
            />
            {pet_care_item?.cycle_type === "Regular" ? (
              <StatTile
                label="다음 예정"
                value={summary?.next_care_date ? formatRelativeDay(new Date(summary.next_care_date)) : "없음"}
                hint={
                  summary?.next_care_date
                    ? format(new Date(summary.next_care_date), "M월 d일 (E)", { locale: ko })
                    : undefined
                }
                tone={
                  summary?.next_care_date && differenceInCalendarDays(new Date(), new Date(summary.next_care_date)) >= 0
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
              modifiers={{ logged: logs.map((log) => new Date(log.performed_at)) }}
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
                              {format(new Date(log.performed_at), "d")}
                            </span>
                            <span className="mt-0.5 text-[10px]">
                              {format(new Date(log.performed_at), "E", { locale: ko })}
                            </span>
                          </div>
                        }
                        title={format(new Date(log.performed_at), "HH:mm")}
                        description={log.memo ?? "메모 없음"}
                        trailing={
                          <span className="text-xs text-muted-foreground">
                            {formatRelativeDay(new Date(log.performed_at))}
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
      { pet_care_item && (
        <CareLogDrawer
          title={`돌봄 기록 · ${pet_care_item?.name}`}
          description={careRowDescription({
            cycle_type: pet_care_item.cycle_type,
            last_care_at: lastLog?.performed_at,
            interval: pet_care_item.cycle?.interval,
            interval_type: pet_care_item.cycle?.interval_type,
          })}
          open={logOpen}
          onOpenChange={setLogOpen}
        />
      )}
    </div>
  );
}


function careRowDescription(item: {
  cycle_type: string;
  last_care_at?: string;
  interval?: number;
  interval_type?: string;
}) {
  let description = "";

  description += item.cycle_type === "Anytime" ? "수시" : "주기";

  let lastDate = item.last_care_at ? new Date(item.last_care_at) : undefined;

  if(item.cycle_type === "Regular") {
    if(item.interval && item.interval_type) {
      description += ` · ${item.interval}${item.interval_type === "AfterDays" ? "일" : item.interval_type === "Weeks" ? "주" : "개월"}`;
    }
  }
  
  if(lastDate) {
    if(sameDay(lastDate, new Date())) {
      description += " · [마지막] 오늘 " + lastDate.toTimeString().substring(0,5);
    } else {
      description += " · [마지막] " + lastDate.toLocaleDateString().substring(2,12).replaceAll(' ','');
    }
  }

  return description;
}