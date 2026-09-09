import { Plus } from "lucide-react";

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
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { CardContent } from "~/components/ui/card";

const PETS = ["레오", "모카"];

const WEIGHT_SERIES = [48.3, 49.1, 50.0, 50.6, 51.7, 52.4];

const CARE_LOG = [
	{
		media: "🦗",
		title: "급여 · 듀비아 3마리",
		description: "오늘 예정 · 격일",
		badge: { label: "대기", className: "bg-warning-muted text-warning" },
	},
	{
		media: "💧",
		title: "분무",
		description: "오늘 07:20 완료",
		badge: { label: "완료", className: "bg-success-muted text-success" },
	},
	{
		media: "🍂",
		title: "탈피",
		description: "8월 28일 · 전신 정상",
		badge: { label: "기록", className: "bg-muted text-muted-foreground" },
	},
	{
		media: "🩺",
		title: "정기 검진",
		description: "10월 12일 예약",
		badge: { label: "예정", className: "bg-muted text-muted-foreground" },
	},
];

export default function PetsHome() {
	return (
		<Screen>
			<ScreenHeader
				title="반려동물"
				subtitle="2마리 · 오늘 할 일 2"
				action={
					<Button size="icon-sm" variant="secondary" aria-label="반려동물 추가">
						<Plus />
					</Button>
				}
			/>

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

			<div className="flex items-center gap-3 rounded-2xl bg-accent px-4 py-3.5 text-accent-foreground">
				<div className="flex size-13 shrink-0 items-center justify-center rounded-xl bg-card text-2xl">
					🦎
				</div>
				<div className="min-w-0">
					<p className="font-heading text-base font-semibold">레오</p>
					<p className="mt-0.5 truncate text-xs opacity-80">
						크레스티드 게코 · 2년 4개월 · 수컷
					</p>
				</div>
			</div>

			<Panel>
				<CardContent className="flex flex-col gap-3">
					<SectionTitle aside="10분 전">사육장 환경</SectionTitle>
					<div className="grid grid-cols-3 gap-2">
						<StatTile label="온도" value="27.4°" hint="정상" tone="success" />
						<StatTile label="습도" value="58%" hint="목표 65↑" tone="warning" />
						<StatTile label="UVB" value="122일" hint="교체 180일" />
					</div>
					<div className="flex flex-col gap-1.5">
						<div className="flex items-baseline justify-between text-xs text-muted-foreground">
							<span>야간 습도 유지율</span>
							<span className="tabular-nums">61%</span>
						</div>
						<Meter value={61} tone="warning" />
					</div>
				</CardContent>
			</Panel>

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

			<Panel>
				<CardContent className="flex flex-col gap-3">
					<SectionTitle aside="전체">돌봄 기록</SectionTitle>
					<RowGroup>
						{CARE_LOG.map((entry) => (
							<Row
								key={entry.title}
								media={entry.media}
								title={entry.title}
								description={entry.description}
								trailing={
									<Badge className={entry.badge.className}>
										{entry.badge.label}
									</Badge>
								}
							/>
						))}
					</RowGroup>
				</CardContent>
			</Panel>
		</Screen>
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
