import { z } from "zod/v4";
import { APIClient } from "./api-client";
import type { AxiosResponse } from "axios";

export default {
  getMyFamilies: async function(){
    const res: AxiosResponse<z.infer<typeof FamiliesResponseData>[]> = await APIClient.get("/families/my");

    return res;
  },
  getMyPrimaryFamily: async function(){
    const res: AxiosResponse<z.infer<typeof FamiliesResponseData>> = await APIClient.get("/families/my/primary");

    return res;
  },
  createFamily: async function(data: z.infer<typeof CreateFamilyRequestData>){
    const res: AxiosResponse<z.infer<typeof FamiliesResponseData>> = await APIClient.post("/families", data);

    return res;
  },
  getFamilyMembers: async function(familyId: string){
    const res: AxiosResponse<z.infer<typeof FamilyMembersResponseData>[]> = await APIClient.get(`/families/${familyId}/members`);

    return res;
  },
  regenerateInvitationCode: async function(familyId: string){
    const res: AxiosResponse<z.infer<typeof FamiliesResponseData>> = await APIClient.post(`/families/${familyId}/regenerate-invitation-code`);

    return res;
  },
  getFamilyJoinRequests: async function(familyId: string){
    const res: AxiosResponse<z.infer<typeof FamilyJoinRequestsResponseData>[]> = await APIClient.get(`/families/${familyId}/join`);

    return res;
  },
  requestToJoinFamily: async function(invitation_code: string){
    const res: AxiosResponse<z.infer<typeof FamilyJoinRequestsResponseData>> = await APIClient.post(`/families/join`, { invitation_code });

    return res;
  },
  getMyFamilyJoinRequests: async function(){
    const res: AxiosResponse<z.infer<typeof FamilyJoinRequestsResponseData>[]> = await APIClient.get(`/families/join/my`);

    return res;
  },
  handleFamilyJoinRequest: async function(requestId: string, handle_status: "Approved" | "Rejected"){
    const res: AxiosResponse<null> = await APIClient.post(`/families/join/${requestId}`, { handle_status });

    return res;
  },
  getFamily: async function(familyId: string){
    const res: AxiosResponse<z.infer<typeof FamiliesResponseData>> = await APIClient.get(`/families/${familyId}`);

    return res;
  },
  updateFamily: async function(familyId: string, data: z.infer<typeof UpdateFamilyRequestData>){
    const res: AxiosResponse<z.infer<typeof FamiliesResponseData>> = await APIClient.put(`/families/${familyId}`, data);

    return res;
  },
}

export const UpdateFamilyRequestData = z.object({
  family_name: z.string(),
  is_inviting: z.boolean(),
  feature_pets: z.boolean(),
  feature_inventory: z.boolean(),
  feature_account_book: z.boolean(),
});

export const FamilyJoinRequestsResponseData = z.object({
  id: z.string(),
  family_id: z.string(),
  family_name: z.string(),
  user_id: z.string(),
  user_name: z.string(),
  invitation_code: z.string(),
  is_handled: z.boolean(),
  handle_status: z.enum(["Pending", "Approved", "Rejected"]),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
});


export const FamiliesResponseData = z.object({
  id: z.string(),
  invitation_code: z.string(),
  is_inviting: z.boolean(),
  name: z.string(),
  creator_id: z.string(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
  feature_pets: z.boolean(),
  feature_inventory: z.boolean(),
  feature_account_book: z.boolean(),
  is_deleted: z.boolean(),
  deleted_at: z.iso.datetime().nullable()
});

export const CreateFamilyRequestData = z.object({
  name: z.string(),
  feature_pets: z.boolean(),
  feature_inventory: z.boolean(),
  feature_account_book: z.boolean(),
});

export const FamilyMembersResponseData = z.object({
  id: z.string(),
  family_id: z.string(),
  family_name: z.string(),
  user_id: z.string(),
  user_name: z.string(),
  is_primary: z.boolean(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
});