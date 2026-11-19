import { Pencil } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Panel, Row, RowGroup } from "~/components/app/screen";
import { Button } from "~/components/ui/button";
import { CardContent } from "~/components/ui/card";
import { DrawerPage } from "~/components/ui/drawer-page";
import { careRowDescription } from "~/lib/pet-utils";
import { Badge } from "~/components/ui/badge";
import type { z } from "zod/v4";
import CareItemDetailPage from "../sides/pet-care-item-detail-side";
import type { CareItemFormValue } from "./care-item-form";
import pets, { CreatePetCareItemRequestData, PetCareItemResponseData } from "~/lib/api/pets";
import { weekdayNumberToString, weekdayStringToNumber } from "~/lib/date-utils";
import { toast } from "~/components/ui/toast";
import CareItemForm from "./care-item-form";
import { DrawerClose } from "~/components/ui/drawer";
import { useRevalidator } from "react-router";
import PetCareItemDetailSidePage from "../sides/pet-care-item-detail-side";

type PetCareItem = {
  emoji: string;
  name: string;
  id: string;
  cycle_type: string;
  interval?: number;
  interval_type?: string;
};

export function PetCareItemList({
  pet_care_list
}: {
  pet_care_list: PetCareItem[];
}){

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<PetCareItem | undefined>(undefined);

  useEffect(()=>{
    if (!open) {
      setSelected(undefined);
    }
  }, [open])

  return (
    <Panel>
      <CardContent className="flex flex-col gap-3">
        <RowGroup>
          {pet_care_list.map((item) => (
            
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
                            interval: item.interval,
                            interval_type: item.interval_type
                          }),
                          badge: {
                            className: "bg-warning-muted text-warning",
                            label: "대기"
                          },
                        }} 
            />
          ))}
        </RowGroup>

        <CareItemDetailDrawer 
          pet_care_id={selected?.id ?? ""}
          name={selected?.name ?? ""}
          open={open}
          setOpen={setOpen}
        />

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

function CareItemDetailDrawer({
  pet_care_id,
  name,
  open,
  setOpen,
}: {
  pet_care_id: string,
  name?: string,
  open?: boolean,
  setOpen?: (open: boolean) => void
}) {
  const [item, setItem] = useState<z.infer<typeof PetCareItemResponseData> | undefined>(undefined);
  const revalidator = useRevalidator();

  useEffect(() => {
    if(pet_care_id) {
      pets.getPetCareItem(pet_care_id).then(res => {
        setItem(res.data);
      });
    } else {
      setItem(undefined);
    }
  }, [pet_care_id]);

  function fetchCareItem() {
    pets.getPetCareItem(pet_care_id).then(res => {
      setItem(res.data);
    });
  }

  return (
    <DrawerPage
      open={open}
      onOpenChange={setOpen}
      title={name}
      action={(
        <DrawerPage
          trigger={
            <Button variant="secondary" size="icon-sm">
              <Pencil />
            </Button>
          }
          title="돌봄 항목 수정"
          description={`${name} 항목을 수정합니다.`}
          onOpenChange={open => {
            if(!open) {
              revalidator.revalidate();
              fetchCareItem();
            }
          }}
        >
          <UpdatePetDrawer
            pet_id={pet_care_id}
          />
        </DrawerPage>
      )}
    >
      {item && (
        <PetCareItemDetailSidePage pet_care_item={item} />
      )}
    </DrawerPage>
  )
}

function UpdatePetDrawer({
  pet_id
}: {
  pet_id: string
}) {
  
  const [values, setValues] = useState<CareItemFormValue>();
  const closeRef = useRef<HTMLButtonElement>(null);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    if(pet_id) {
      pets.getPetCareItem(pet_id).then(res => {
        let data = res.data;
        setValues({
          name: data.name,
          emoji: data.emoji,
          type: data.cycle_type === "Anytime" ? "asNeeded" : "recurring",
          recurrence: {
            weekdays: data.cycle?.weekdays?.map(weekdayStringToNumber) ?? [],
            monthDays: data.cycle?.monthdays ?? [],
            startDate: data.cycle?.start_date ?? "",
            unit: data.cycle?.interval_type === "AfterDays" ? "day" : data.cycle?.interval_type === "Weeks" ? "week" : "month",
            interval: data.cycle?.interval ?? 0,
          }
        });
      });
    }
  }, [pet_id]);

  function addNewPetCareItem() {
    if(values){
      const body: z.infer<typeof CreatePetCareItemRequestData> = {
        name: values.name,
        emoji: values.emoji,
        cycle_type: values.type === "asNeeded" ? "Anytime" : "Regular",
        weekdays: values.recurrence.weekdays.map(weekdayNumberToString),
        monthdays: values.recurrence.monthDays,
        start_date: values.recurrence.startDate,
        interval_type: values.recurrence.unit === "day" ? "AfterDays" : values.recurrence.unit === "week" ? "Weeks" : "Months",
        interval: values.recurrence.interval,
      }
      setIsPending(true);
      toast.promise(
        new Promise((resolve, reject) => {
          pets.updatePetCareItem(pet_id, body).then(resolve).catch(reject)
        }),
        {
          loading: "돌봄 항목 저장 중...",
          success: () => {
            closeRef.current?.click();
            return "돌봄 항목 저장 완료";
          },
          error: "돌봄 항목 저장 실패",
        }
      ).finally(() => setIsPending(false));
    }
  }

  const isValid = useMemo(() => {
    return values?.name && values?.emoji && !isPending
  }, [values, isPending]);

  return (
    <Panel>
				<CardContent className="flex flex-col gap-3">
          <CareItemForm value={values} onChange={setValues} />
          <DrawerClose ref={closeRef} className="hidden" />
          <Button disabled={!isValid} onClick={addNewPetCareItem}>저장</Button>
				</CardContent>
    </Panel>
  )
}

