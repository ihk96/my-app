import { http, HttpResponse } from "msw";
import { v4 as uuidv4 } from "uuid";
import type { z } from "zod/v4";
import { addDays, addHours } from "~/lib/date-utils";
import { PetAdditionalInfoResponseData, PetCareItemResponseData, PetResponseData, TodayPetCareItemResponseData } from "~/services/pets";

let DOBONG_ID = uuidv4().toString();
let KOMI_ID = uuidv4().toString();

let MY_PETS: z.infer<typeof PetResponseData>[] = [
  {
    id: DOBONG_ID,
    birth_date: "2024-08-24",
    family_id: "family-id",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    day_became_family: "2025-04-24",
    deleted_at: null,
    is_deleted: false,
    name: "도봉이",
    species: "Lizard",
    sex: "Male",
    original_image: "",
    thumbnail: ""
  },
  {
    id: KOMI_ID,
    birth_date: "2025-05-05",
    family_id: "family-id",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    day_became_family: "2025-11-24",
    deleted_at: null,
    is_deleted: false,
    name: "꼬미",
    species: "Lizard",
    sex: "Female",
    original_image: "",
    thumbnail: ""
  }
]

let DOBONG_CARE_ITEMS: z.infer<typeof PetCareItemResponseData>[] = [
  {
    family_name: "우리집",
    id: uuidv4().toString(),
    created_at: new Date().toISOString(),
    cycle_type: "Regular",
    is_deleted: false,
    cycle: {
      interval: 2,
      interval_type: "AfterDays",
      start_date: "2025-04-24",
      monthdays: null,
      weekdays: null,
    },
    creator_id: uuidv4().toString(),
    target_pet_name: "도봉이",
    emoji: "🦗",
    name: "밥주기",
    family_id: "family-id",
    creator_name: "김인혁",
    deleted_at: null,
    updated_at: new Date().toISOString(),
    target_pet_id: DOBONG_ID,
  },
  {
    family_name: "우리집",
    id: uuidv4().toString(),
    created_at: new Date().toISOString(),
    cycle_type: "Anytime",
    is_deleted: false,
    cycle: null,
    creator_id: uuidv4().toString(),
    target_pet_name: "도봉이",
    name: "청소",
    emoji: "🧹",
    family_id: "family-id",
    creator_name: "김인혁",
    deleted_at: null,
    updated_at: new Date().toISOString(),
    target_pet_id: DOBONG_ID,
  },
  {
    family_name: "우리집",
    id: uuidv4().toString(),
    created_at: new Date().toISOString(),
    cycle_type: "Anytime",
    is_deleted: false,
    cycle: null,
    creator_id: uuidv4().toString(),
    target_pet_name: "도봉이",
    emoji: "💦",
    name: "분무",
    family_id: "family-id",
    creator_name: "김인혁",
    deleted_at: null,
    updated_at: new Date().toISOString(),
    target_pet_id: DOBONG_ID,
  },
];

let KOMI_CARE_ITEMS: z.infer<typeof PetCareItemResponseData>[] = [
  {
    family_name: "우리집",
    id: uuidv4().toString(),
    created_at: new Date().toISOString(),
    cycle_type: "Regular",
    is_deleted: false,
    cycle: {
      interval: 3,
      interval_type: "AfterDays",
      start_date: "2025-04-24",
      monthdays: null,
      weekdays: null,
    },
    creator_id: uuidv4().toString(),
    target_pet_name: "꼬미",
    name: "밥주기",
    emoji: "🦗",
    family_id: "family-id",
    creator_name: "김인혁",
    deleted_at: null,
    updated_at: new Date().toISOString(),
    target_pet_id: KOMI_ID,
  },
  {
    family_name: "우리집",
    id: uuidv4().toString(),
    created_at: new Date().toISOString(),
    cycle_type: "Anytime",
    is_deleted: false,
    cycle: null,
    creator_id: uuidv4().toString(),
    target_pet_name: "꼬미",
    name: "청소",
    emoji: "🧹",
    family_id: "family-id",
    creator_name: "김인혁",
    deleted_at: null,
    updated_at: new Date().toISOString(),
    target_pet_id: KOMI_ID,
  },
  {
    family_name: "우리집",
    id: uuidv4().toString(),
    created_at: new Date().toISOString(),
    cycle_type: "Anytime",
    is_deleted: false,
    emoji: "💦",
    cycle: null,
    creator_id: uuidv4().toString(),
    target_pet_name: "꼬미",
    name: "분무",
    family_id: "family-id",
    creator_name: "김인혁",
    deleted_at: null,
    updated_at: new Date().toISOString(),
    target_pet_id: KOMI_ID,
  },
];

