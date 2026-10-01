import { z } from "zod/v4";
import { APIClient } from "./api-client";
import type { AxiosResponse } from "axios";

export default {
  getInvitations: async function(){
    const res: AxiosResponse<z.infer<typeof AdminInvitationResponseData>[]> = await APIClient.get("/admin/users/invitations");
    return res;
  },
  createInvitation: async function(name: string){
    const body : z.infer<typeof AdminCreateInvitationRequestData> = { name };
    const res: AxiosResponse<z.infer<typeof AdminInvitationResponseData>> = await APIClient.post("/admin/users/invitations", body);
    return res;
  },


}


export const AdminInvitationResponseData = z.object({
  id: z.string(),
  invitation_code: z.string(),
  is_used: z.boolean(),
  name: z.string(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
});

export const AdminCreateInvitationRequestData = z.object({
  name: z.string(),
});