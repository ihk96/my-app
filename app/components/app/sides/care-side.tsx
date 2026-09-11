import { format, subDays } from "date-fns";
import { useState } from "react";

import { Panel, Row, RowGroup, SectionTitle } from "../screen";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { CardContent } from "~/components/ui/card";
import { DrawerPage } from "~/components/ui/drawer-page";
import CareItemDetailPage, { type CareItem } from "./care-item-detail";
import CareItemSidePage from "./care-item-side";
import { ChevronLeft, Pencil } from "lucide-react";

/** 목업 기록 시각. 화면을 볼 때마다 "오늘/어제"가 맞게 보이도록 오늘 기준으로 만든다. */
function loggedAt(daysAgo: number, time: string) {
	return `${format(subDays(new Date(), daysAgo), "yyyy-MM-dd")} ${time}`;
}

const today = format(new Date(), "yyyy-MM-dd");

const CARE_LOG: CareItem[] = [
	{
		media: "🦗",
		title: "급여",
		description: "오늘 예정 · 격일",
		badge: { label: "대기", className: "bg-warning-muted text-warning" },
		type: "recurring",
		recurrence: {
			unit: "day",
			interval: 2,
			weekdays: [],
			monthDays: [],
			startDate: format(subDays(new Date(), 30), "yyyy-MM-dd"),
		},
		logs: [
			{ id: "feed-1", loggedAt: loggedAt(2, "19:10"), memo: "귀뚜라미 3마리" },
			{ id: "feed-2", loggedAt: loggedAt(4, "19:30"), memo: "귀뚜라미 2마리" },
			{ id: "feed-3", loggedAt: loggedAt(6, "18:50") },
			{ id: "feed-4", loggedAt: loggedAt(8, "19:05"), memo: "잘 먹음" },
			{ id: "feed-5", loggedAt: loggedAt(12, "19:00") },
		],
	},
	{
		media: "💧",
		title: "분무",
		description: "수시  · [마지막] 오늘 07:20",
		badge: { label: "기록", className: "bg-success-muted text-success" },
		type: "asNeeded",
		logs: [
			{ id: "mist-1", loggedAt: `${today} 07:20` },
			{ id: "mist-2", loggedAt: loggedAt(1, "07:40"), memo: "습도 60%" },
			{ id: "mist-3", loggedAt: loggedAt(2, "08:00") },
			{ id: "mist-4", loggedAt: loggedAt(3, "07:30") },
		],
	},
	{
		media: "🍂",
		title: "탈피",
		description: "수시 · [마지막] 25.09.01",
		badge: { label: "기록", className: "bg-muted text-muted-foreground" },
		type: "asNeeded",
		logs: [
			{ id: "shed-1", loggedAt: loggedAt(10, "09:00"), memo: "꼬리 끝 남음" },
			{ id: "shed-2", loggedAt: loggedAt(38, "10:20") },
		],
	},
	{
		media: "🧹​",
		title: "청소",
		description: "수시 · [마지막] 어제 20:37",
		badge: { label: "기록", className: "bg-muted text-muted-foreground" },
		type: "asNeeded",
		logs: [
			{ id: "clean-1", loggedAt: loggedAt(1, "20:37"), memo: "바닥재 교체" },
			{ id: "clean-2", loggedAt: loggedAt(9, "21:10") },
		],
	},
];

/**
 * 항목 한 줄 + 그 항목의 상세 페이지.
 * 열림 상태를 줄마다 따로 들어야 해서 목록에서 컴포넌트로 분리한다.
 */
function CareItemRow({ item }: { item: CareItem }) {
	const [open, setOpen] = useState(false);

	return (
		<>
			<Row
				onClick={() => setOpen(true)}
				media={item.media}
				title={item.title}
				description={item.description}
				trailing={
					<Badge className={item.badge.className}>{item.badge.label}</Badge>
				}
			/>
			<DrawerPage
				open={open}
				onOpenChange={setOpen}
				title={item.title}
        action={(
          <DrawerPage
            trigger={
              <Button variant="secondary" size="icon-sm">
                <Pencil />
              </Button>
            }
            title="돌봄 항목 수정"
            description={`${item.title} 항목을 수정합니다.`}
          >
            <CareItemSidePage />
          </DrawerPage>
        )}
			>
				<CareItemDetailPage item={item} />
			</DrawerPage>
		</>
	);
}

export default function CareSidePage(){
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <SectionTitle
          aside={
            <DrawerPage
              trigger={<Button size={"xs"} variant={"ghost"}>추가</Button>}
              title="돌봄 항목 추가"
              description="새로운 돌봄 항목을 추가합니다."
            >
              <CareItemSidePage/>
            </DrawerPage>

          }
        >
          돌봄 항목
        </SectionTitle>
        <Panel>
          <CardContent className="flex flex-col gap-3">
            <RowGroup>
              {CARE_LOG.map((item) => (
                <CareItemRow key={item.title} item={item} />
              ))}
            </RowGroup>
          </CardContent>
        </Panel>
      </div>
    </div>
  );
}
