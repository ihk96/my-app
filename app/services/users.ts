import type { AxiosResponse } from "axios";
import { APIClient } from "./api-client";
import { z } from "zod/v4";

export default {
  me: async function(){
    const res : AxiosResponse<z.infer<typeof UserResponseData>> = await APIClient.get("/users/me");
    
    return res;
  },
  getInvitation: async function(id: string){
    const res : AxiosResponse<z.infer<typeof UserInvitationResponseData>> = await APIClient.get(`/users/invitations/${id}`);
  
    return res;
  },
  signupWithInvitation: async function(id: string, data: z.infer<typeof UserInvitationSignupRequestData>){
    const res : AxiosResponse<null> = await APIClient.post(`/users/invitations/${id}/sign_up`, data);

    return res;
  }
}

export const UserResponseData = z.object({
  id: z.string(),
  login_id: z.string(),
  name: z.string(),
  created_at: z.iso.datetime(),
  last_login_at: z.iso.datetime().nullable(),
  is_admin: z.boolean(),
});

export const UserInvitationResponseData = z.object({
  id: z.string(),
  invitation_code: z.string(),
  name: z.string(),
  is_used: z.boolean(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
});

export const UserInvitationSignupRequestData = z.object({
  invitation_code: z.string(),
  login_id: z.string(),
  password: z.string(),
  name: z.string(),
});