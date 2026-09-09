import axios, {AxiosError, type AxiosRequestConfig} from "axios";
import {redirect} from "react-router";

export const APIClient = (()=>{

  const axiosInstance = axios.create({
    // @ts-ignore
    baseURL : "/api",
    withCredentials : true
  });
  axiosInstance.interceptors.response.use(response=>{
    return response;
  },(error: AxiosError)=>{
    if(error.status == 401){
      if(!error.config?.url?.includes("/login")){
          throw redirect("/login");
          // location.href="/login";
      }
    }
    throw error;
  });

  return axiosInstance;

})();