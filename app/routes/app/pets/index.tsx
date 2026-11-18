import { Pencil, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Fi from "zod/v4/locales/fi.cjs";

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
import CareSidePage from "~/widgets/sides/care-side";
import { CareLogDrawer } from "~/widgets/sides/care-log-form";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { CardContent } from "~/components/ui/card";
import { DrawerPage } from "~/components/ui/drawer-page";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";
import PetsItemForm from "~/widgets/sides/pets-item-form";
import type { Route } from "./+types";
import { useAppState } from "~/stores/app-state";
import pets, { PetCareItemResponseData, TodayPetCareItemResponseData } from "~/services/pets";
import { redirect } from "react-router";
import { z } from "zod/v4";
import { PetDetailCard } from "~/widgets/pets/pet-detail-card";
import { sameDay } from "~/lib/date-utils";
import CareItemSidePage from "~/widgets/sides/care-item-side";
import CareItemDetailPage from "~/widgets/sides/care-item-detail";
import { CareItemRowForLog } from "~/widgets/pets/pet-care-item-row";
import PetDetailSidePage from "~/widgets/sides/pet-detail-side";

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

export async function clientLoader({}: Route.ClientLoaderArgs) {
  const {family} = useAppState.getState();
  if(!family){
    return redirect("/app");
  }

  const petsList = await pets.getFamilyPets(family.id).then(res => res.data);
  const todayCareItems = await pets.getFamilyTodayCareItems(family.id).then(res => res.data);

  return {
    petsList,
    todayCareItems
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
  const { petsList, todayCareItems } = loaderData
  const [open, setOpen] = useState(false);
  const [selectedPetIds, setSelectedPetIds] = useState([petsList[0]?.id]);
  const selectedPet = useMemo(() => {
    if(selectedPetIds.length == 0) {
      return undefined;
    }
    return petsList.find(pet => pet.id === selectedPetIds[0]);
  }, [selectedPetIds]);

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
                                     media: item.emoji,
                                     title: item.name,
                                     description: careRowDescription(item),
                                     badge: {
                                       className: "bg-warning-muted text-warning",
                                       label: "대기"
                                     },
                                   }} 
                />
              ))}
            </RowGroup>
          </CardContent>
        </Panel>
      </div>

      <div className="flex flex-col gap-1">
        <SectionTitle
          aside={
            <DrawerPage
              trigger={<Button size={"xs"} variant={"ghost"}>추가</Button>}
              title="반려 동물 추가"
            >
              <PetsItemForm />
            </DrawerPage>
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
          <PetDetailCard pet_id={selectedPet?.id} onClick={()=>{setOpen(true)}}/>
          <DrawerPage
              open={open}
              onOpenChange={setOpen}
              title={selectedPet?.name}
              action={(
                <DrawerPage
                  trigger={
                    <Button variant="secondary" size="icon-sm">
                      <Pencil />
                    </Button>
                  }
                  title="반려동물 수정"
                  description={`${selectedPet?.name} 항목을 수정합니다.`}
                >
                  
                </DrawerPage>
              )}
            >
              <PetDetailSidePage pet_id={selectedPet?.id} />
          </DrawerPage>
        </>
      )}

    </Screen>
  );
}
