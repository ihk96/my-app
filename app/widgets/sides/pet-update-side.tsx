import { useEffect, useState } from "react";
import PetsItemForm, { type PetsItemFormValue } from "../pets/pets-item-form";
import pets, { PetResponseData, UpdatePetRequestData } from "~/lib/api/pets";
import type { z } from "zod/v4";
import { Panel } from "~/components/app/screen";
import { CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { dataUrlToFile, fileToDataUrl } from "~/lib/file-utils";
import { toast } from "~/components/ui/toast";
import { DrawerPage } from "~/components/ui/drawer-page";
import { Pencil } from "lucide-react";
import { format } from "date-fns";

export default function PetUpdateSidePage(
  { 
    pet_id, 
    onSave,
    open,
    onChangeOpen,
  } : { 
    pet_id: string
    onSave?: () => void
    open?: boolean
    onChangeOpen?: (open: boolean) => void
  }
) {

  const [pet, setPet] = useState<z.infer<typeof PetResponseData> | undefined>(undefined);
  const [value, setValue] = useState<PetsItemFormValue | undefined>(undefined);
  
  useEffect(() => {
    pets.getPet(pet_id).then(res => {
      setPet(res.data);
    });
  }, [pet_id]);

  useEffect(() => {
    if (pet) {
      pets.getPetAdditionalInfo(pet_id).then(async res => {
        let additionalInfo = res.data;
        const originImage = pet.original_image ? await dataUrlToFile(pet.original_image, "original") : undefined;
        const thumbnailImage = pet.thumbnail ? await dataUrlToFile(pet.thumbnail, "thumbnail") : undefined;
        setValue({
        	name: pet.name,
          species: pet.species,
          gender: pet.sex,
          familyDate: new Date(pet.day_became_family),
          birthday: new Date(pet.birth_date),
          additionalInfo: additionalInfo.map(i=>i.info),
          originalImage: originImage,
          thumbnailImage: thumbnailImage,
        });
      });
    }
  }, [pet]);

  async function handleSave() {
    if (value) {
      const originImage = value.originalImage ? await fileToDataUrl(value.originalImage) : "";
      const thumbnailImage = value.thumbnailImage ? await fileToDataUrl(value.thumbnailImage) : "";
      const data: z.infer<typeof UpdatePetRequestData> = {
        name: value.name,
        species: value.species as z.infer<typeof UpdatePetRequestData>["species"],
        sex: value.gender as z.infer<typeof UpdatePetRequestData>["sex"],
        day_became_family: format(new Date(value.familyDate.toISOString()), "yyyy-MM-dd"),
        birth_date: format(new Date(value.birthday.toISOString()), "yyyy-MM-dd"),
        original_image: originImage,
        thumbnail: thumbnailImage,
      };
      toast.promise(
        new Promise((resolve, reject) => {
          pets.updatePet(pet_id, data).then(res => {
            pets.savePetAdditionalInfo(pet_id, value.additionalInfo.map((info, index) => ({ info, order_num: index })))
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
      title="반려동물 수정"
      open={open}
      onOpenChange={onChangeOpen}
    >
      <div className="flex flex-col gap-4">
        <Panel>
          <CardContent className="flex flex-col gap-3">
            <PetsItemForm value={value} onChange={setValue} />
          </CardContent>
        </Panel>
        <Button onClick={handleSave}>저장</Button>
      </div>
    </DrawerPage>
    
  );
}