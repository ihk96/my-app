import { http, HttpResponse } from "msw";
import { v4 as uuidv4 } from "uuid";
import type { z } from "zod/v4";
import { addDays, addHours } from "~/lib/date-utils";
import { CreatePetCareItemRequestData, CreatePetCareLogRequestData, CreatePetRequestData, PetAdditionalInfoInputData, PetAdditionalInfoResponseData, PetCareItemResponseData, PetCareItemSummaryResponseData, PetCareItemWriteResponseData, PetCareLogResponseData, PetResponseData, TodayPetCareItemResponseData, UpdatePetCareItemRequestData, UpdatePetCareLogRequestData, UpdatePetRequestData } from "~/lib/api/pets";

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
    },
    creator_id: uuidv4().toString(),
    target_pet_name: "도봉이",
    emoji: "🦗",
    name: "밥주기",
    family_id: "family-id",
    creator_name: "김인혁",
    updated_at: new Date().toISOString(),
    target_pet_id: DOBONG_ID,
  },
  {
    family_name: "우리집",
    id: uuidv4().toString(),
    created_at: new Date().toISOString(),
    cycle_type: "Anytime",
    is_deleted: false,
    creator_id: uuidv4().toString(),
    target_pet_name: "도봉이",
    name: "청소",
    emoji: "🧹",
    family_id: "family-id",
    creator_name: "김인혁",
    updated_at: new Date().toISOString(),
    target_pet_id: DOBONG_ID,
  },
  {
    family_name: "우리집",
    id: uuidv4().toString(),
    created_at: new Date().toISOString(),
    cycle_type: "Anytime",
    is_deleted: false,
    creator_id: uuidv4().toString(),
    target_pet_name: "도봉이",
    emoji: "💦",
    name: "분무",
    family_id: "family-id",
    creator_name: "김인혁",
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
    },
    creator_id: uuidv4().toString(),
    target_pet_name: "꼬미",
    name: "밥주기",
    emoji: "🦗",
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
    is_deleted: false,
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
    is_deleted: false,
    emoji: "💦",
    creator_id: uuidv4().toString(),
    target_pet_name: "꼬미",
    name: "분무",
    family_id: "family-id",
    creator_name: "김인혁",
    updated_at: new Date().toISOString(),
    target_pet_id: KOMI_ID,
  },
];

