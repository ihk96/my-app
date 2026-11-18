import { useEffect, useMemo, useRef, useState } from "react";
import { Panel, SectionTitle } from "~/components/app/screen";
import { CardContent } from "~/components/ui/card";
import pets, { CreatePetCareItemRequestData } from "~/services/pets";
import { PetDetailCard } from "../pets/pet-detail-card";
import { PetCareItemList } from "../pets/pet-care-list";
import { DrawerPage } from "~/components/ui/drawer-page";
import { Button } from "~/components/ui/button";
import CareItemForm, { type CareItemFormValue } from "./care-item-form";
import type { z } from "zod/v4";
import { DrawerClose } from "~/components/ui/drawer";
import { toast } from "~/components/ui/toast";

export default function PetDetailSidePage({
  pet_id
}: {
  pet_id: string
}){
  let [pet, setPet] = useState();

  
  return (
    <div className="flex flex-col gap-4">
      <PetDetailCard pet_id={pet_id}/>

      <div className="flex flex-col gap-1">
        <SectionTitle
          aside={
            <DrawerPage
              trigger={<Button size={"xs"} variant={"ghost"}>추가</Button>}
              title="돌봄 항목 추가"
              description="새로운 돌봄 항목을 추가합니다."
            >
              <NewPetDrwaer pet_id={pet_id} />
            </DrawerPage>
          }
        >
          돌봄 항목
        </SectionTitle>

        <PetCareItemList
          pet_id={pet_id}
        />
      </div>


    </div>
  );
}

function NewPetDrwaer({
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

function weekdayNumberToString(weekday: number): ("Friday" | "Monday" | "Saturday" | "Sunday" | "Thursday" | "Tuesday" | "Wednesday") {
  const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return weekdays[weekday] as ("Friday" | "Monday" | "Saturday" | "Sunday" | "Thursday" | "Tuesday" | "Wednesday");
}
