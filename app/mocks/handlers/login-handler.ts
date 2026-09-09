import {http, HttpResponse} from "msw";
import { z } from "zod";


export const loginHandler = [
	http.post("/api/login", async ({request})=>{
    
    const body = await request.json() as z.infer<typeof LoginBody>;
    
    if(!(body.login_id.trim() && body.password)){
      return HttpResponse.json(null, {status:400});
    }

    if(body.login_id.trim() == "test" && body.password == "test"){
      return HttpResponse.json(null, {status: 200});  
    }
    
		return HttpResponse.json(null, {status: 401});
	}),
]

const LoginBody = z.object({
  login_id: z.string(),
  password: z.string(),
})