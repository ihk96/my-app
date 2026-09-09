import { z } from "zod";

export default {
  version: "0.0.1"
}

export const AppConfig = z.object({
  version: z.string()
})