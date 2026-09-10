import { CardContent } from "~/components/ui/card";
import { Panel, Row, RowGroup, SectionTitle } from "../screen";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { DrawerPage } from "~/components/ui/drawer-page";
import CareItemSidePage from "./care-item-side";

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
      </div>
    </div>
  );
}