import type { AxiosResponse } from "axios";
import { APIClient } from "./api-client";
import { z } from "zod";

export default {
  me: async function(){
    const res : AxiosResponse<z.infer<typeof UserResponseData>> = await APIClient.get("/users/me");
    return res;
  }
}

export const UserResponseData = z.object({
  id: z.string(),
  login_id: z.string(),
  name: z.string(),
  created_at: z.date(),
  last_login_at: z.date(),
});