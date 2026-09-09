import { http, HttpResponse } from "msw";
import type { z } from "zod";
import { UserResponseData } from "~/services/users";

export const usersHandler = [
  http.get("/api/users/me", ()=>{

    // return HttpResponse.json(null, {status: 401})
    const userData : z.infer<typeof UserResponseData> = {
      id: "test",
      login_id: "test",
      name: "테스터",
      created_at: new Date(),
      last_login_at: new Date()
    }

    return HttpResponse.json(userData);
  })
]