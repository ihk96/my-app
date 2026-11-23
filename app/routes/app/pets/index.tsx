import { useMemo, useState } from "react";

import {
  RowGroup,
  Screen,
  ScreenHeader,
  Panel,
  SectionTitle,
} from "~/components/app/screen";
import { Button } from "~/components/ui/button";
import { CardContent } from "~/components/ui/card";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";
import type { Route } from "./+types";
import { useAppState } from "~/stores/app-state";
import pets, { CreatePetCareLogRequestData, TodayPetCareItemResponseData } from "~/lib/api/pets";
import { redirect, useRevalidator } from "react-router";
import { PetDetailCard } from "~/widgets/pets/pet-detail-card";
import { sameDay } from "~/lib/date-utils";
import { CareItemRowForLog } from "~/widgets/pets/pet-care-item-row";
import PetDetailSidePage from "~/widgets/sides/pet-detail-side";
import PetCreateSidePage from "~/widgets/sides/pet-create-side";
import CareLogDrawer from "~/widgets/pets/care-log-drawer";
import type { z } from "zod/v4";
import { toast } from "~/components/ui/toast";
import { Badge } from "~/components/ui/badge";

export async function clientLoader({}: Route.ClientLoaderArgs) {
  const {family} = useAppState.getState();
  if(!family){
    return redirect("/app");
  }

  const petsList = await pets.getFamilyPets(family.id).then(res => res.data);
  const todayCareItems = await pets.getFamilyTodayCareItems(family.id).then(res => res.data);

  return {
    petsList,
    todayCareItems,
    family
  }
}

function careRowDescription(item: {
  cycle_type: string;
  last_care_at?: string;
  interval?: number;
  interval_type?: string;
}) {
  let description = "";

  description += item.cycle_type === "Anytime" ? "수시" : "주기";

  let lastDate = item.last_care_at ? new Date(item.last_care_at) : undefined;

  if(item.cycle_type === "Regular") {
    if(item.interval && item.interval_type) {
      description += ` · ${item.interval}${item.interval_type === "AfterDays" ? "일" : item.interval_type === "Weeks" ? "주" : "개월"}`;
    }
  }
  
  if(lastDate) {
    if(sameDay(lastDate, new Date())) {
      description += " · [마지막] 오늘 " + lastDate.toTimeString().substring(0,5);
    } else {
      description += " · [마지막] " + lastDate.toLocaleDateString().substring(2,12).replaceAll(' ','');
    }
  }

  return description;
}

export default function PetsHome({loaderData}:Route.ComponentProps) {
  const { petsList, todayCareItems, family } = loaderData
  const [open, setOpen] = useState(false);
  const [createSideOpen, setCreateSideOpen] = useState(false);
  const [selectedPetIds, setSelectedPetIds] = useState([petsList[0]?.id]);
  const [careLogDrawerOpen, setCareLogDrawerOpen] = useState(false);
  const [selectedCareItem, setSelectedCareItem] = useState<z.infer<typeof TodayPetCareItemResponseData> | undefined>();

  const selectedPet = useMemo(() => {
    if(selectedPetIds.length == 0) {
      return undefined;
    }
    return petsList.find(pet => pet.id === selectedPetIds[0]);
  }, [selectedPetIds, petsList]);

  const revalidator = useRevalidator();

  return (
    <Screen>
      <ScreenHeader
        title="반려동물"
        subtitle={`${petsList.length}마리 · 오늘 할 일 ${todayCareItems.length}`}
      />

      <div className="flex flex-col gap-1">
        <SectionTitle>
          오늘의 돌봄 항목
        </SectionTitle>
        <Panel>
          <CardContent className="flex flex-col gap-3">
            <RowGroup>
              {todayCareItems.map((item) => (
                <CareItemRowForLog key={item.id} 
                                   item={{
                                     id: item.id,
                                     media: item.emoji,
                                     title: <><Badge className="rounded-sm px-1 mr-1" variant="secondary">{item.target_pet_name}</Badge> {item.name} </>,
                                     description: careRowDescription(item),
                                     badge: {
                                       className: "bg-warning-muted text-warning",
                                       label: "대기"
                                     },
                                   }} 
                                   onClick={() => {
                                     setSelectedCareItem(item);
                                     setCareLogDrawerOpen(true);
                                   }}
                />
              ))}
            </RowGroup>
            <CareLogDrawer
              title={`돌봄 기록 · ${selectedCareItem?.name}`}
              target_pet_name={selectedCareItem?.target_pet_name ?? ""}
              description={selectedCareItem ? careRowDescription(selectedCareItem): ""}
              open={selectedCareItem != undefined && careLogDrawerOpen }
              onOpenChange={setCareLogDrawerOpen}
              onSubmit={(value)=>{
                const body: z.infer<typeof CreatePetCareLogRequestData> = {
                  memo: value.memo,
                  performed_at: value.date+"T"+value.time+":00"
                }
                if(selectedCareItem) {
                  toast.promise(new Promise((resolve, reject) => {
                    pets.createPetCareLog(selectedCareItem.id, body)
                      .then(()=>{
                        resolve(undefined);
                        setCareLogDrawerOpen(false);
                      })
                      .catch(reject)
                      .finally(() => {
                        revalidator.revalidate();
                      });
                  }), {
                    loading: '돌봄 기록 저장 중...',
                    success: '돌봄 기록 저장 완료!',
                    error: '돌봄 기록 저장 실패'
                  });
                }
              }}
            />
          </CardContent>
        </Panel>
      </div>

      <div className="flex flex-col gap-1">
        <SectionTitle
          aside={
            <>
              <Button size={"xs"} variant={"ghost"} onClick={() => setCreateSideOpen(true)}>추가</Button>
              <PetCreateSidePage familyId={family.id} 
                                open={createSideOpen} 
                                onChangeOpen={setCreateSideOpen}
                                onSave={() => {
                                  setCreateSideOpen(false);
                                  revalidator.revalidate();
                                }}
              />
            </>
          }
        >
          반려 동물
        </SectionTitle>
        <div className="flex justify-between gap-2">
          <ScrollArea className={"w-full"}>
            <ToggleGroup variant={"outline"} value={selectedPetIds} onValueChange={(v)=>{ setSelectedPetIds(v) }} >
              {petsList.map(pet => (
                <ToggleGroupItem
                  className="data-pressed:bg-primary data-pressed:text-primary-foreground"
                  key={pet.id}
                  value={pet.id}
                  onPressedChange={(p,e)=>{
                    if(!p){
                      e.cancel();
                    }
                  }}
                >
                  {pet.name}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
            <ScrollBar className={"-bottom-2.5! absolute border-t-4!"} orientation="horizontal" />
          </ScrollArea>
        </div>
      </div>
      {selectedPet && (
        <>
          <PetDetailCard pet={selectedPet} 
                         onClick={()=>{setOpen(true)}}
          />
          <PetDetailSidePage pet_id={selectedPet?.id} 
                              open={open}
                              onChangeOpen={open => {
                                setOpen(open);
                                if(!open){
                                  revalidator.revalidate();
                                }
                              }}
          />
        </>
      )}

    </Screen>
  );
}