export const petsHandler = [
  http.get("/api/families/:familyId/pets", ({ params }) => { 
    const familyId = params.familyId as string;

    const pets: z.infer<typeof PetResponseData>[] = MY_PETS.map(p=>({...p, family_id: familyId}));

    return HttpResponse.json(pets);
  }),
  http.post("/api/families/:familyId/pets", async ({params, request}) => { 
    const familyId = params.familyId as string;
    const body = await request.json() as z.infer<typeof CreatePetRequestData>;

    const newPet: z.infer<typeof PetResponseData> = {
      ...body,
      id: uuidv4().toString(),
      family_id: familyId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_deleted: false,
    };

    MY_PETS.push(newPet);

    return HttpResponse.json(newPet);
  }),
  http.get("/api/pets/:petId", ({ params }) => { 
    const petId = params.petId as string;

    const pet: z.infer<typeof PetResponseData> | undefined = MY_PETS.find(p => p.id === petId);

    if(!pet) {
      return HttpResponse.json({ error: "Pet not found" }, { status: 404 });
    }

    return HttpResponse.json(pet);

  }),
  http.put("/api/pets/:petId", async ( {params, request}) => { 
    const petId = params.petId as string;
    const body = await request.json() as z.infer<typeof UpdatePetRequestData>;

    const petIndex = MY_PETS.findIndex(p => p.id === petId);
    if(petIndex === -1) {
      return HttpResponse.json({ error: "Pet not found" }, { status: 404 });
    }

    MY_PETS[petIndex] = {
      ...MY_PETS[petIndex],
      ...body,
    };

    return HttpResponse.json(MY_PETS[petIndex]);
  }),
  http.delete("/api/pets/:petId", () => { }),
  http.get("/api/pets/:petId/additional-info", ({ params }) => { 
    const petId = params.petId as string;

    const pet: z.infer<typeof PetResponseData> | undefined = MY_PETS.find(p => p.id === petId);

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
  http.put("/api/pets/:petId/additional-info", async ({params, request}) => { 
    const petId = params.petId as string;
    const body = await request.json() as z.infer<typeof PetAdditionalInfoInputData>[];

    const petIndex = MY_PETS.findIndex(p => p.id === petId);
    if(petIndex === -1) {
      return HttpResponse.json({ error: "Pet not found" }, { status: 404 });
    }

    const additionalInfoList: z.infer<typeof PetAdditionalInfoResponseData>[] = body.map((info, index) => ({
      id: uuidv4().toString(),
      pet_id: petId,
      info: info.info,
      order_num: index,
    }));

    return HttpResponse.json(additionalInfoList);

  }),
  http.get("/api/pets/:petId/care/items", ({ params }) => { 
    const petId = params.petId as string;

    const careItems: z.infer<typeof PetCareItemResponseData>[] = petId == KOMI_ID ? KOMI_CARE_ITEMS : DOBONG_CARE_ITEMS;

    return HttpResponse.json(careItems);
  }),

  http.post("/api/pets/:petId/care/items", async ( { params, request } ) => { 
    const petId = params.petId as string;
    const pet = MY_PETS.find(p => p.id === petId);
    if(!pet) {
      return HttpResponse.json({ error: "Pet not found" }, { status: 404 });
    }
    const body = await request.json() as z.infer<typeof CreatePetCareItemRequestData>;

    const careItem: z.infer<typeof PetCareItemWriteResponseData> = {
      family_name: "우리집",
      id: uuidv4().toString(),
      created_at: new Date().toISOString(),
      cycle_type: body.cycle_type,
      is_deleted: false,
      creator_id: "creator-id",
      target_pet_name: pet.name,
      emoji: body.emoji,
      name: body.name,
      family_id: pet.family_id,
      interval_type: body.interval_type,
      creator_name: "Creator Name",
      start_date: body.start_date,
      interval: body.interval,
      updated_at: new Date().toISOString(),
      target_pet_id: petId,
    };

    if(petId == DOBONG_ID) {
      DOBONG_CARE_ITEMS.push(careItem);
    }
    if(petId == KOMI_ID) {
      KOMI_CARE_ITEMS.push(careItem);
    }

    return HttpResponse.json(careItem);
  }),
  http.get("/api/pets/care/items/:itemId", ({params}) => { 
    const itemId = params.itemId as string;

    const careItem = [...KOMI_CARE_ITEMS, ...DOBONG_CARE_ITEMS].find(item => item.id === itemId);
    if(!careItem) {
      return HttpResponse.json({ error: "Care item not found" }, { status: 404 });
    }

    return HttpResponse.json(careItem);
  }),
  http.put("/api/pets/care/items/:itemId", async ({params, request}) => { 
    const itemId = params.itemId as string;
    const body = await request.json() as z.infer<typeof UpdatePetCareItemRequestData>;
    
    const careItemIndex = [...KOMI_CARE_ITEMS, ...DOBONG_CARE_ITEMS].findIndex(item => item.id === itemId);
    if(careItemIndex === -1) {
      return HttpResponse.json({ error: "Care item not found" }, { status: 404 });
    }

    const careItem = [...KOMI_CARE_ITEMS, ...DOBONG_CARE_ITEMS][careItemIndex];
    if(careItem.target_pet_id === DOBONG_ID) {
      DOBONG_CARE_ITEMS[careItemIndex] = {
        ...DOBONG_CARE_ITEMS[careItemIndex],
        ...body
      };
    }
    if(careItem.target_pet_id === KOMI_ID) {
      KOMI_CARE_ITEMS[careItemIndex] = {
        ...KOMI_CARE_ITEMS[careItemIndex],
        ...body
      };
    }

    const res: z.infer<typeof PetCareItemWriteResponseData> = {
      ...careItem,
      ...body
    }
    return HttpResponse.json(res);

  }),
  http.get("/api/pets/care/items/:itemId/summary", ({params}) => { 
    const itemId = params.itemId as string;

    const summary: z.infer<typeof PetCareItemSummaryResponseData> = {
      pet_care_item_id: itemId,
      name: "밥주기",
      last_care_log: {
        log_id: uuidv4().toString(),
        performed_at: "2026-11-18T20:00:12",
      },
      next_care_date: "2026-11-20",
      this_month_logs_count: 5,
    }

    return HttpResponse.json(summary);
  }),
  http.post("/api/pets/care/items/:itemId/logs", async ({params, request}) => { 
    const itemId = params.itemId as string;
    const body = await request.json() as z.infer<typeof CreatePetCareLogRequestData>;

    const newLog: z.infer<typeof PetCareLogResponseData> = {
      id: uuidv4().toString(),
      pet_care_item_id: itemId,
      pet_care_item_name: "밥주기",
      pet_care_item_emoji: "🦗",
      target_pet_id: KOMI_ID,
      target_pet_name: "꼬미",
      performed_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      memo: body.memo,
      creator_id: "creator-id",
      creator_name: "Creator Name",
    };

    return HttpResponse.json(newLog);
  }),
  http.delete("/api/pets/care/items/:itemId", () => { }),
  http.delete("/api/pets/care/logs/:logId", ({params}) => { 
    const logId = params.logId as string;

    return HttpResponse.json({ success: true, logId });
  }),
  http.get("/api/pets/care/logs/:logId", () => { 
    
  }),
  http.get("/api/pets/care/items/:itemId/logs", ({params, request}) => { 
    const itemId = params.itemId as string;
    const searchParams = new URL(request.url).searchParams;

    
    const logList: z.infer<typeof PetCareLogResponseData>[] = [
      {
        id: uuidv4().toString(),
        pet_care_item_id: itemId,
        pet_care_item_name: "밥주기",
        pet_care_item_emoji: "🦗",
        target_pet_id: KOMI_ID,
        target_pet_name: "꼬미",
        performed_at: "2026-11-18T20:00:12",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        memo: "3 숟갈",
        creator_id: "creator-id",
        creator_name: "Creator Name",
      }
    ]

    return HttpResponse.json(logList);
  }),
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
  http.put("/api/pets/care/logs/:logId", async ({params, request}) => { 
    const logId = params.logId as string;
    const body = await request.json() as z.infer<typeof UpdatePetCareLogRequestData>;
    
    const updatedLog: z.infer<typeof PetCareLogResponseData> = {
      id: logId,
      pet_care_item_id: "pet_care_item_id",
      pet_care_item_name: "pet_care_item_name",
      pet_care_item_emoji: "💦",
      target_pet_id: "target_pet_id",
      target_pet_name: "target_pet_name",
      performed_at: body.performed_at,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      memo: body.memo,
      creator_id: "creator_id",
      creator_name: "creator_name",
    };

    return HttpResponse.json(updatedLog);
  }),
];