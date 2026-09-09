import { z } from "zod/v4";
import { create } from "zustand";
import config, { AppConfig } from "~/config";

export const useAppState = create<AppStata>((set) => ({
  config: config,
  user: undefined,
  setUser: (user: z.infer<typeof UserData>) => set(state=>({...state, user}))
}))

type AppStata = {
  config: z.infer<typeof AppConfig>,
  user? : z.infer<typeof UserData>,
  setUser : (user:z.infer<typeof UserData>)=>void
}

export const UserData = z.object({
  id: z.string(),
  login_id: z.string(),
  name: z.string(),
  created_at: z.date(),
  last_login_at: z.date(),
});