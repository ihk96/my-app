import { Plus } from "lucide-react";
import { useState } from "react";
import Fi from "zod/v4/locales/fi.cjs";

import {
  Meter,
  Row,
  RowGroup,
  Screen,
  ScreenHeader,
  Panel,
  SectionTitle,
  StatTile,
} from "~/components/app/screen";
import CareSidePage from "~/components/app/sides/care-side";
import { CareLogDrawer } from "~/components/app/sides/care-log-form";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { CardContent } from "~/components/ui/card";
import { DrawerPage } from "~/components/ui/drawer-page";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";

const PETS = ["도봉이", "꼬미", "도봉", "도봉", "도봉", "도봉", "도봉"];

const WEIGHT_SERIES = [48.3, 49.1, 50.0, 50.6, 51.7, 52.4];

const CARE_LOG = [
  {
    media: "🦗",
    title: "급여",
    description: "오늘 예정 · 격일",
    badge: { label: "대기", className: "bg-warning-muted text-warning" },
  },
  {
    media: "💧",
    title: "분무",
    description: "수시  · [마지막] 오늘 07:20",
    badge: { label: "기록", className: "bg-success-muted text-success" },
  },
  {
    media: "🍂",
    title: "탈피",
    description: "수시 · [마지막] 25.09.01",
    badge: { label: "기록", className: "bg-muted text-muted-foreground" },
  },
  {
    media: "🧹​",
    title: "청소",
    description: "수시 · [마지막] 어제 20:37",
    badge: { label: "기록", className: "bg-muted text-muted-foreground" },
  },
];

export default function PetsHome() {
  return (
    <Screen>
      <ScreenHeader
        title="반려동물"
      // subtitle="2마리 · 오늘 할 일 2"
      // action={
      // 	<Button size="icon-sm" variant="secondary" aria-label="반려동물 추가">
      // 		<Plus />
      // 	</Button>
      // }
      />

      <div className="flex flex-col gap-1">
        <SectionTitle
          aside={
            <DrawerPage
              trigger={<Button size={"xs"} variant={"ghost"}>전체</Button>}
              title="돌봄 기록"
            // description="전체 돌봄 기록을 확인하세요"
            >
              <CareSidePage />
            </DrawerPage>

          }
        >
          돌봄 기록
        </SectionTitle>
        <Panel>
          <CardContent className="flex flex-col gap-3">
            <RowGroup>
              {CARE_LOG.map((entry) => (
                <CareLogRow key={entry.title} entry={entry} />
              ))}
            </RowGroup>
          </CardContent>
        </Panel>
      </div>

      <div className="flex justify-between gap-2">
        <ScrollArea className={"flex-1 min-w-0"}>
          <div className="flex gap-2">
            {PETS.map((pet, index) => (
              <Badge
                key={pet}
                variant={index === 0 ? "default" : "outline"}
                className="h-7 px-3 text-xs"
              >
                {pet}
              </Badge>
            ))}
          </div>
          <ScrollBar className={"-bottom-2.5! absolute border-t-4!"} orientation="horizontal" />
        </ScrollArea>
        <Button className={"shrink-0"} size="icon-sm" variant="secondary" aria-label="반려동물 추가">
          <Plus />
        </Button>
      </div>

      <div className="flex items-center gap-3 rounded-2xl bg-accent px-4 py-3.5 text-accent-foreground">
        <div className="flex size-13 shrink-0 items-center justify-center rounded-xl bg-card text-2xl">
          🦎
        </div>
        <div className="min-w-0">
          <p className="font-heading text-base font-semibold">도봉이</p>
          <p className="mt-0.5 truncate text-xs opacity-80">
            크레스티드 게코 · 2년 4개월 · 수컷
          </p>
        </div>
      </div>

      <Panel>
        <CardContent className="flex flex-col gap-3">
          <SectionTitle aside="최근 6주">체중</SectionTitle>
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-3xl font-semibold tracking-tight tabular-nums">
                52.4
                <span className="ml-1 text-sm font-medium">g</span>
              </p>
              <p className="mt-1 text-xs font-medium text-success tabular-nums">
                6주간 +4.1 g
              </p>
            </div>
            <WeightSparkline series={WEIGHT_SERIES} />
          </div>
        </CardContent>
      </Panel>

    </Screen>
  );
}

/** 돌봄 기록 한 줄. 시트 열림 상태를 줄마다 따로 들어야 해서 컴포넌트로 분리한다. */
function CareLogRow({ entry }: { entry: (typeof CARE_LOG)[number] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Row
        onClick={() => setOpen(true)}
        media={entry.media}
        title={entry.title}
        description={entry.description}
        trailing={
          <Badge className={entry.badge.className}>{entry.badge.label}</Badge>
        }
      />
      <CareLogDrawer
        title={`돌봄 기록 · ${entry.title}`}
        description={entry.description}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}

/** 최근 6주 체중을 한 줄로 보여주는 스파크라인. 끝점만 강조한다. */
function WeightSparkline({ series }: { series: number[] }) {
  const width = 128;
  const height = 52;
  const padding = 6;
  const min = Math.min(...series);
  const max = Math.max(...series);
  const span = max - min || 1;

  const points = series.map((value, index) => {
    const x = padding + (index * (width - padding * 2)) / (series.length - 1);
    const y = height - padding - ((value - min) / span) * (height - padding * 2);
    return [x, y] as const;
  });

  const last = points[points.length - 1];

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={`체중 추이 ${min}g에서 ${max}g`}
      className="shrink-0"
    >
      <polyline
        points={points.map(([x, y]) => `${x},${y}`).join(" ")}
        fill="none"
        stroke="var(--primary)"
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={last[0]} cy={last[1]} r={3.4} fill="var(--primary)" />
    </svg>
  );
}
