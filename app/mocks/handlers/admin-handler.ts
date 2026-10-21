import { http, HttpResponse } from "msw";
import { v4 as uuidv4 } from "uuid";
import type { z } from "zod/v4";
import { AdminCreateInvitationRequestData, AdminInvitationResponseData } from "~/services/admin";

export const adminHandler = [
  http.get("/api/admin/users/invitations", () => {
    const invitations: z.infer<typeof AdminInvitationResponseData>[] = [
      {
        id: uuidv4().toString(),
        invitation_code: uuidv4().toString().substring(0,6),
        is_used: false,
        name: "Test User",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: uuidv4().toString(),
        invitation_code: uuidv4().toString().substring(0,6),
        is_used: true,
        name: "Another Test User",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    ];
    return HttpResponse.json(invitations);
  }),
  http.post("/api/admin/users/invitations", async ({request}) => {
    const body = await request.json() as z.infer<typeof AdminCreateInvitationRequestData>;

    const newInvitation: z.infer<typeof AdminInvitationResponseData> = {
      id: uuidv4().toString(),
      invitation_code: uuidv4().toString().substring(0,6),
      is_used: false,
      name: body.name,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return HttpResponse.json(newInvitation);
  }),
];