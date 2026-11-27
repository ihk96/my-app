import { Plus } from "lucide-react";

import {
	Meter,
	Row,
	RowGroup,
	Screen,
	ScreenHeader,
	Panel,
	SectionTitle,
} from "~/components/app/screen";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { CardContent } from "~/components/ui/card";
import { cn } from "~/lib/utils";

const WEEKLY = [
	{ label: "1주", ratio: 44 },
	{ label: "2주", ratio: 71 },
	{ label: "3주", ratio: 58 },
	{ label: "4주", ratio: 92 },
	{ label: "이번", ratio: 36, current: true },
];

const FILTERS = ["전체", "식비", "공과금", "반려동물", "생활용품"];

const CATEGORIES = [
	{ name: "식비", amount: 412_000, percent: 32 },
	{ name: "공과금", amount: 241_600, percent: 19 },
	{ name: "반려동물", amount: 138_500, percent: 11 },
	{ name: "생활용품", amount: 96_200, percent: 7 },
];

const TODAY = [
	{ media: "🛒", title: "이마트", description: "식비 · 카드", amount: "-42,900" },
	{ media: "☕", title: "스타벅스 강남", description: "식비 · 카드", amount: "-5,800" },
	{ media: "🦗", title: "파충류샵 듀비아", description: "반려동물 · 계좌", amount: "-32,320" },
];

const won = (n: number) => `₩${n.toLocaleString("ko-KR")}`;

export default function BalanceHome() {
	return (
		<Screen>
			<ScreenHeader
				title="가계부"
				subtitle="2026년 9월"
				action={
					<Button size="icon-sm" variant="secondary" aria-label="내역 추가">
						<Plus />
					</Button>
				}
			/>

			<Panel>
				<CardContent className="flex flex-col gap-3">
					<SectionTitle aside="4주 평균 ₩312K">주별 지출</SectionTitle>
					<div className="flex h-20 items-end gap-2">
						{WEEKLY.map((week) => (
							<div key={week.label} className="flex h-full flex-1 flex-col justify-end gap-1.5">
								<div
									className={cn(
										"w-full rounded-t-[6px] rounded-b-[3px]",
										week.current ? "bg-primary" : "bg-muted"
									)}
									style={{ height: `${week.ratio}%` }}
								/>
								<span className="text-center text-[10px] text-muted-foreground">
									{week.label}
								</span>
							</div>
						))}
					</div>
					<p className="text-xs text-muted-foreground tabular-nums">
						이번 주 ₩186,400 · 지난주 대비{" "}
						<span className="font-medium text-success">-12%</span>
					</p>
				</CardContent>
			</Panel>

			<div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
				{FILTERS.map((filter, index) => (
					<Badge
						key={filter}
						variant={index === 0 ? "default" : "outline"}
						className="h-7 shrink-0 px-3 text-xs"
					>
						{filter}
					</Badge>
				))}
			</div>

			<Panel>
				<CardContent className="flex flex-col gap-3.5">
					<SectionTitle aside="9월">카테고리</SectionTitle>
					{CATEGORIES.map((category) => (
						<div key={category.name} className="flex flex-col gap-1.5">
							<div className="flex items-baseline justify-between text-sm">
								<span className="font-medium">{category.name}</span>
								<span className="text-xs text-muted-foreground tabular-nums">
									{won(category.amount)} · {category.percent}%
								</span>
							</div>
							<Meter value={category.percent} />
						</div>
					))}
				</CardContent>
			</Panel>

			<div className="flex flex-col gap-2">
				<SectionTitle aside="-81,020">9월 3일</SectionTitle>
				<Panel>
					<CardContent>
						<RowGroup>
							{TODAY.map((item) => (
								<Row
									key={item.title}
									media={item.media}
									title={item.title}
									description={item.description}
									trailing={
										<span className="text-sm font-medium text-destructive tabular-nums">
											{item.amount}
										</span>
									}
								/>
							))}
						</RowGroup>
					</CardContent>
				</Panel>
			</div>
		</Screen>
	);
}
