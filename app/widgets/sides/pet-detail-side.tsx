import { useEffect, useMemo, useRef, useState } from "react";
import { Panel, SectionTitle } from "~/components/app/screen";
import { CardContent } from "~/components/ui/card";
import pets, { CreatePetCareItemRequestData, PetCareItemResponseData, PetResponseData } from "~/lib/api/pets";
import { PetDetailCard } from "../pets/pet-detail-card";
import { PetCareItemList } from "../pets/pet-care-list";
import { DrawerPage } from "~/components/ui/drawer-page";
import { Button } from "~/components/ui/button";
import CareItemForm, { type CareItemFormValue } from "../pets/care-item-form";
import type { z } from "zod/v4";
import { DrawerClose } from "~/components/ui/drawer";
import { toast } from "~/components/ui/toast";
import { useRevalidator } from "react-router";
import { weekdayNumberToString } from "~/lib/date-utils";
import PetUpdateSidePage from "./pet-update-side";
import { Pencil } from "lucide-react";
import type { AxiosError } from "axios";

export default function PetDetailSidePage({
  pet_id,
  open,
  onChangeOpen
}: {
  pet_id: string
  open?: boolean
  onChangeOpen?: (open: boolean) => void
}){
  const [pet, setPet] = useState<z.infer<typeof PetResponseData> | undefined>(undefined);
  const [careItemList, setCareItemList] = useState<z.infer<typeof PetCareItemResponseData>[]>([]);
  const [updateOpen, setUpdateOpen] = useState(false);
  let revalidator = useRevalidator();
  
  function fetchCareItemList() {
    pets.getPetCareItems(pet_id)
    .then(res => {
      setCareItemList(res.data);
    })
    .catch((err: AxiosError) => {
      toast.add({
        // @ts-ignore
        description: err.response?.data?.message ?? "오류가 발생했습니다.",
        type: "error"
      });
    });
  }

  function fetchPet() {
    pets.getPet(pet_id)
    .then(res => {
      setPet(res.data);
    })
    .catch((err: AxiosError) => {
      toast.add({
        // @ts-ignore
        description: err.response?.data?.message ?? "오류가 발생했습니다.",
        type: "error"
      });
    });
  }
  
  useEffect(() => {
    fetchCareItemList();
    fetchPet();
  }, [pet_id]);


  
  return (
    <DrawerPage
      open={open}
      onOpenChange={(open) => {
        if(onChangeOpen) onChangeOpen(open);
      }}
      title={pet?.name}
      action={(
        <>
          <Button variant="secondary" size="icon-sm" onClick={() => setUpdateOpen(true)}>
            <Pencil />
          </Button>
          <PetUpdateSidePage pet_id={pet_id} 
                              open={updateOpen}
                              onChangeOpen={setUpdateOpen}
                              onSave={() => {
                                revalidator.revalidate();
                                fetchPet();
                                setUpdateOpen(false);
                              }} 
          />
        </>
      )}
    >

      <div className="flex flex-col gap-4">
        {pet && (
          <PetDetailCard pet={pet}/>
        )}

        <div className="flex flex-col gap-1">
          <SectionTitle
            aside={
              <DrawerPage
                trigger={<Button size={"xs"} variant={"ghost"}>추가</Button>}
                title="돌봄 항목 추가"
                description="새로운 돌봄 항목을 추가합니다."
                onOpenChange={open=>{
                  if(!open){
                    revalidator.revalidate();
                    fetchCareItemList();
                  }
                }}
              >
                <NewPetDrawer pet_id={pet_id} />
              </DrawerPage>
            }
          >
            돌봄 항목
          </SectionTitle>

          <PetCareItemList
            pet_care_list={careItemList.map(item=>({
              id: item.id,
              emoji: item.emoji,
              name: item.name,
              cycle_type: item.cycle_type,
              interval: item.cycle?.interval,
              interval_type: item.cycle?.interval_type,
            }))}
          />
        </div>


      </div>
    </DrawerPage>
  );
}

function NewPetDrawer({
  pet_id
}: {
  pet_id: string
}) {
  const [values, setValues] = useState<CareItemFormValue>();
  const closeRef = useRef<HTMLButtonElement>(null);
  const [isPending, setIsPending] = useState(false);

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
          pets.createPetCareItem(pet_id, body).then(resolve).catch(reject)
        }),
        {
          loading: "돌봄 항목 추가 중...",
          success: () => {
            closeRef.current?.click();
            return "돌봄 항목 추가 완료.";
          },
          error: "돌봄 항목 추가 실패.",
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
          <CareItemForm onChange={setValues} />
          <DrawerClose ref={closeRef} className="hidden" />
          <Button disabled={!isValid} onClick={addNewPetCareItem}>추가</Button>
				</CardContent>
    </Panel>
  )
}

