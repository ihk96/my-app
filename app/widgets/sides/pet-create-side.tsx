import { useEffect, useState } from "react";
import PetsItemForm, { type PetsItemFormValue } from "../pets/pets-item-form";
import pets, { CreatePetRequestData, PetResponseData, UpdatePetRequestData } from "~/lib/api/pets";
import type { z } from "zod/v4";
import { Panel } from "~/components/app/screen";
import { CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { dataUrlToFile, fileToDataUrl } from "~/lib/file-utils";
import { toast } from "~/components/ui/toast";
import { DrawerPage } from "~/components/ui/drawer-page";

export default function PetCreateSidePage(
  { 
    familyId,
    onSave,
    open,
    onChangeOpen,
  } : { 
    familyId: string
    onSave?: () => void
    open?: boolean
    onChangeOpen?: (open: boolean) => void
  }
) {
  const [value, setValue] = useState<PetsItemFormValue | undefined>(undefined);
  
  async function handleSave() {
    if (value) {
      const originImage = value.originalImage ? await fileToDataUrl(value.originalImage) : "";
      const thumbnailImage = value.thumbnailImage ? await fileToDataUrl(value.thumbnailImage) : "";
      const data: z.infer<typeof CreatePetRequestData> = {
        name: value.name,
        species: value.species as z.infer<typeof UpdatePetRequestData>["species"],
        sex: value.gender as z.infer<typeof UpdatePetRequestData>["sex"],
        day_became_family: value.familyDate.toISOString(),
        birth_date: value.birthday.toISOString(),
        original_image: originImage,
        thumbnail: thumbnailImage,
      };
      toast.promise(
        new Promise((resolve, reject) => {
          pets.createPet(familyId, data).then(res => {
            const pet = res.data;
            pets.savePetAdditionalInfo(pet.id, value.additionalInfo.map((info, index) => ({ info, order_num: index })))
            .then(() => {
              if (onSave) onSave();
              resolve(true);
            })
            .catch(err => reject(err));
          })
          .catch(err => reject(err));
        }),
        {
          loading: "반려동물 저장 중...",
          success: "반려동물 저장 완료",
          error: "반려동물 저장 실패"
        }
      )
      
    }
  }

  return (
    <DrawerPage
      title="반려동물 등록"
      open={open}
      onOpenChange={onChangeOpen}
    >
      <div className="flex flex-col gap-4">
        <Panel>
          <CardContent className="flex flex-col gap-3">
            <PetsItemForm onChange={setValue} />
          </CardContent>
        </Panel>
        <Button onClick={handleSave}>저장</Button>
      </div>
    </DrawerPage>
    
  );
}