import { ChevronRight } from "lucide-react";

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
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { CardContent } from "~/components/ui/card";

const BUDGET = { spent: 1_284_300, total: 1_600_000, daysLeft: 27 };

const TODOS = [
	{
		media: "🦎",
		title: "레오 습도 58%",
		description: "목표 65–75% · 분무 필요",
		badge: { label: "낮음", className: "bg-warning-muted text-warning" },
	},
	{
		media: "🧻",
		title: "화장지 2롤 남음",
		description: "주 3롤 소비 · 5일 내 소진",
		badge: { label: "주문", className: "bg-destructive/10 text-destructive" },
	},
	{
		media: "💳",
		title: "미분류 결제 3건",
		description: "카테고리 지정 대기",
		badge: { label: "분류", className: "bg-muted text-muted-foreground" },
	},
];

const RECENT = [
	{ media: "🛒", title: "이마트 장보기", description: "오늘 18:42 · 식비", amount: "-42,900", tone: "text-destructive" },
	{ media: "🦗", title: "듀비아 100마리 입고", description: "어제 · 반려동물", amount: "+100", tone: "text-muted-foreground" },
	{ media: "💡", title: "전기요금 자동이체", description: "9월 1일 · 공과금", amount: "-38,120", tone: "text-destructive" },
];

const won = (n: number) => `₩${n.toLocaleString("ko-KR")}`;

export default function AppHome() {
	const remaining = BUDGET.total - BUDGET.spent;
	const usedPercent = Math.round((BUDGET.spent / BUDGET.total) * 100);

	return (
		<Screen>
			<ScreenHeader
				title="오늘의 살림"
				subtitle="9월 3일 목요일 · 처리할 일 3"
				action={
					<Avatar className="size-9">
						<AvatarFallback className="text-[11px]">IHK</AvatarFallback>
					</Avatar>
				}
			/>

			<Panel>
				<CardContent className="flex flex-col gap-3">
					<SectionTitle aside={`예산 ${won(BUDGET.total)}`}>9월 지출</SectionTitle>
					<div>
						<p className="text-3xl font-semibold tracking-tight tabular-nums">
							{won(BUDGET.spent)}
						</p>
						<p className="mt-1 text-xs text-muted-foreground tabular-nums">
							남은 예산 {won(remaining)} · 잔여 {BUDGET.daysLeft}일
						</p>
					</div>
					<Meter value={usedPercent} tone="warning" />
				</CardContent>
			</Panel>

			<div className="grid grid-cols-3 gap-2">
				<StatTile label="재고 부족" value="4" hint="7일 내 소진" tone="warning" />
				<StatTile label="이번 주 지출" value="₩186K" hint="-12%" tone="success" />
				<StatTile label="돌봄 일정" value="2" hint="오늘" />
			</div>

			<Panel>
				<CardContent className="flex flex-col gap-3">
					<SectionTitle
						aside={
							<span className="flex items-center gap-0.5">
								전체 <ChevronRight className="size-3" />
							</span>
						}
					>
						바로 처리
					</SectionTitle>
					<RowGroup>
						{TODOS.map((todo) => (
							<Row
								key={todo.title}
								media={todo.media}
								title={todo.title}
								description={todo.description}
								trailing={
									<Badge className={todo.badge.className}>
										{todo.badge.label}
									</Badge>
								}
							/>
						))}
					</RowGroup>
				</CardContent>
			</Panel>

			<Panel>
				<CardContent className="flex flex-col gap-3">
					<SectionTitle>최근 기록</SectionTitle>
					<RowGroup>
						{RECENT.map((item) => (
							<Row
								key={item.title}
								media={item.media}
								title={item.title}
								description={item.description}
								trailing={
									<span className={`text-sm font-medium tabular-nums ${item.tone}`}>
										{item.amount}
									</span>
								}
							/>
						))}
					</RowGroup>
				</CardContent>
			</Panel>
		</Screen>
	);
}