export const petsHandler = [
  http.get("/api/families/:familyId/pets", ({ params }) => { 
    let familyId = params.familyId as string;

    let pets: z.infer<typeof PetResponseData>[] = MY_PETS.map(p=>({...p, family_id: familyId}));

    return HttpResponse.json(pets);
  }),
  http.post("/api/families/:familyId/pets", () => { }),
  http.get("/api/pets/:petId", ({ params }) => { 
    let petId = params.petId as string;

    let pet: z.infer<typeof PetResponseData> | undefined = MY_PETS.find(p => p.id === petId);

    if(!pet) {
      return HttpResponse.json({ error: "Pet not found" }, { status: 404 });
    }

    return HttpResponse.json(pet);

  }),
  http.put("/api/pets/:petId", () => { }),
  http.delete("/api/pets/:petId", () => { }),
  http.get("/api/pets/:petId/additional-info", ({ params }) => { 
    let petId = params.petId as string;

    let pet: z.infer<typeof PetResponseData> | undefined = MY_PETS.find(p => p.id === petId);

    if(!pet) {
      return HttpResponse.json({ error: "Pet not found" }, { status: 404 });
    }

    const additionalInfoList: z.infer<typeof PetAdditionalInfoResponseData>[] = [
      {
        id: uuidv4().toString(),
        pet_id: petId,
        info: "크레스티드 게코",
        order_num: 1,
      },
      {
        id: uuidv4().toString(),
        pet_id: petId,
        info: petId === KOMI_ID ? "프라푸치노" : "트익할",
        order_num: 2,
      },
    ]

    return HttpResponse.json(additionalInfoList);
  }),
  http.put("/api/pets/:petId/additional-info", () => { }),
  http.get("/api/pets/:petId/care/items", ({ params }) => { 
    let petId = params.petId as string;

    let careItems: z.infer<typeof PetCareItemResponseData>[] = petId == KOMI_ID ? KOMI_CARE_ITEMS : DOBONG_CARE_ITEMS;

    return HttpResponse.json(careItems);
  }),

  http.post("/api/pets/:petId/care/items", () => { }),
  http.get("/api/pets/care/items/:itemId", () => { }),
  http.put("/api/pets/care/items/:itemId", () => { }),
  http.get("/api/pets/care/items/:itemId/summary", () => { }),
  http.post("/api/pets/care/items/:itemId/logs", () => { }),
  http.delete("/api/pets/care/items/:itemId", () => { }),
  http.delete("/api/pets/care/logs/:logId", () => { }),
  http.get("/api/pets/care/logs/:logId", () => { }),
  http.get("/api/pets/care/items/:itemId/logs", () => { }),
  http.get("/api/pets/:petId/care/logs", () => { }),
  http.get("/api/families/:familyId/care/items/today", ({ params }) => { 
    let familyId = params.familyId as string;

    let todayCareItems: z.infer<typeof TodayPetCareItemResponseData>[] = [
      {
        id: uuidv4().toString(),
        family_id: familyId,
        family_name: "우리집",
        name: "밥주기",
        emoji: "🦗",
        creator_id: "creator-id",
        creator_name: "Creator Name",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        cycle_type: "Regular",
        target_pet_id: KOMI_ID,
        target_pet_name: "꼬미",
        interval: 3,
        interval_type: "AfterDays",
        last_care_at: addDays(new Date(), -3).toISOString()
      },
      {
        family_name: "우리집",
        id: uuidv4().toString(),
        created_at: new Date().toISOString(),
        cycle_type: "Regular",
        creator_id: uuidv4().toString(),
        target_pet_name: "도봉이",
        name: "청소",
        emoji: "🧹",
        family_id: "family-id",
        creator_name: "김인혁",
        updated_at: new Date().toISOString(),
        target_pet_id: DOBONG_ID,
        last_care_at: addDays(new Date(), -7).toISOString(),
        interval: 1,
        interval_type: "Weeks"
      },
      {
        family_name: "우리집",
        id: uuidv4().toString(),
        created_at: new Date().toISOString(),
        cycle_type: "Anytime",
        creator_id: uuidv4().toString(),
        target_pet_name: "도봉이",
        name: "분무",
        emoji: "💦",
        family_id: "family-id",
        creator_name: "김인혁",
        updated_at: new Date().toISOString(),
        target_pet_id: DOBONG_ID,
        last_care_at: addDays(new Date(), -1).toISOString(),
      },
      {
        family_name: "우리집",
        id: uuidv4().toString(),
        created_at: new Date().toISOString(),
        cycle_type: "Anytime",
        creator_id: uuidv4().toString(),
        target_pet_name: "꼬미",
        name: "청소",
        emoji: "🧹",
        family_id: "family-id",
        creator_name: "김인혁",
        updated_at: new Date().toISOString(),
        target_pet_id: KOMI_ID,
      },
      {
        family_name: "우리집",
        id: uuidv4().toString(),
        created_at: new Date().toISOString(),
        cycle_type: "Anytime",
        creator_id: uuidv4().toString(),
        target_pet_name: "꼬미",
        name: "분무",
        emoji: "💦",
        family_id: "family-id",
        creator_name: "김인혁",
        updated_at: new Date().toISOString(),
        target_pet_id: KOMI_ID,
        last_care_at: addHours(new Date(), -3).toISOString(),
      },
    ];

    return HttpResponse.json(todayCareItems);
  }),
  http.put("/api/pets/care/logs/:logId", () => { }),
];