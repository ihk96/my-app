import { z } from "zod/v4";
import { create } from "zustand";
import config, { AppConfig } from "~/config";

export const useAppState = create<AppState>((set) => ({
  config: config,
  user: undefined,
  setUser: (user: z.infer<typeof UserData>) => set(state=>({...state, user})),
  family: undefined,
  setFamily: (family: z.infer<typeof FamilyData>) => set(state=>({...state, family}))
}))

type AppState = {
  config: z.infer<typeof AppConfig>,
  user? : z.infer<typeof UserData>,
  setUser : (user:z.infer<typeof UserData>)=>void
  family? : z.infer<typeof FamilyData>,
  setFamily : (family:z.infer<typeof FamilyData>)=>void
}

export const UserData = z.object({
  id: z.string(),
  login_id: z.string(),
  name: z.string(),
  is_admin: z.boolean(),
  created_at: z.iso.datetime(),
  last_login_at: z.iso.datetime().optional(),
});

export const FamilyData = z.object({
  id: z.string(),
  name: z.string(),
  creator_id: z.string(),
  feature_pets: z.boolean(),
  feature_inventory: z.boolean(),
  feature_account_book: z.boolean(),
});