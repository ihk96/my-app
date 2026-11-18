import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { Panel, Row, RowGroup } from "~/components/app/screen";
import { Button } from "~/components/ui/button";
import { CardContent } from "~/components/ui/card";
import { DrawerPage } from "~/components/ui/drawer-page";
import { careRowDescription } from "~/lib/pet-utils";
import pets, { PetCareItemResponseData } from "~/services/pets";
import CareItemSidePage from "../sides/care-item-side";
import { Badge } from "~/components/ui/badge";
import type { z } from "zod/v4";

export function PetCareItemList({pet_id}: {
  pet_id: string;
}){

  const [careItemList, setCareItemList] = useState<z.infer<typeof PetCareItemResponseData>[]>([]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<z.infer<typeof PetCareItemResponseData> | undefined>(undefined);

  useEffect(()=>{
    if (!open) {
      setSelected(undefined);
    }
  }, [open])

  useEffect(() => {
    pets.getPetCareItems(pet_id).then(res => {
      setCareItemList(res.data);
    })
  }, [pet_id]);

  return (
    <Panel>
      <CardContent className="flex flex-col gap-3">
        <RowGroup>
          {careItemList.map((item) => (
            
            <CareItemRow key={item.id}
                         onClick={() => {
                           setSelected(item);
                           setOpen(true);
                         }}
                         item={{
                          media: item.emoji,
                          title: item.name,
                          description: careRowDescription({
                            cycle_type: item.cycle_type,
                            // last_care_at: item.last_care_at,
                            interval: item.cycle?.interval,
                            interval_type: item.cycle?.interval_type
                          }),
                          badge: {
                            className: "bg-warning-muted text-warning",
                            label: "대기"
                          },
                        }} 
            />
          ))}
        </RowGroup>
        <DrawerPage
          open={open}
          onOpenChange={setOpen}
          title={selected?.name}
          action={(
            <DrawerPage
              trigger={
                <Button variant="secondary" size="icon-sm">
                  <Pencil />
                </Button>
              }
              title="돌봄 항목 수정"
              description={`${selected?.name} 항목을 수정합니다.`}
            >
              <CareItemSidePage />
            </DrawerPage>
          )}
        >
          {/* <CareItemDetailPage item={item} /> */}
        </DrawerPage>
      </CardContent>
    </Panel>
  )
}


function CareItemRow({ item, onClick }: { item: {
  media: string;
  title: string;
  description: string;
  badge: {
    className: string;
    label: string;
  };
}, onClick?: () => void }) {

	return (
			<Row
				onClick={onClick}
				media={item.media}
				title={item.title}
				description={item.description}
				trailing={
					<Badge className={item.badge.className}>{item.badge.label}</Badge>
				}
			/>
	);
}