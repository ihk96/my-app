import { http, HttpResponse } from "msw";
import type { z } from "zod";
import { UserInvitationResponseData, UserInvitationSignupRequestData, UserResponseData } from "~/services/users";

export const usersHandler = [
  http.get("/api/users/me", ()=>{

    // return HttpResponse.json(null, {status: 401})
    const userData : z.infer<typeof UserResponseData> = {
      id: "test",
      login_id: "test",
      name: "테스터",
      created_at: new Date().toISOString(),
      last_login_at: new Date().toISOString(),
      is_admin: true,
    }

    return HttpResponse.json(userData);
  }),
  http.get("/api/users/invitations/:id", ({params}) => {
    const id = params.id as string;
    if(id === "not-found") {  
      return HttpResponse.json(null, { status: 404 });
    }
    const invitationData: z.infer<typeof UserInvitationResponseData> = {
      id,
      invitation_code: "",
      is_used: false,
      name: "테스터",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    return HttpResponse.json(invitationData);
  }),
  http.post("/api/users/invitations/:id/sign_up", async ({params, request}) => {
    const id = params.id as string;
    const body = await request.json() as z.infer<typeof UserInvitationSignupRequestData>;
    const searchParams = new URL(request.url).searchParams;

    if(searchParams.has("mode")) {
      const mode = searchParams.get("mode");
      if(mode == "failed") {
        return HttpResponse.json(null, { status: 404 });
      }
    }
    

    return HttpResponse.json(null, { status: 200 });
  }),
]