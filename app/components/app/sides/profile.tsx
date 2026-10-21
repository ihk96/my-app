import { useEffect, useState } from "react";
import type { z } from "zod/v4";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { DrawerPage } from "~/components/ui/drawer-page";
import families, { FamiliesResponseData } from "~/services/families";
import { useAppState } from "~/stores/app-state";

export default function Profile() {
  const {user, family, setFamily} = useAppState();
  const [familes, setFamiles] = useState<z.infer<typeof FamiliesResponseData>[]>([]);
  const [selectedFamily, setSelectedFamily] = useState<z.infer<typeof FamiliesResponseData> | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    families.getMyFamilies()
      .then(res=>{
        setFamiles(res.data);
      });
  },[])


  function confirmFamilyChange(f: z.infer<typeof FamiliesResponseData>) {
    setSelectedFamily(f);
    setIsDialogOpen(true);
  }

  function handleFamilyChange(f: z.infer<typeof FamiliesResponseData>) {
    setFamily(f);
    setSelectedFamily(null);
    setIsDialogOpen(false);
  }

  return (
    <div>
      {user?.name ?? ""}님의 프로필
      <p>현재 가족: {family?.name ?? "없음"} 
        <DrawerPage
          trigger={
            <Button variant={"outline"} size={"sm"}>변경</Button>
          }
          title="가족 변경"
        >
          <div>
            {familes.map(f=>(
              <Button key={f.id} onClick={()=>confirmFamilyChange(f)}>
                {f.name}
                {f.id === family?.id && " (활성)"}
              </Button>
            ))}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>가족을 변경하시겠습니까?</DialogTitle>
                </DialogHeader>
                <p>선택된 가족: {selectedFamily?.name ?? "없음"}</p>
                <div>
                  <Button variant={"outline"} size={"sm"} onClick={()=>{setIsDialogOpen(false); setSelectedFamily(null);}}>취소</Button>
                  <Button onClick={()=>handleFamilyChange(selectedFamily!)}>변경</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </DrawerPage>
      </p>

      <DrawerPage
        trigger={
          <Button variant={"outline"} size={"sm"}>가족 관리</Button>
        }
        title="가족 관리"
      >
        <FamilyInfo familyId={family!.id} />
      </DrawerPage>


    </div>
  );
}

function FamilyInfo({ familyId }: { familyId: string }) {
  const [family, setFamily] = useState<z.infer<typeof FamiliesResponseData> | null>(null);
  useEffect(() => {
    families.getFamily(familyId)
      .then(res => {
        setFamily(res.data);
      });
  }, [familyId]);
  return (
    <div>
      {family?.name}
      {family?.is_inviting ? "가입 활성" : "가입 비활성"}
      <Button variant={"outline"} 
              size={"sm"} 
              onClick={()=>{
                families.getFamily(familyId)
                  .then(res => {
                    const currentFamily = res.data;
                    families.updateFamily(familyId, { 
                      family_name: currentFamily.name,
                      feature_account_book: currentFamily.feature_account_book,
                      feature_inventory: currentFamily.feature_inventory,
                      feature_pets: currentFamily.feature_pets,
                      is_inviting: !family?.is_inviting,
                    })
                      .then(res => {
                        setFamily(res.data);
                      });
                  });
              }}
      >
        {family?.is_inviting ? "초대 비활성화" : "초대 활성화"}
      </Button>
      {family?.is_inviting && <p>초대 코드: {family?.invitation_code ?? "없음"}</p>}
    </div>
  )
}