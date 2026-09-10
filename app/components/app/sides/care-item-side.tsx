import { CardContent } from "~/components/ui/card";
import { Panel, Row, RowGroup, SectionTitle } from "../screen";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";

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

export default function CareItemSidePage(){
  return (
    <div>
      <Panel>
				<CardContent className="flex flex-col gap-3">
          <SectionTitle 
          >
            돌봄 항목
          </SectionTitle>
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
  );
}