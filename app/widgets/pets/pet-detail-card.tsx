import { z } from "zod/v4";
import { dateYearMonthGap } from "~/lib/date-utils";
import { useEffect, useState } from "react";
import pets from "~/services/pets";

const PetDetailSchema = z.object({
    id: z.string(),
    name: z.string(),
    species: z.enum(["Dog", "Cat", "Lizard", "Bird", "Snake", "Hamster", "Turtle", "Other"]),
    birth_date: z.iso.date(),
    day_became_family: z.iso.date(),
    sex: z.enum(["Male", "Female", "Unknown"]),
    thumbnail: z.string(),
});
export type PetDetail = z.infer<typeof PetDetailSchema>;

export function PetDetail({
  pet_id
}: {
  pet_id: string
}) {
  const [pet, setPet] = useState<PetDetail | undefined>(undefined);
  const [additionalInfos, setAdditionalInfos] = useState<string[]>([]);

  useEffect(() => {
    pets.getPet(pet_id).then((res) => {
      const data = res.data;
      setPet({
        id: data.id,
        name: data.name,
        species: data.species,
        birth_date: data.birth_date,
        day_became_family: data.day_became_family,
        sex: data.sex,
        thumbnail: data.thumbnail,
      });
    });
    pets.getPetAdditionalInfo(pet_id).then((res) => {
      let data = res.data;
      data.sort((a, b) => a.order_num - b.order_num);
      setAdditionalInfos(data.map(item => item.info));
    });
  }, [pet_id]);

  return (
    <div className="flex items-center gap-3 rounded-2xl bg-accent px-4 py-3.5 text-accent-foreground">
      {!pet && <p>Loading...</p>}
      {pet && (<>

        <div className="flex size-13 shrink-0 items-center justify-center rounded-xl bg-card text-2xl">
          {pet.thumbnail ? (
            <img src={pet.thumbnail} alt={pet.name} className="w-full h-full object-cover rounded-xl" />
          ) : (
            ""
          )}
        </div>
        <div className="min-w-0">
          <p className="font-heading text-base font-semibold">{pet.name}</p>
          <p className="mt-0.5 truncate text-xs opacity-80">
            {PetSpeciesName(pet.species)} · {pet.sex === "Male" ? "수컷" : pet.sex === "Female" ? "암컷" : "알수없음"}
          </p>
          <p className="mt-0.5 truncate text-xs opacity-80">
              🎂{dateYearMonthGap(new Date(pet.birth_date), new Date()).years}년 {dateYearMonthGap(new Date(pet.birth_date), new Date()).months}개월
              · 🏠{dateYearMonthGap(new Date(pet.day_became_family), new Date()).years}년 {dateYearMonthGap(new Date(pet.day_became_family), new Date()).months}개월
          </p>
          <p className="mt-0.5 truncate text-xs opacity-80">
            {additionalInfos.map((info, index) => (<>
              <span key={index}>{info}</span>
              {index < additionalInfos.length - 1 ? <span className="mx-1">·</span> : ""}
            </>))}
          </p>
        </div>

      </>)}
    </div>
  )
}


function PetSpeciesName(species: "Dog" | "Cat" | "Lizard" | "Bird" | "Snake" | "Hamster" | "Turtle" | "Other" ) {
  switch (species) {
    case "Dog":
      return "강아지";
    case "Cat":
      return "고양이";
    case "Lizard":
      return "도마뱀";
    case "Bird":
      return "새";
    case "Snake":
      return "뱀";
    case "Hamster":
      return "햄스터";
    case "Turtle":
      return "거북이";
    default:
      return "기타";
  }
}