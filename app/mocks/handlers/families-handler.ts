import { v4 as uuidv4 } from "uuid";
import { http, HttpResponse } from "msw";
import type { z } from "zod/v4";
import { CreateFamilyRequestData, FamiliesResponseData, FamilyJoinRequestsResponseData, FamilyMembersResponseData, UpdateFamilyRequestData } from "~/services/families";

export const familiesHandler = [
  // "/api/families/my" 계열은 "/api/families/:familyId"보다 먼저 와야 매칭이 안 가로채짐
  http.get("/api/families/my", ({request})=>{
    const searchParams = new URL(request.url).searchParams;
    if(searchParams.has("mode")){
      const mode = searchParams.get("mode");
      if(mode === "empty"){
        return HttpResponse.json([]);
      }
    }

    // TODO: 내 가족 목록
    const myFamilies : z.infer<typeof FamiliesResponseData>[] = [
      {
        id: uuidv4().toString(),
        name: "Sample Family",
        creator_id: uuidv4().toString(),
        invitation_code: uuidv4().toString().substring(0,6),
        feature_account_book: true,
        feature_inventory: true,
        feature_pets: true,
        is_inviting: false,
        is_deleted: false,
        deleted_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: uuidv4().toString(),
        name: "Test Family",
        creator_id: uuidv4().toString(),
        invitation_code: uuidv4().toString().substring(0,6),
        feature_account_book: true,
        feature_inventory: true,
        feature_pets: true,
        is_inviting: false,
        is_deleted: false,
        deleted_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
    ];
    return HttpResponse.json(myFamilies);
  }),
  http.get("/api/families/my/primary", ({request})=>{
    // TODO: 내 대표 가족

    const searchParams = new URL(request.url).searchParams;
    if(searchParams.has("mode")){
      const mode = searchParams.get("mode");
      if(mode === "empty"){
        return HttpResponse.json(null, {status: 404});
      }
    }

    const primaryFamily : z.infer<typeof FamiliesResponseData> = {
      id: uuidv4().toString(),
      name: "Primary Family",
      creator_id: uuidv4().toString(),
      invitation_code: uuidv4().toString().substring(0,6),
      feature_account_book: true,
      feature_inventory: true,
      feature_pets: true,
      is_inviting: false,
      is_deleted: false,
      deleted_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    return HttpResponse.json(primaryFamily);
  }),
  http.post("/api/families", async ({request})=>{
    // TODO: 가족 생성
    const body = await request.json() as z.infer<typeof CreateFamilyRequestData>;
    
    const newFamily : z.infer<typeof FamiliesResponseData> = {
      // TODO: 초기값 설정
      id: uuidv4().toString(),
      name: body.family_name,
      creator_id: uuidv4().toString(),
      invitation_code: uuidv4().toString().substring(0,6),
      feature_account_book: body.feature_account_book,
      feature_inventory: body.feature_inventory,
      feature_pets: body.feature_pets,
      is_inviting: false,
      is_deleted: false,
      deleted_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    return HttpResponse.json(newFamily);
  }),
  http.get("/api/families/join/my", ({request})=>{
    // TODO: 내 가입 요청 목록
    const searchParams = new URL(request.url).searchParams;
    if(searchParams.has("mode")){
      const mode = searchParams.get("mode");
      if(mode === "empty"){
        return HttpResponse.json([]);
      }
    }

    const joinRequests: z.infer<typeof FamilyJoinRequestsResponseData>[] = [
      {
        id: uuidv4().toString(),
        family_id: uuidv4().toString(),
        user_id: uuidv4().toString(),
        family_name: "Test Family",
        user_name: "Sample User",
        handle_status: "Pending",
        invitation_code: uuidv4().toString().substring(0,6),
        is_handled: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: uuidv4().toString(),
        family_id: uuidv4().toString(),
        user_id: uuidv4().toString(),
        family_name: "Sample Family",
        user_name: "Sample User",
        handle_status: "Approved",
        invitation_code: uuidv4().toString().substring(0,6),
        is_handled: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
    ];

    return HttpResponse.json(joinRequests);
  }),
  http.post("/api/families/join", async ({request})=>{
    // TODO: 초대 코드로 가입 요청
    const body = await request.json() as {
      invitation_code: string;
    };

    const data: z.infer<typeof FamilyJoinRequestsResponseData> = {
      id: uuidv4().toString(),
      family_id: uuidv4().toString(),
      user_id: uuidv4().toString(),
      family_name: "Sample Family",
      user_name: "Sample User",
      handle_status: "Pending",
      invitation_code: body.invitation_code,
      is_handled: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    return HttpResponse.json(data);
  }),
  http.post("/api/families/join/:requestId", async ({params, request})=>{
    // TODO: 가입 요청 승인/거절
    const requestId = params.requestId as string;
    const body = await request.json() as {
      handle_status: "Approved" | "Rejected";
    };

    return HttpResponse.json(null, {status: 200});
  }),
  http.get("/api/families/:familyId", ({params})=>{
    // TODO: 가족 상세
    const familyId = params.familyId as string;
    const family: z.infer<typeof FamiliesResponseData> = {
      id: familyId,
      name: "Sample Family",
      creator_id: uuidv4().toString(),
      invitation_code: uuidv4().toString().substring(0,6),
      feature_account_book: false,
      feature_inventory: false,
      feature_pets: false,
      is_inviting: true,
      is_deleted: false,
      deleted_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    return HttpResponse.json(family);
  }),
  http.put("/api/families/:familyId", async ({params, request})=>{
    // TODO: 가족 정보 수정
    const familyId = params.familyId as string;
    const body = await request.json() as z.infer<typeof UpdateFamilyRequestData>;
    const updatedFamily: z.infer<typeof FamiliesResponseData> = {
      id: familyId,
      name: body.family_name,
      creator_id: uuidv4().toString(),
      invitation_code: uuidv4().toString().substring(0,6),
      feature_account_book: body.feature_account_book,
      feature_inventory: body.feature_inventory,
      feature_pets: body.feature_pets,
      is_inviting: false,
      is_deleted: false,
      deleted_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    return HttpResponse.json(updatedFamily);
  }),
  http.get("/api/families/:familyId/members", ({params})=>{
    // TODO: 가족 멤버 목록
    const members: z.infer<typeof FamilyMembersResponseData>[] = [
      {
        id: uuidv4().toString(),
        family_id: params.familyId as string,
        user_id: uuidv4().toString(),
        family_name: "Sample Family",
        is_primary: true,
        user_name: "Sample User",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: uuidv4().toString(),
        family_id: params.familyId as string,
        user_id: uuidv4().toString(),
        family_name: "Sample Family",
        is_primary: true,
        user_name: "Test User",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
    ];

    return HttpResponse.json(members);
  }),
  http.post("/api/families/:familyId/regenerate-invitation-code", ({params})=>{
    // TODO: 초대 코드 재발급
    const familyId = params.familyId as string;
    const newInvitationCode = uuidv4().toString().substring(0,6);
    const family: z.infer<typeof FamiliesResponseData> = {
      id: familyId,
      name: "Sample Family",
      creator_id: uuidv4().toString(),
      invitation_code: newInvitationCode,
      feature_account_book: false,
      feature_inventory: false,
      feature_pets: false,
      is_inviting: false,
      is_deleted: false,
      deleted_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };  

    return HttpResponse.json(family);
  }),
  http.get("/api/families/:familyId/join", ({params})=>{
    // TODO: 가족에 들어온 가입 요청 목록

    const requests: z.infer<typeof FamilyJoinRequestsResponseData>[] = [
      {
        id: uuidv4().toString(),
        family_id: params.familyId as string,
        user_id: uuidv4().toString(),
        family_name: "Sample Family",
        user_name: "Request User",
        handle_status: "Pending",
        invitation_code: uuidv4().toString(),
        is_handled: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: uuidv4().toString(),
        family_id: params.familyId as string,
        user_id: uuidv4().toString(),
        family_name: "Sample Family",
        user_name: "Test User",
        handle_status: "Approved",
        invitation_code: uuidv4().toString(),
        is_handled: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: uuidv4().toString(),
        family_id: params.familyId as string,
        user_id: uuidv4().toString(),
        family_name: "Sample Family",
        user_name: "Sample User",
        handle_status: "Rejected",
        invitation_code: uuidv4().toString(),
        is_handled: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
    ];
  

    return HttpResponse.json(requests);
  }),
]
