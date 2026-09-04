import { AlertTriangle, Minus, Plus, Search, SlidersHorizontal } from "lucide-react";

import {
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

const FILTERS = [
    { label: "전체", count: 38 },
    { label: "욕실", count: 9 },
    { label: "주방", count: 12 },
    { label: "세탁", count: 6 },
    { label: "반려동물", count: 11 },
];

const RUNNING_OUT = [
    {
        media: "🧻",
        title: "3겹 화장지",
        description: "주 3롤 · 9월 8일 소진",
        stock: "2롤",
        className: "bg-destructive/10 text-destructive",
    },
    {
        media: "🧴",
        title: "주방세제 리필",
        description: "월 1개 · 9월 11일 소진",
        stock: "1개",
        className: "bg-warning-muted text-warning",
    },
    {
        media: "🦗",
        title: "듀비아 (중)",
        description: "주 12마리 · 9월 12일 소진",
        stock: "21마리",
        className: "bg-warning-muted text-warning",
    },
];

const BATHROOM = [
    { media: "🪥", title: "칫솔모", description: "3개월마다 교체", quantity: 4 },
    { media: "🧼", title: "바디워시", description: "11월 소진 예상", quantity: 2 },
    { media: "👁️", title: "렌즈 세척액", description: "10월 4일 소진 예상", quantity: 3 },
];

export default function InventoryHome() {
    return (
        <Screen>
            <ScreenHeader
                title="재고"
                subtitle="38개 품목 · 부족 4"
                action={
                    <Button size="icon-sm" variant="secondary" aria-label="정렬 및 필터">
                        <SlidersHorizontal />
                    </Button>
                }
            />

            <div className="flex items-center gap-2 rounded-xl bg-muted px-3 py-2.5 text-sm text-muted-foreground">
                <Search className="size-4" />
                품목 검색
            </div>

            <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {FILTERS.map((filter, index) => (
                    <Badge
                        key={filter.label}
                        variant={index === 0 ? "default" : "outline"}
                        className="h-7 shrink-0 px-3 text-xs"
                    >
                        {filter.label} {filter.count}
                    </Badge>
                ))}
            </div>

            <div className="flex items-start gap-3 rounded-2xl bg-warning-muted px-4 py-3 text-warning">
                <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                <div>
                    <p className="text-sm font-medium">4개 품목이 이번 주 안에 떨어져요</p>
                    <p className="mt-0.5 text-xs opacity-80">
                        최근 3개월 소비 속도 기준 예측입니다.
                    </p>
                </div>
            </div>

            <Panel>
                <CardContent className="flex flex-col gap-3">
                    <SectionTitle aside="소진일순">곧 소진</SectionTitle>
                    <RowGroup>
                        {RUNNING_OUT.map((item) => (
                            <Row
                                key={item.title}
                                media={item.media}
                                title={item.title}
                                description={item.description}
                                trailing={
                                    <Badge className={item.className}>{item.stock}</Badge>
                                }
                            />
                        ))}
                    </RowGroup>
                </CardContent>
            </Panel>

            <Panel>
                <CardContent className="flex flex-col gap-3">
                    <SectionTitle aside="9개">욕실</SectionTitle>
                    <RowGroup>
                        {BATHROOM.map((item) => (
                            <Row
                                key={item.title}
                                media={item.media}
                                title={item.title}
                                description={item.description}
                                trailing={<QuantityStepper value={item.quantity} />}
                            />
                        ))}
                    </RowGroup>
                </CardContent>
            </Panel>
        </Screen>
    );
}

function QuantityStepper({ value }: { value: number }) {
    return (
        <div className="flex items-center gap-0.5">
            <Button size="icon-xs" variant="outline" aria-label="수량 줄이기">
                <Minus />
            </Button>
            <span className="min-w-7 text-center text-sm font-medium tabular-nums">
                {value}
            </span>
            <Button size="icon-xs" variant="outline" aria-label="수량 늘리기">
                <Plus />
            </Button>
        </div>
    );
}
