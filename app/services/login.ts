import type { AxiosResponse } from "axios";
import { APIClient } from "./api-client";

export default {
  login: async function(id: string, password: string){
    const res : AxiosResponse = await APIClient.post("/login", {
      login_id: id, password
    });
    return res;
  }
}